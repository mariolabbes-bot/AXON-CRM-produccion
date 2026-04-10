import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  HelpOutline as HelpIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import { SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH } from './Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationCenter from './common/NotificationCenter';

const TopBar = ({ title = 'Dashboard', subtitle = null, isMobile = false }) => {
  const { user } = useAuth();

  const { sidebarCollapsed, toggleSidebar } = useUI();
  const currentSidebarWidth = isMobile ? 0 : (sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: isMobile ? '100%' : `calc(100% - ${currentSidebarWidth}px)`,
        ml: isMobile ? 0 : `${currentSidebarWidth}px`,
        // El background y el blur se heredan de MuiAppBar en axonTheme
        borderBottom: '1px solid rgba(255,255,255,0.08)', 
        color: '#F8FAFC',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), margin 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: isMobile ? 56 : 70 }}>
        {/* Título de la Página + toggle */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {!isMobile && (
            <IconButton onClick={toggleSidebar} size="small">
              <MenuIcon />
            </IconButton>
          )}
          <Box>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              sx={{
                fontWeight: 700,
                color: '#FF5722', // Naranja AXON
                mb: subtitle ? 0 : 0
              }}
            >
              {title}
            </Typography>
            {subtitle && !isMobile && (
              <Typography
                variant="body2"
                sx={{
                  color: '#6B7280',
                  fontWeight: 500
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Acciones Rápidas */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: isMobile ? 0.5 : 1 }}>
          {/* Ayuda - Ocultar en móvil si falta espacio */}
          {!isMobile && (
            <Tooltip title="Ayuda">
              <IconButton
                sx={{
                  color: '#A3A3A3',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 87, 34, 0.1)',
                    color: '#FF5722'
                  }
                }}
              >
                <HelpIcon />
              </IconButton>
            </Tooltip>
          )}

          {/* Notificaciones */}
          <Tooltip title="Notificaciones">
            <NotificationCenter />
          </Tooltip>

          {/* Configuración - Ocultar en móvil, mover a menú inferior */}
          {!isMobile && (
            <Tooltip title="Configuración">
              <IconButton
                sx={{
                  color: '#A3A3A3',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 87, 34, 0.1)',
                    color: '#FF5722'
                  }
                }}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          )}

          {/* Logout para Móvil */}
          {isMobile && (
            <IconButton
              sx={{ color: '#E57A2D' }}
              onClick={() => {
                if (window.confirm('¿Está seguro que desea cerrar sesión?')) {
                  window.location.href = '/login'; // O usar context logout()
                }
              }}
            >
              <LogoutIcon />
            </IconButton>
          )}

          {/* Avatar del Usuario */}
          <Tooltip title={user?.nombre_completo || 'Usuario'}>
            <Avatar
              sx={{
                bgcolor: '#FF5722',
                width: isMobile ? 32 : 40,
                height: isMobile ? 32 : 40,
                fontWeight: 600,
                ml: 1,
                cursor: 'pointer',
                border: '2px solid #262626',
                '&:hover': {
                  borderColor: '#FF5722',
                }
              }}
            >
              {user?.nombre_completo?.charAt(0) || 'U'}
            </Avatar>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
