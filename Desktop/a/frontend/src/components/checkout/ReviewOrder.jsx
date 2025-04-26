import React from 'react';
import { useSelector } from 'react-redux';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Grid,
  Box,
  Button,
  Divider,
  Paper,
} from '@mui/material';

const ReviewOrder = ({ shippingData, paymentData, onSubmit }) => {
  const { items } = useSelector((state) => state.cart);

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ shippingData, paymentData, items, total: calculateTotal() });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, mb: { xs: 3, md: 0 } }}>
            <List disablePadding>
              {items.map((item) => (
                <ListItem key={item._id} sx={{ py: 1 }}>
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.name}
                    sx={{
                      width: 64,
                      height: 64,
                      objectFit: 'cover',
                      borderRadius: 1,
                      mr: 2,
                    }}
                  />
                  <ListItemText
                    primary={item.name}
                    secondary={`Quantity: ${item.quantity}`}
                  />
                  <Typography variant="body2">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </ListItem>
              ))}
              <Divider sx={{ my: 2 }} />
              <ListItem sx={{ py: 1 }}>
                <ListItemText primary="Total" />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  ₹{calculateTotal().toFixed(2)}
                </Typography>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Shipping Address
                </Typography>
                <Typography gutterBottom>{shippingData.fullName}</Typography>
                <Typography gutterBottom>{shippingData.addressLine1}</Typography>
                {shippingData.addressLine2 && (
                  <Typography gutterBottom>{shippingData.addressLine2}</Typography>
                )}
                <Typography gutterBottom>
                  {shippingData.city}, {shippingData.state} {shippingData.postalCode}
                </Typography>
                <Typography gutterBottom>Phone: {shippingData.phone}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Payment Method
                </Typography>
                <Typography gutterBottom>
                  {paymentData.paymentMethod.charAt(0).toUpperCase() + 
                   paymentData.paymentMethod.slice(1)} UPI
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
        >
          Place Order
        </Button>
      </Box>
    </form>
  );
};

export default ReviewOrder; 