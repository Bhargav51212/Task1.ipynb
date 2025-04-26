import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import theme from './theme';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import OrderSuccessPage from './pages/OrderSuccessPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminOrderDetails from './pages/AdminOrderDetails';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';

import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
              width: '100%'
            }}
          >
            <Box
              component="main"
              sx={{
                flex: 1,
                width: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Home />} />
                  <Route path="products" element={<Products />} />
                  <Route path="products/:id" element={<ProductDetails />} />
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route path="about" element={<AboutUs />} />
                  <Route path="contact" element={<Contact />} />
                  
                  {/* Protected Routes */}
                  <Route
                    path="checkout"
                    element={
                      <PrivateRoute>
                        <Checkout />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="orders"
                    element={
                      <PrivateRoute>
                        <Orders />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="orders/:orderId"
                    element={
                      <PrivateRoute>
                        <OrderDetails />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="order-success/:orderId"
                    element={
                      <PrivateRoute>
                        <OrderSuccessPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="order-success"
                    element={
                      <PrivateRoute>
                        <OrderSuccessPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="profile"
                    element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    }
                  />
                  
                  {/* Admin Routes */}
                  <Route
                    path="admin"
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="admin/products"
                    element={
                      <AdminRoute>
                        <AdminProducts />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="admin/products/:productId/edit"
                    element={
                      <AdminRoute>
                        <EditProduct />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="admin/orders"
                    element={
                      <AdminRoute>
                        <AdminOrders />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="admin/orders/:orderId"
                    element={
                      <AdminRoute>
                        <AdminOrderDetails />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="admin/add-product"
                    element={
                      <AdminRoute>
                        <AddProduct />
                      </AdminRoute>
                    }
                  />
                  
                  {/* Catch all route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </Box>
          </Box>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
