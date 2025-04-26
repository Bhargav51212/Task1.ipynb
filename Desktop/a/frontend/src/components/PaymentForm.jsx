import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Divider,
} from '@mui/material';
import { paymentService } from '../services/paymentService';

const PaymentForm = ({ orderAmount, orderId, onPaymentSuccess, onPaymentError }) => {
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [qrCode, setQrCode] = useState(null);

  const handleUPIPayment = async () => {
    try {
      setLoading(true);
      setError('');

      if (!upiId) {
        setError('Please enter your UPI ID');
        return;
      }

      // First generate QR code
      const qrResponse = await paymentService.generateQRCode(orderId, orderAmount);
      setQrCode(qrResponse.qrCode);

      // Initiate UPI payment
      const paymentResponse = await paymentService.initiateUPIPayment(
        orderId,
        orderAmount,
        upiId
      );

      // Start polling for payment status
      const checkStatus = async () => {
        try {
          const statusResponse = await paymentService.checkPaymentStatus(orderId);
          if (statusResponse.status === 'SUCCESS') {
            onPaymentSuccess(statusResponse);
          } else if (statusResponse.status === 'PENDING') {
            setTimeout(checkStatus, 3000); // Check again after 3 seconds
          } else {
            throw new Error('Payment failed or was cancelled');
          }
        } catch (error) {
          setError(error.message || 'Failed to check payment status');
          onPaymentError(error);
        }
      };

      setTimeout(checkStatus, 3000);
    } catch (error) {
      setError(error.message || 'Payment failed. Please try again.');
      onPaymentError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleUPIPayment();
  };

  return (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h6" gutterBottom>
        UPI Payment
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="UPI ID"
          variant="outlined"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
          placeholder="example@upi"
          disabled={loading}
          sx={{ mb: 2 }}
        />
        
        {qrCode && (
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <img src={qrCode} alt="UPI QR Code" style={{ maxWidth: '200px' }} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Scan this QR code to pay
            </Typography>
          </Box>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          Total Amount: ₹{orderAmount}
        </Typography>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            minWidth: 200,
            py: 1.5,
            borderRadius: '8px',
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            `Pay ₹${orderAmount}`
          )}
        </Button>
      </Box>
    </Paper>
  );
};

export default PaymentForm; 