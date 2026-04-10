const pool = require('../../db');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const { updateJobStatus } = require('../jobManager');
const { parseExcelDate, parseNumeric, formatRut } = require('./utils');

async function processVentasFileAsync(jobId, filePath, originalname) {
    const client = await pool.connect();

    try {
        console.log(`🔵 [AXON CRM - Job ${jobId}] Procesando Ventas: ${originalname}`);
        await updateJobStatus(jobId, 'processing');

        // Leer Excel
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { raw: true });

        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('El archivo Excel no contiene filas.');
        }

        const headers = Object.keys(data[0] || {});
        const findCol = (patterns) => headers.find(h => patterns.some(p => p.test(h))) || null;

        // Columnas esperadas para AXON CORE
        const colFolio = findCol([/^Folio$/i, /^Factura$/i, /^Invoice/i]);
        const colFecha = findCol([/^Fecha/i, /^Date/i]);
        const colMonto = findCol([/^Monto$/i, /^Total$/i, /^Neto$/i, /^Valor/i]);
        const colRutCliente = findCol([/^RUT.*Cliente/i, /^RUT$/i, /^Identificador/i]);

        if (!colFolio || !colFecha || !colRutCliente || !colMonto) {
            throw new Error(`Faltan columnas requeridas en el archivo. Mínimo requerido: Folio, Fecha, RUT Cliente, Monto`);
        }

        // Cargar Clientes para mapeo estricto
        const clientsRes = await client.query("SELECT id, rut FROM clients");
        const clientsMap = new Map(clientsRes.rows.map(c => [c.rut, c.id]));

        const toImport = [];
        const missingClients = new Set();
        let importedCount = 0;

        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const folio = row[colFolio] ? String(row[colFolio]).trim() : null;
            const fecha = parseExcelDate(row[colFecha]);
            const monto = parseNumeric(row[colMonto]);
            const rutCrudo = row[colRutCliente] ? String(row[colRutCliente]).trim() : null;

            if (!folio || !fecha || !monto || !rutCrudo) continue;

            const rutCliente = formatRut(rutCrudo);

            // Mapeo Estricto
            const clientId = clientsMap.get(rutCliente);

            if (!clientId) {
                missingClients.add(rutCliente);
                continue; // AXON exige integridad relacional perfecta. Si no existe, no lo carga (o falla).
            }

            toImport.push({
                client_id: clientId,
                invoice_number: folio,
                invoice_date: fecha,
                net_amount: monto
            });
        }

        if (toImport.length > 0) {
            console.log(`✅ [Job ${jobId}] Importando ${toImport.length} facturas válidas...`);
            
            await client.query('BEGIN');
            const insertQuery = `
                INSERT INTO sales (client_id, invoice_number, invoice_date, net_amount)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (client_id, invoice_number) DO UPDATE SET
                    invoice_date = EXCLUDED.invoice_date,
                    net_amount = EXCLUDED.net_amount
            `;

            for (const item of toImport) {
                await client.query(insertQuery, [
                    item.client_id,
                    item.invoice_number,
                    item.invoice_date,
                    item.net_amount
                ]);
                importedCount++;
            }
            await client.query('COMMIT');
        }

        let pendingReportPath = null;
        if (missingClients.size > 0) {
            const reportWB = XLSX.utils.book_new();
            const clientData = Array.from(missingClients).map(c => ({ 'RUT Faltante': c }));
            XLSX.utils.book_append_sheet(reportWB, XLSX.utils.json_to_sheet(clientData), 'Clientes Faltantes');
            const reportDir = 'uploads/reports';
            if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });
            pendingReportPath = path.join(reportDir, `clientes_faltantes_${jobId}.xlsx`);
            XLSX.writeFile(reportWB, pendingReportPath);
            console.warn(`[Job ${jobId}] ${missingClients.size} clientes no existían en sistema. Facturas ignoradas.`);
        }

        const result = {
            success: true,
            totalRows: data.length,
            imported: importedCount,
            missingClients: Array.from(missingClients),
            pendingReportUrl: pendingReportPath ? `/api/import/download-report/${path.basename(pendingReportPath)}` : null
        };

        await updateJobStatus(jobId, 'completed', {
            totalRows: data.length, 
            importedRows: importedCount, 
            resultData: result 
        });

        return result;

    } catch (error) {
        await client.query('ROLLBACK');
        console.error(`❌ [Job ${jobId}] Falló:`, error);
        await updateJobStatus(jobId, 'failed', { errorMessage: error.message });
        throw error;
    } finally {
        client.release();
    }
}
module.exports = { processVentasFileAsync };
