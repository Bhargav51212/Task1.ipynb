import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Box,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  TextField,
  IconButton,
} from '@mui/material';
import { getOrderDetails, updateOrderStatus } from '../redux/slices/orderSlice';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { formatDate } from '../utils/formatDate';

const ORDER_STATUSES = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  READY_TO_SHIP: 'ready_to_ship',
  DISPATCHED: 'dispatched',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

const STATUS_LABELS = {
  [ORDER_STATUSES.PENDING]: 'Pending',
  [ORDER_STATUSES.PROCESSING]: 'Processing',
  [ORDER_STATUSES.READY_TO_SHIP]: 'Ready to Ship',
  [ORDER_STATUSES.DISPATCHED]: 'Dispatched',
  [ORDER_STATUSES.SHIPPED]: 'Shipped',
  [ORDER_STATUSES.DELIVERED]: 'Delivered',
  [ORDER_STATUSES.CANCELLED]: 'Cancelled',
};

const AdminOrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentOrder: order, loading, error, updateLoading } = useSelector((state) => state.orders);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderDetails(orderId));
    }
  }, [dispatch, orderId]);

  useEffect(() => {
    if (order) {
      setSelectedStatus(order.status || 'pending');
    }
  }, [order]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case ORDER_STATUSES.PENDING:
        return 'warning';
      case ORDER_STATUSES.PROCESSING:
      case ORDER_STATUSES.READY_TO_SHIP:
        return 'info';
      case ORDER_STATUSES.DISPATCHED:
      case ORDER_STATUSES.SHIPPED:
        return 'primary';
      case ORDER_STATUSES.DELIVERED:
        return 'success';
      case ORDER_STATUSES.CANCELLED:
        return 'error';
      default:
        return 'default';
    }
  };

  const handleStatusUpdate = async () => {
    try {
      await dispatch(updateOrderStatus({ orderId, status: selectedStatus })).unwrap();
      await dispatch(getOrderDetails(orderId));
      setOpenStatusDialog(false);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Order not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate('/admin/orders')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Order Details
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Order Summary */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6">Order #{order._id}</Typography>
              <Chip
                label={STATUS_LABELS[order.status] || order.status}
                color={getStatusColor(order.status)}
                sx={{ textTransform: 'capitalize' }}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items?.map((item) => (
                    <TableRow key={item.product?._id || item._id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box
                            component="img"
                            src={item.product?.images?.[0] ? `http://localhost:5000/${item.product.images[0]}` : '/placeholder.png'}
                            alt={item.product?.name}
                            sx={{
                              width: 60,
                              height: 60,
                              objectFit: 'cover',
                              borderRadius: 1,
                              border: '1px solid',
                              borderColor: 'divider'
                            }}
                          />
                          <Box>
                            <Typography variant="subtitle2">
                              {item.product?.name || 'Product Name Unavailable'}
                            </Typography>
                            {item.product?._id && (
                            <Typography variant="caption" color="text.secondary">
                                SKU: {item.product._id.slice(-6).toUpperCase()}
                            </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">₹{item.price?.toFixed(2)}</TableCell>
                      <TableCell align="right">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} align="right">
                      <Typography variant="subtitle1">Subtotal:</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle1">
                        ₹{order.totalAmount?.toFixed(2) || '0.00'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  {order.shippingPrice > 0 && (
                    <TableRow>
                      <TableCell colSpan={3} align="right">
                        <Typography variant="body2">Shipping:</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          ₹{order.shippingPrice?.toFixed(2) || '0.00'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell colSpan={3} align="right">
                      <Typography variant="h6">Total:</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6">
                        ₹{((order.totalAmount || 0) + (order.shippingPrice || 0)).toFixed(2)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Customer and Shipping Info */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ 
                color: 'primary.main',
                fontWeight: 600,
                pb: 1,
                borderBottom: '2px solid',
                borderColor: 'primary.light'
              }}>
                Customer Information
              </Typography>
              <Box sx={{ mt: 2, display: 'grid', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 100 }}>
                    Name:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {order.shippingAddress?.name || order.user?.name || 'Guest User'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 100 }}>
                    Email:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {order.user?.email || 'No email provided'}
                  </Typography>
                </Box>
                {(order.shippingAddress?.phone || order.user?.phone) && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 100 }}>
                      Phone:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {order.shippingAddress?.phone || order.user?.phone}
                    </Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 100 }}>
                    Order Date:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {formatDate(order.createdAt)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 100 }}>
                    Status:
                  </Typography>
                  <Chip
                    label={STATUS_LABELS[order.status] || 'Pending'}
                    color={getStatusColor(order.status)}
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Shipping Address
              </Typography>
              {order.shippingAddress ? (
                <>
                  <Typography variant="body2">
                    <strong>Name:</strong> {order.shippingAddress.name}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Phone:</strong> {order.shippingAddress.phone}
                  </Typography>
                  <Typography variant="body2">
                    {order.shippingAddress.street}
                  </Typography>
                  <Typography variant="body2">
                    {order.shippingAddress.city}
                    {order.shippingAddress.state && `, ${order.shippingAddress.state}`}
                  </Typography>
                  <Typography variant="body2">
                    {order.shippingAddress.zipCode}
                  </Typography>
                  <Typography variant="body2">
                    {order.shippingAddress.country}
                  </Typography>
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No shipping address provided
                </Typography>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Payment Information
              </Typography>
              <Typography variant="body2">
                <strong>Method:</strong> {order.paymentMethod || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Status:</strong>{' '}
                <Chip
                  label={order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                  color={order.paymentStatus === 'paid' ? 'success' : 'warning'}
                  size="small"
                />
              </Typography>
              <Typography variant="body2">
                <strong>Amount:</strong> ₹{order.totalAmount?.toFixed(2) || '0.00'}
              </Typography>

              <Box mt={3}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => setOpenStatusDialog(true)}
                >
                  Update Order Status
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Status Update Dialog */}
        <Dialog open={openStatusDialog} onClose={() => setOpenStatusDialog(false)}>
          <DialogTitle>Update Order Status</DialogTitle>
          <DialogContent>
            <TextField
              select
              fullWidth
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              margin="dense"
            >
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenStatusDialog(false)}>Cancel</Button>
            <Button
              onClick={handleStatusUpdate}
              variant="contained"
              color="primary"
              disabled={updateLoading}
            >
              {updateLoading ? 'Updating...' : 'Update'}
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Container>
  );
};

export default AdminOrderDetails; 