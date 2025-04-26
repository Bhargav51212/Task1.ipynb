import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Divider,
  Stack,
  Alert,
  Chip,
  Grid,
} from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon,
  LocalShipping as ShippingIcon,
  Receipt as ReceiptIcon,
  Email as EmailIcon,
} from '@mui/icons-material';

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [currentTime] = useState(new Date());
  
  // Estimated delivery date (5-7 days from now)
  const estimatedDelivery = new Date(currentTime);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);
  
  // Format dates
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    // Log for debugging
    console.log('OrderSuccessPage rendered with orderId:', orderId);
  }, [orderId]);

  return (
    <Container maxWidth="md" sx={{ mt: { xs: 4, md: 8 }, mb: 8 }}>
      <Alert 
        severity="success" 
        variant="filled"
        sx={{ 
          mb: 3, 
          display: 'flex', 
          alignItems: 'center',
          fontSize: '1.1rem'
        }}
      >
        Your order has been successfully placed and confirmed!
      </Alert>
      
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 3, md: 5 }, 
          textAlign: 'center',
          borderRadius: 2,
          background: 'linear-gradient(to bottom, #fff, #f9fafb)'
        }}
      >
        <Box sx={{ mb: 4 }}>
          <CheckCircleIcon
            color="success"
            sx={{ fontSize: 80, mb: 2 }}
          />
          
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Thank You For Your Order!
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            We've received your order and are processing it right away. 
            A confirmation has been sent to your email.
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
            <Chip 
              icon={<ReceiptIcon />} 
              label="Order Confirmed" 
              color="success" 
              variant="outlined" 
            />
            <Chip 
              icon={<EmailIcon />} 
              label="Email Sent" 
              color="primary" 
              variant="outlined" 
            />
          </Box>
        </Box>

        {orderId && (
          <Box 
            sx={{ 
              bgcolor: 'background.paper', 
              p: 3, 
              borderRadius: 2, 
              mb: 4,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} sx={{ borderRight: { md: '1px solid', borderColor: 'divider' }, pb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  ORDER ID
                </Typography>
                <Typography variant="h6" fontWeight="medium">
                  {orderId}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Order Date: {formatDate(currentTime)}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  ESTIMATED DELIVERY
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <ShippingIcon color="primary" />
                  <Typography variant="h6" fontWeight="medium" color="primary.main">
                    {formatDate(estimatedDelivery)}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  We'll notify you when your order ships
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}

        <Typography variant="body1" paragraph>
          We're preparing your items for shipping. You'll receive an email notification once your order is on its way.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          justifyContent="center"
        >
          {orderId && (
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate(`/orders/${orderId}`)}
              sx={{ minWidth: 180 }}
            >
              View Order Details
            </Button>
          )}
          
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/products')}
            sx={{ minWidth: 180 }}
          >
            Continue Shopping
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default OrderSuccessPage; 