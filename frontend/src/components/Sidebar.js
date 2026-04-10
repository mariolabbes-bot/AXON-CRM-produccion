import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Chat as ChatIcon,
  ShoppingCart as VentasIcon,
  People as ClientesIcon,
  Inventory as ProductosIcon,
  Assessment as ReportesIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  UploadFile as ImportIcon,
  Security as AdminIcon,
  Map as MapIcon,
  CalendarMonth as PlannerIcon,
  AltRoute as RouteIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const SIDEBAR_WIDTH = 240;
const SIDEBAR_COLLAPSED_WIDTH = 72;

import { useUI } from '../contexts/UIContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      title: 'Asistente',
      icon: <ChatIcon />,
      path: '/assistant',
      color: '#E57A2D',
      highlighted: true
    },
    {
      title: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/',
      color: '#2B4F6F' // Azul Lubricar
    },
    {
      title: 'Ventas',
      icon: <VentasIcon />,
      path: '/ventas',
      color: '#10B981' // Verde
    },
    {
      title: 'Clientes',
      icon: <ClientesIcon />,
      path: '/clientes',
      color: '#A855F7' // Púrpura
    },
    {
      title: 'Reportes',
      icon: <ReportesIcon />,
      path: '/reportes',
      color: '#14B8A6', // Teal
      divider: true
    },
    {
      title: 'Mapa de Terreno',
      icon: <MapIcon />,
      path: '/mapa-visitas',
      color: '#3B82F6',
    },
    {
      title: 'Planificar Ruta',
      icon: <PlannerIcon />,
      path: '/planificar',
      color: '#8B5CF6',
    },
    {
      title: 'Mis Circuitos',
      icon: <RouteIcon />,
      path: '/mis-circuitos',
      color: '#F59E0B',
      sellerOnly: true,
      divider: true
    },
    {
      title: 'Configuraciones',
      icon: <SettingsIcon />,
      path: '/admin',
      color: '#6B7280', // Gris
      managerOnly: true,
      divider: true
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: SIDEBAR_WIDTH,
          boxSizing: 'border-box',
          borderRight: 'none',
          color: '#E2E8F0',
          overflowX: 'hidden',
          // El background y el blur se heredan de MuiDrawer en axonTheme
        },
      }}
    >
      {/* Logo y Título */}
      <Box sx={{ p: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '250px' }}>
        <img 
          src="/logo-axon-dark.png" 
          alt="AXON CRM Logo" 
          style={{ 
            maxWidth: '100%', 
            maxHeight: '200px', 
            objectFit: 'contain',
            marginBottom: '8px'
          }} 
        />
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

      {/* Usuario Actual */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar
          sx={{
            background: 'linear-gradient(135deg, #E06B32 0%, #FF8A50 100%)',
            boxShadow: '0 4px 10px rgba(224, 107, 50, 0.3)',
            width: 40,
            height: 40,
            fontWeight: 600,
          }}
        >
          {user?.nombre_completo?.charAt(0) || 'U'}
        </Avatar>
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: '#FFFFFF',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {user?.nombre_completo || 'Usuario'}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#9CA3AF',
                textTransform: 'capitalize'
              }}
            >
              {user?.rol?.toLowerCase() || 'vendedor'}
            </Typography>
          </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 1 }} />

      {/* Menú Principal */}
      <List sx={{ px: 1, flex: 1 }}>
        {menuItems.map((item) => {
          if (item.managerOnly && user?.rol?.toUpperCase() !== 'MANAGER') {
            return null;
          }
          if (item.sellerOnly && user?.rol?.toUpperCase() === 'MANAGER') {
            return null;
          }

          return (
            <React.Fragment key={item.title}>
              {item.divider && (
                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 1 }} />
              )}
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <Tooltip title="" placement="right" arrow>
                  <ListItemButton
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      borderRadius: 2,
                      color: isActive(item.path) ? '#FFFFFF' : '#94A3B8',
                      backgroundColor: isActive(item.path)
                        ? 'rgba(224, 107, 50, 0.15)'
                        : 'transparent',
                      borderLeft: isActive(item.path)
                        ? `4px solid #E06B32`
                        : '4px solid transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        color: '#FFFFFF',
                        transform: 'translateX(4px)'
                      },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: '#FFFFFF', // ICONOS BLANCOS SIEMPRE para mejor contraste
                        minWidth: 40,
                        transition: 'color 0.2s ease',
                        opacity: isActive(item.path) ? 1 : 0.85,
                        justifyContent: 'center', // Center icon when collapsed
                        mx: 0 // Force center
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                      <ListItemText
                        primary={item.title}
                        primaryTypographyProps={{
                          fontSize: '0.9375rem',
                          fontWeight: isActive(item.path) ? 600 : 500,
                          color: '#FFFFFF', // TEXTO BLANCO
                        }}
                      />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            </React.Fragment>
          );
        })}
      </List>

      {/* Logout */}
      <Box sx={{ p: 1 }}>
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 1 }} />
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              color: '#FFFFFF', // TEXTO BLANCO
              '&:hover': {
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#FFFFFF',
                '& .MuiListItemIcon-root': {
                  color: '#EF4444',
                },
              },
              transition: 'all 0.2s ease',
            }}
          >
            <ListItemIcon
              sx={{
                color: '#FFFFFF', // ICONO BLANCO para mejor contraste
                minWidth: 40,
                transition: 'color 0.2s ease',
                opacity: 0.85,
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Cerrar Sesión"
              primaryTypographyProps={{
                fontSize: '0.9375rem',
                fontWeight: 500,
                color: '#FFFFFF', // TEXTO BLANCO
              }}
            />
          </ListItemButton>
        </ListItem>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
export { SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH };
