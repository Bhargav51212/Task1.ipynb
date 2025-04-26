import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  Grid,
  TextField,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { paymentService } from '../services/paymentService';

const PAYMENT_METHODS = [
  { id: 'phonepe', name: 'PhonePe', logo: '/images/phonepe.png' },
  { id: 'googlepay', name: 'Google Pay', logo: '/images/googlepay.png' },
  { id: 'paytm', name: 'Paytm', logo: '/images/paytm.png' },
];

const Payment = ({ totalAmount, onPaymentSuccess, orderId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [upiId, setUpiId] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [paymentId, setPaymentId] = useState(null);
  const [statusCheckInterval, setStatusCheckInterval] = useState(null);

  // Check if we're returning from payment
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const returnedPaymentId = params.get('paymentId');
    if (returnedPaymentId) {
      console.log('Returned from payment app with paymentId:', returnedPaymentId);
      verifyPayment(returnedPaymentId);
    }
  }, [location]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
    };
  }, [statusCheckInterval]);

  const validateUpiId = (id) => {
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
    return upiRegex.test(id);
  };

  const handleMethodChange = (event) => {
    setSelectedMethod(event.target.value);
    setError('');
  };

  const handleUpiChange = (event) => {
    setUpiId(event.target.value);
    setError('');
  };

  const startPaymentStatusCheck = (paymentId) => {
    console.log('Starting payment status check for:', paymentId);
    const interval = setInterval(async () => {
      try {
        console.log('Checking payment status...');
        const response = await paymentService.getPaymentStatus(paymentId);
        console.log('Status check response:', response);

        if (response.status === 'completed') {
          console.log('Payment completed successfully');
          clearInterval(interval);
          setShowDialog(false);
          onPaymentSuccess();
        } else if (response.status === 'failed') {
          console.log('Payment failed');
          clearInterval(interval);
          setShowDialog(false);
          setError('Payment failed. Please try again.');
          setIsProcessing(false);
        } else {
          console.log('Payment still pending');
        }
      } catch (error) {
        console.error('Status check error:', error);
        clearInterval(interval);
        setShowDialog(false);
        setError('Failed to verify payment status. Please contact support.');
        setIsProcessing(false);
      }
    }, 5000);

    setStatusCheckInterval(interval);
  };

  const handlePayment = async () => {
    try {
      setError('');
      setIsProcessing(true);

      // Validate inputs
      if (!selectedMethod) {
        throw new Error('Please select a payment method');
      }

      if (!validateUpiId(upiId)) {
        throw new Error('Please enter a valid UPI ID');
      }

      if (!orderId) {
        throw new Error('Order ID is required');
      }

      console.log('Starting payment process for order:', orderId);

      const paymentData = {
        orderId,
        amount: totalAmount,
        paymentMethod: selectedMethod,
        upiId,
      };

      console.log('Creating payment session with data:', paymentData);
      const response = await paymentService.createPaymentSession(paymentData);
      console.log('Payment session created:', response);

      setPaymentId(response.paymentId);
      setShowDialog(true);

      // Open UPI app
      const upiUrl = getUpiAppUrl(selectedMethod, response.paymentId, totalAmount, upiId);
      console.log('Redirecting to UPI app with URL:', upiUrl);
      window.location.href = upiUrl;

      // Start checking payment status
      startPaymentStatusCheck(response.paymentId);
    } catch (error) {
      console.error('Payment initiation error:', error);
      setError(error.message);
      setIsProcessing(false);
    }
  };

  const getUpiAppUrl = (method, paymentId, amount, upiId) => {
    const baseUrl = 'upi://pay';
    const params = new URLSearchParams({
      pa: upiId,
      pn: 'Your Store Name',
      tr: paymentId,
      am: amount,
      cu: 'INR',
      tn: `Order Payment - ${orderId}`,
    });

    return `${baseUrl}?${params.toString()}`;
  };

  const verifyPayment = async (paymentId) => {
    try {
      console.log('Verifying payment:', paymentId);
      const response = await paymentService.verifyPayment(paymentId);
      console.log('Verification response:', response);

      if (response.status === 'completed') {
        console.log('Payment verification successful');
        clearInterval(statusCheckInterval);
        setShowDialog(false);
        onPaymentSuccess();
      } else if (response.status === 'failed') {
        console.log('Payment verification failed');
        clearInterval(statusCheckInterval);
        setShowDialog(false);
        setError('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setError('Failed to verify payment status');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Payment Details
        </Typography>
        
        <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
          Total Amount: ₹{totalAmount}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <FormControl component="fieldset" sx={{ width: '100%' }}>
          <RadioGroup
            value={selectedMethod}
            onChange={handleMethodChange}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {PAYMENT_METHODS.map((method) => (
                <Paper
                  key={method.id}
                  variant="outlined"
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    border: selectedMethod === method.id ? '2px solid #1976d2' : '1px solid #e0e0e0',
                  }}
                >
                  <FormControlLabel
                    value={method.id}
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <img
                          src={method.logo}
                          alt={method.name}
                          style={{ height: 24, width: 'auto' }}
                          onError={(e) => {
                            console.error(`Failed to load ${method.name} logo`);
                            e.target.style.display = 'none';
                          }}
                        />
                        <Typography>{method.name}</Typography>
                      </Box>
                    }
                  />
                </Paper>
              ))}
            </Box>
          </RadioGroup>
        </FormControl>

        <TextField
          fullWidth
          label="UPI ID"
          variant="outlined"
          value={upiId}
          onChange={handleUpiChange}
          sx={{ mt: 2 }}
          placeholder="Enter your UPI ID (e.g., username@upi)"
          error={!!error && error.includes('UPI')}
          helperText={error && error.includes('UPI') ? error : ''}
        />

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePayment}
            disabled={!selectedMethod || !upiId || !!error || isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Pay Now'}
          </Button>
        </Box>
      </Paper>

      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        aria-labelledby="payment-dialog-title"
        aria-describedby="payment-dialog-description"
      >
        <DialogTitle id="payment-dialog-title">
          Complete Payment
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="payment-dialog-description">
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <CircularProgress />
            </Box>
            <div>
              <Typography variant="body1" align="center">
                Please complete the payment in your UPI app
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 1 }}>
                Payment ID: {paymentId}
              </Typography>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Payment; 