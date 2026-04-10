import { createTheme } from '@mui/material/styles';

// Paleta Premium "Dark Glass"
const colors = {
  primary: '#E06B32',     // Naranja opaco/dorado suave (Tangerine oscuro)
  primaryLight: '#FF8A50',
  primaryGlow: 'rgba(224, 107, 50, 0.4)',
  
  secondary: '#20A892',   // Verde agua opaco/salvia (Teal suave)
  secondaryLight: '#48D1BB',
  secondaryGlow: 'rgba(32, 168, 146, 0.4)',

  background: '#0B0F19',  // Indigo oscuro profundo, no negro puro, descansa la vista
  paper: 'rgba(21, 28, 43, 0.6)', // Transparente para glassmorphism
  paperSolid: '#151C2B',

  text: '#E2E8F0',        // Slate 200 - Blanco azulado relajante
  textMuted: '#94A3B8',   // Slate 400
  
  borderLine: 'rgba(255, 255, 255, 0.08)',
};

const axonTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: colors.primary, light: colors.primaryLight, contrastText: '#FFFFFF' },
    secondary: { main: colors.secondary, light: colors.secondaryLight, contrastText: '#FFFFFF' },
    background: { default: colors.background, paper: colors.paperSolid },
    text: { primary: colors.text, secondary: colors.textMuted },
  },

  typography: {
    fontFamily: '"Outfit", "Inter", "Roboto", sans-serif',
    h1: { fontWeight: 700, fontSize: '2.5rem', letterSpacing: '-0.02em', color: '#F8FAFC' },
    h2: { fontWeight: 700, fontSize: '2rem', letterSpacing: '-0.01em', color: '#F8FAFC' },
    h3: { fontWeight: 600, fontSize: '1.75rem', color: '#F8FAFC' },
    h4: { fontWeight: 600, fontSize: '1.5rem', color: '#F1F5F9' },
    h5: { fontWeight: 600, fontSize: '1.25rem', color: '#F1F5F9' },
    h6: { fontWeight: 600, fontSize: '1rem', color: '#E2E8F0' },
    button: { fontWeight: 500, letterSpacing: '0.02em', textTransform: 'none' },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.background,
          /* Un fondo con esferas sutiles difuminadas para que el Glassmorphism se vea premium */
          backgroundImage: `
            radial-gradient(circle at 15% 50%, rgba(224, 107, 50, 0.04), transparent 25%),
            radial-gradient(circle at 85% 30%, rgba(32, 168, 146, 0.04), transparent 25%)
          `,
          backgroundAttachment: 'fixed',
          color: colors.text,
          transition: 'all 0.3s ease-in-out',
        },
        // Scrollbar personalizado
        '*::-webkit-scrollbar': { width: '8px', height: '8px' },
        '*::-webkit-scrollbar-track': { background: 'transparent' },
        '*::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '10px' },
        '*::-webkit-scrollbar-thumb:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontWeight: 600,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:active': { transform: 'scale(0.97)' }
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${colors.primary} 0%, #C35B29 100%)`,
          boxShadow: `0 4px 15px ${colors.primaryGlow}`,
          '&:hover': { 
            background: `linear-gradient(135deg, #FF8A50 0%, ${colors.primary} 100%)`,
            boxShadow: `0 6px 20px ${colors.primaryGlow}`,
            transform: 'translateY(-2px)'
          },
        },
        containedSecondary: {
          background: `linear-gradient(135deg, ${colors.secondary} 0%, #1A8C7A 100%)`,
          boxShadow: `0 4px 15px ${colors.secondaryGlow}`,
          '&:hover': { 
            background: `linear-gradient(135deg, #48D1BB 0%, ${colors.secondary} 100%)`,
            boxShadow: `0 6px 20px ${colors.secondaryGlow}`,
            transform: 'translateY(-2px)'
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: colors.paper,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: `1px solid ${colors.borderLine}`,
          backgroundImage: 'none',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': { 
            transform: 'translateY(-3px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
            border: `1px solid rgba(255, 255, 255, 0.15)`
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { 
          backgroundColor: colors.paper, 
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: `1px solid ${colors.borderLine}`,
          backgroundImage: 'none',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { 
          backgroundColor: 'rgba(11, 15, 25, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          backgroundImage: 'none',
          boxShadow: 'none',
          borderBottom: `1px solid ${colors.borderLine}`
        },
      },
    },
    MuiDrawer: {
      styleOverrides: { 
        paper: { 
          backgroundColor: 'rgba(11, 15, 25, 0.8)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          backgroundImage: 'none',
          borderRight: `1px solid ${colors.borderLine}`
        } 
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          '& .MuiTableCell-head': { 
            fontWeight: 600, 
            color: colors.text, 
            borderBottom: `1px solid ${colors.borderLine}`,
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            letterSpacing: '0.05em'
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: `1px solid rgba(255, 255, 255, 0.04)` }
      }
    }
  },
});

export default axonTheme;
