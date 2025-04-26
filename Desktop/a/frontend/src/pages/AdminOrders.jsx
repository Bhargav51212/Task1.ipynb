import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  LocalShipping as LocalShippingIcon,
  Inventory as InventoryIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { fetchOrders, updateOrderStatus } from '../redux/slices/orderSlice';
import { useNavigate } from 'react-router-dom';

const ORDER_STATUSES = {
  ALL: 'all',
  PENDING: 'pending',
  PROCESSING: 'processing',
  READY_TO_SHIP: 'ready_to_ship',
  DISPATCHED: 'dispatched',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

const PAYMENT_STATUSES = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

const STATUS_LABELS = {
  [ORDER_STATUSES.ALL]: 'All Orders',
  [ORDER_STATUSES.PENDING]: 'Pending',
  [ORDER_STATUSES.PROCESSING]: 'Processing',
  [ORDER_STATUSES.READY_TO_SHIP]: 'Ready to Ship',
  [ORDER_STATUSES.DISPATCHED]: 'Dispatched',
  [ORDER_STATUSES.SHIPPED]: 'Shipped',
  [ORDER_STATUSES.DELIVERED]: 'Delivered',
  [ORDER_STATUSES.CANCELLED]: 'Cancelled',
};

const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUSES.PENDING]: 'Pending',
  [PAYMENT_STATUSES.COMPLETED]: 'Completed',
  [PAYMENT_STATUSES.FAILED]: 'Failed',
  [PAYMENT_STATUSES.REFUNDED]: 'Refunded',
};

const AdminOrders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState(ORDER_STATUSES.ALL);
  const [searchQuery, setSearchQuery] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [paymentStatusDialogOpen, setPaymentStatusDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('');

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case ORDER_STATUSES.SHIPPED:
      case ORDER_STATUSES.DISPATCHED:
        return <LocalShippingIcon fontSize="small" />;
      case ORDER_STATUSES.PROCESSING:
      case ORDER_STATUSES.READY_TO_SHIP:
        return <InventoryIcon fontSize="small" />;
      case ORDER_STATUSES.DELIVERED:
        return <CheckCircleIcon fontSize="small" />;
      default:
        return null;
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !selectedStatus) return;
    
    setUpdateLoading(true);
    try {
      await dispatch(updateOrderStatus({ 
        orderId: selectedOrder._id, 
        status: selectedStatus 
      })).unwrap();
      dispatch(fetchOrders());
      setStatusDialogOpen(false);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handlePaymentStatusUpdate = async () => {
    if (!selectedOrder || !selectedPaymentStatus) return;
    
    setUpdateLoading(true);
    try {
      await dispatch(updateOrderStatus({ 
        orderId: selectedOrder._id, 
        paymentStatus: selectedPaymentStatus 
      })).unwrap();
      dispatch(fetchOrders());
      setPaymentStatusDialogOpen(false);
    } catch (error) {
      console.error('Failed to update payment status:', error);
    } finally {
      setUpdateLoading(false);
    }
  };

  const openStatusDialog = (order) => {
    setSelectedOrder(order);
    setSelectedStatus(order.status);
    setStatusDialogOpen(true);
  };

  const openPaymentStatusDialog = (order) => {
    setSelectedOrder(order);
    setSelectedPaymentStatus(order.paymentStatus);
    setPaymentStatusDialogOpen(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredOrders = orders?.filter((order) => {
    const matchesStatus = filterStatus === ORDER_STATUSES.ALL || order.status.toLowerCase() === filterStatus;
    const matchesSearch = 
      searchQuery === '' ||
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  }) || [];

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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Order Management
        </Typography>
        <Box display="flex" gap={2}>
          <TextField
            select
            size="small"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            sx={{ width: 150 }}
          >
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <MenuItem key={value} value={value}>{label}</MenuItem>
            ))}
          </TextField>
          <TextField
            size="small"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: 200 }}
          />
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Items</TableCell>
              <TableCell align="right">Total Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order) => (
                <TableRow key={order._id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        component="img"
                        src={order.items?.[0]?.product?.images?.[0] ? `http://localhost:5000/${order.items[0].product.images[0]}` : '/placeholder.png'}
                        alt={order.items[0]?.product?.name || 'Product Image'}
                        sx={{
                          width: 48,
                          height: 48,
                          objectFit: 'cover',
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'divider'
                        }}
                      />
                      <Typography variant="body2">{order._id}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {order.user?.name || 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {order.user?.email || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {order.items.map(item => item.product?.name || 'Unknown Product').join(', ')}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">₹{order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip
                      label={STATUS_LABELS[order.status] || order.status}
                      color={getStatusColor(order.status)}
                      size="small"
                      onClick={() => openStatusDialog(order)}
                      sx={{ textTransform: 'capitalize', cursor: 'pointer' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={PAYMENT_STATUS_LABELS[order.paymentStatus] || order.paymentStatus}
                      color={order.paymentStatus === 'completed' ? 'success' : 'warning'}
                      size="small"
                      variant="outlined"
                      onClick={() => openPaymentStatusDialog(order)}
                      sx={{ textTransform: 'capitalize', cursor: 'pointer' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1} justifyContent="center">
                      <Tooltip title="Edit Order">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/admin/orders/${order._id}/edit`)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => navigate(`/admin/orders/${order._id}`)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            {filteredOrders.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    No orders found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Order Status Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            margin="dense"
            label="Status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {Object.entries(STATUS_LABELS)
              .filter(([key]) => key !== 'all')
              .map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleStatusUpdate}
            variant="contained"
            disabled={updateLoading}
          >
            {updateLoading ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Status Dialog */}
      <Dialog open={paymentStatusDialogOpen} onClose={() => setPaymentStatusDialogOpen(false)}>
        <DialogTitle>Update Payment Status</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            margin="dense"
            label="Payment Status"
            value={selectedPaymentStatus}
            onChange={(e) => setSelectedPaymentStatus(e.target.value)}
          >
            {Object.entries(PAYMENT_STATUS_LABELS).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentStatusDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handlePaymentStatusUpdate}
            variant="contained"
            disabled={updateLoading}
          >
            {updateLoading ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminOrders; 