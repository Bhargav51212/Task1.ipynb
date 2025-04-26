import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  Inventory as InventoryIcon,
  Dashboard as DashboardIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  ShoppingBag as ShoppingBagIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import { logout } from '../redux/slices/authSlice';
import Footer from '../components/Footer';

const MainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { totalQuantity = 0 } = useSelector((state) => state.cart || {});

  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleCloseUserMenu();
    navigate('/');
  };

  const menuItems = [
    { text: 'Home', path: '/', icon: <ShoppingBagIcon /> },
    { text: 'Products', path: '/products', icon: <InventoryIcon /> },
  ];

  // Add cart to mobile menu items separately
  const mobileMenuItems = [
    ...menuItems,
    { 
      text: 'Cart',
      path: '/checkout',
      icon: (
        <Badge badgeContent={totalQuantity} color="error">
          <ShoppingCartIcon />
        </Badge>
      )
    },
  ];

  const userMenuItems = user ? [
    { text: 'Profile', path: '/profile', icon: <PersonIcon /> },
    ...(user.role === 'admin' ? [
      { text: 'Dashboard', path: '/admin', icon: <DashboardIcon /> },
      { text: 'Admin Orders', path: '/admin/orders', icon: <ShoppingBagIcon /> }
    ] : [
      { text: 'My Orders', path: '/orders', icon: <ShoppingBagIcon /> }
    ]),
  ] : [
    { text: 'Login', path: '/login', icon: <LoginIcon /> },
    { text: 'Register', path: '/register', icon: <PersonIcon /> },
  ];

  const renderMobileMenu = () => (
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={handleMobileMenuToggle}
      sx={{
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" noWrap component="div">
          Vasundhara Saree Center
        </Typography>
      </Box>
      <List>
        {mobileMenuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              handleMobileMenuToggle();
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        {userMenuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              handleMobileMenuToggle();
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        {user && (
          <ListItem
            button
            onClick={() => {
              handleLogout();
              handleMobileMenuToggle();
            }}
          >
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        )}
      </List>
    </Drawer>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar 
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: 'primary.main',
          borderBottom: '1px solid',
          borderColor: 'primary.dark',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {isMobile && (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleMobileMenuToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ 
                flexGrow: 0, 
                display: { xs: 'none', md: 'flex' }, 
                mr: 4, 
                cursor: 'pointer',
                fontWeight: 600
              }}
              onClick={() => navigate('/')}
            >
              Vasundhara Saree Center
            </Typography>

            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ 
                flexGrow: 1, 
                display: { xs: 'flex', md: 'none' }, 
                cursor: 'pointer',
                fontWeight: 600
              }}
              onClick={() => navigate('/')}
            >
              Vasundhara Saree Center
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  onClick={() => navigate(item.path)}
                  sx={{ 
                    my: 2, 
                    color: 'white', 
                    display: 'block',
                    '&:hover': {
                      backgroundColor: 'primary.dark'
                    }
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
              <IconButton
                color="inherit"
                onClick={() => navigate('/checkout')}
                sx={{ mr: 2 }}
              >
                <Badge badgeContent={totalQuantity} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>

              {!isMobile && user ? (
                <>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 2 }}>
                      <Avatar alt={user.name} src="/static/images/avatar/2.jpg" />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    {userMenuItems.map((item) => (
                      <MenuItem
                        key={item.text}
                        onClick={() => {
                          navigate(item.path);
                          handleCloseUserMenu();
                        }}
                      >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <Typography textAlign="center">{item.text}</Typography>
                      </MenuItem>
                    ))}
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon><LogoutIcon /></ListItemIcon>
                      <Typography textAlign="center">Logout</Typography>
                    </MenuItem>
                  </Menu>
                </>
              ) : !isMobile ? (
                <Box sx={{ display: 'flex' }}>
                  <Button
                    color="inherit"
                    onClick={() => navigate('/login')}
                    sx={{ ml: 1 }}
                  >
                    Login
                  </Button>
                  <Button
                    color="inherit"
                    onClick={() => navigate('/register')}
                    sx={{ ml: 1 }}
                  >
                    Register
                  </Button>
                </Box>
              ) : null}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {renderMobileMenu()}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          marginTop: '64px' // Height of the AppBar
        }}
      >
        <Outlet />
      </Box>

      <Footer />
    </Box>
  );
};

export default MainLayout; 