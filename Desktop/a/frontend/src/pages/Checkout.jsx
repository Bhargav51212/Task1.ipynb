import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Grid,
  Divider,
  Alert,
  IconButton,
  CircularProgress,
  RadioGroup,
  Radio,
  FormControlLabel,
} from '@mui/material';
import { createOrder } from '../redux/slices/orderSlice';
import { updateQuantity, removeFromCart, clearCart } from '../redux/slices/cartSlice';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';

const steps = ['Cart Review', 'Shipping Address', 'Payment Method', 'Review Order'];

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Add fallback for cart items if they're undefined
  const cart = useSelector((state) => state.cart || { items: [], totalAmount: 0 });
  const { items = [], totalAmount = 0 } = cart;
  
  const { loading, error } = useSelector((state) => state.orders);
  
  const [activeStep, setActiveStep] = useState(0);
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });
  const [upiOption, setUpiOption] = useState('');

  // Add submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);

  // Add payment processing state
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && activeStep > 0) {
      navigate('/cart');
    }
  }, [items, navigate, activeStep]);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleCartReview = (e) => {
    e.preventDefault();
    if (items.length > 0) {
      handleNext();
    }
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    handleNext();
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    handleNext();
  };

  // Function to get merchant ID for all UPI apps
  const getMerchantId = () => {
    // Use the same merchant ID for all UPI methods
    return import.meta.env.VITE_UPI_MERCHANT_ID || 'bhar5518@ybl';
  };

  // Function to generate UPI payment URL
  const generateUPIUrl = (amount, orderId, upiApp) => {
    const merchantId = getMerchantId();
    const merchantName = import.meta.env.VITE_MERCHANT_NAME || 'Your Store';
    const transactionNote = `Payment for order ${orderId}`;
    const currency = 'INR';
    const callbackUrl = `${window.location.origin}/payment-callback`;

    // Generate different URLs based on the selected UPI app
    switch(upiApp) {
      case 'phonepe':
        return `phonepe://pay?pa=${merchantId}&pn=${merchantName}&tr=${orderId}&am=${amount}&cu=${currency}&tn=${transactionNote}&mc=&url=${callbackUrl}`;
      case 'googlepay':
        return `tez://upi/pay?pa=${merchantId}&pn=${merchantName}&tr=${orderId}&am=${amount}&cu=${currency}&tn=${transactionNote}&url=${callbackUrl}`;
      case 'paytm':
        return `paytmmp://pay?pa=${merchantId}&pn=${merchantName}&tr=${orderId}&am=${amount}&cu=${currency}&tn=${transactionNote}&url=${callbackUrl}`;
      default:
        return null;
    }
  };

  // Function to handle UPI payment
  const handleUPIPayment = async (orderId, amount) => {
    try {
      setIsProcessingPayment(true);
      setPaymentError(null);

      // Generate UPI URL based on selected app
      const upiUrl = generateUPIUrl(amount, orderId, upiOption);
      
      if (!upiUrl) {
        throw new Error('Invalid UPI payment option');
      }

      // Store order ID in localStorage to verify when returning
      localStorage.setItem('pendingOrderId', orderId);
      localStorage.setItem('pendingPaymentMethod', upiOption);
      
      // Open the UPI app
      window.location.href = upiUrl;

      // The page will reload when user returns from UPI app
    } catch (error) {
      setPaymentError(error.message);
      setIsProcessingPayment(false);
    }
  };

  // Function to verify payment with backend
  const verifyPayment = async (orderId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_PAYMENT_API_URL || 'http://localhost:5000/api'}/verify-payment/${orderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethod: localStorage.getItem('pendingPaymentMethod') || upiOption,
          merchantId: getMerchantId(),
        }),
      });

      if (!response.ok) {
        throw new Error('Payment verification failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(error.message || 'Error verifying payment');
    }
  };

  // Check for payment status when component mounts or when returning from UPI app
  useEffect(() => {
    const pendingOrderId = localStorage.getItem('pendingOrderId');
    if (pendingOrderId) {
      const verifyPaymentStatus = async () => {
        try {
          setIsProcessingPayment(true);
          const data = await verifyPayment(pendingOrderId);
          
          if (data.status === 'success') {
            dispatch(clearCart());
            navigate(`/order-success/${pendingOrderId}`);
          } else {
            setPaymentError('Payment verification failed. Please try again.');
          }
        } catch (error) {
          setPaymentError('Error verifying payment. Please contact support.');
        } finally {
          localStorage.removeItem('pendingOrderId');
          setIsProcessingPayment(false);
        }
      };

      verifyPaymentStatus();
    }
  }, [dispatch, navigate]);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setIsProcessingPayment(true);
    setPaymentError(null);

    try {
      // Create order first
      const orderData = {
        shippingAddress,
        paymentMethod,
        items: items.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount
      };

      const result = await dispatch(createOrder(orderData)).unwrap();
      const orderId = result._id || (result.order && result.order._id);

      if (!orderId) {
        throw new Error('Failed to create order');
      }

      // Handle different payment methods
      if (paymentMethod === 'upi') {
        await handleUPIPayment(orderId, totalAmount);
      } else if (paymentMethod === 'credit_card') {
        // Handle credit card payment
        // ... existing credit card processing code ...
        
        // For this example, we'll just complete the order
        dispatch(clearCart());
        navigate(`/order-success/${orderId}`);
      } else if (paymentMethod === 'cod') {
        // Handle COD
        dispatch(clearCart());
        navigate(`/order-success/${orderId}`);
      }
    } catch (error) {
      setPaymentError(error.message || 'Failed to process payment. Please try again.');
      setIsProcessingPayment(false);
    }
  };

  // Add quantity handlers
  const handleIncreaseQuantity = (item) => {
    dispatch(updateQuantity({
      productId: item._id,
      quantity: item.quantity + 1
    }));
  };

  const handleDecreaseQuantity = (item) => {
    if (item.quantity > 1) {
      dispatch(updateQuantity({
        productId: item._id,
        quantity: item.quantity - 1
      }));
    } else {
      dispatch(removeFromCart(item._id));
    }
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const renderCartReview = () => (
    <form onSubmit={handleCartReview}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Cart Items
          </Typography>
          {items.map((item) => (
            <Box key={item._id} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">{item.name}</Typography>
                  <Typography color="text.secondary">₹{item.price.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton size="small" onClick={() => handleDecreaseQuantity(item)}>
                      <RemoveIcon />
                    </IconButton>
                    <Typography>{item.quantity}</Typography>
                    <IconButton size="small" onClick={() => handleIncreaseQuantity(item)}>
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <Typography variant="subtitle1">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </Typography>
                    <IconButton size="small" color="error" onClick={() => handleRemoveItem(item._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          ))}
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h6">₹{totalAmount.toFixed(2)}</Typography>
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button
          variant="contained"
          type="submit"
          disabled={items.length === 0}
        >
          Next
        </Button>
      </Box>
    </form>
  );

  const renderShippingForm = () => (
    <form onSubmit={handleShippingSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Full Name"
            value={shippingAddress.name}
            onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Phone Number"
            value={shippingAddress.phone}
            onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Street Address"
            value={shippingAddress.street}
            onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="City"
            value={shippingAddress.city}
            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="State"
            value={shippingAddress.state}
            onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="ZIP Code"
            value={shippingAddress.zipCode}
            onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Country"
            value={shippingAddress.country}
            onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
          />
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button onClick={handleBack} type="button">Back</Button>
        <Button
          variant="contained"
          type="submit"
        >
          Next
        </Button>
      </Box>
    </form>
  );

  const renderPaymentForm = () => (
    <form onSubmit={handlePaymentSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Select Payment Method
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant={paymentMethod === 'upi' ? 'contained' : 'outlined'}
              onClick={(e) => {
                e.preventDefault();
                setPaymentMethod('upi');
                setCardDetails({
                  cardNumber: '',
                  cardHolder: '',
                  expiryDate: '',
                  cvv: '',
                });
              }}
              fullWidth
              type="button"
            >
              UPI
            </Button>

            {paymentMethod === 'upi' && (
              <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <RadioGroup
                  value={upiOption}
                  onChange={(e) => setUpiOption(e.target.value)}
                >
                  <FormControlLabel 
                    value="phonepe" 
                    control={<Radio />} 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          component="img"
                          src="/images/phonepe.png"
                          alt="PhonePe"
                          sx={{
                            height: 40,
                            width: 40,
                            objectFit: 'contain',
                            borderRadius: '50%',
                            backgroundColor: '#5C2D91'
                          }}
                        />
                        <Typography>PhonePe</Typography>
                      </Box>
                    }
                    sx={{
                      '& .MuiFormControlLabel-label': {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                      }
                    }}
                  />
                  <FormControlLabel 
                    value="googlepay" 
                    control={<Radio />} 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          component="img"
                          src="/images/googlepay.png"
                          alt="Google Pay"
                          sx={{
                            height: 40,
                            width: 'auto',
                            objectFit: 'contain'
                          }}
                        />
                        <Typography>Google Pay</Typography>
                      </Box>
                    }
                    sx={{
                      '& .MuiFormControlLabel-label': {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                      }
                    }}
                  />
                  <FormControlLabel 
                    value="paytm" 
                    control={<Radio />} 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          component="img"
                          src="/images/paytm.png"
                          alt="Paytm"
                          sx={{
                            height: 40,
                            width: 'auto',
                            objectFit: 'contain'
                          }}
                        />
                        <Typography>Paytm</Typography>
                      </Box>
                    }
                    sx={{
                      '& .MuiFormControlLabel-label': {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                      }
                    }}
                  />
                </RadioGroup>
              </Box>
            )}
          </Box>
        </Grid>
        
        {paymentError && (
          <Grid item xs={12}>
            <Alert severity="error" sx={{ mt: 2 }}>
              {paymentError}
            </Alert>
          </Grid>
        )}

        {isProcessingPayment && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress />
            </Box>
          </Grid>
        )}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button onClick={handleBack} type="button">Back</Button>
        <Button
          variant="contained"
          type="submit"
          disabled={!paymentMethod || (paymentMethod === 'upi' && !upiOption)}
        >
          Next
        </Button>
      </Box>
    </form>
  );

  const renderOrderReview = () => (
    <form onSubmit={handleOrderSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Order Summary
          </Typography>
          {items.map((item) => (
            <Box key={item._id} sx={{ mb: 2 }}>
              <Typography>
                {item.name} x {item.quantity}
              </Typography>
              <Typography color="text.secondary">
                ₹{(item.price * item.quantity).toFixed(2)}
              </Typography>
            </Box>
          ))}
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">
            Total: ₹{totalAmount.toFixed(2)}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Shipping Address
          </Typography>
          <Typography>
            {shippingAddress.name}
          </Typography>
          <Typography>
            {shippingAddress.phone}
          </Typography>
          <Typography>
            {shippingAddress.street}
          </Typography>
          <Typography>
            {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
          </Typography>
          <Typography>
            {shippingAddress.country}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Payment Method
          </Typography>
          <Typography>
            {paymentMethod === 'credit_card' ? `Credit Card (**** ${cardDetails.cardNumber.slice(-4)})` :
             paymentMethod === 'upi' ? `UPI (${upiOption.charAt(0).toUpperCase() + upiOption.slice(1)})` :
             paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod}
          </Typography>
        </Grid>
        
        {submissionError && (
          <Grid item xs={12}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {submissionError}
            </Alert>
          </Grid>
        )}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button onClick={handleBack} type="button" disabled={isSubmitting}>Back</Button>
        <Button
          variant="contained"
          type="submit"
          disabled={isSubmitting}
          sx={{
            position: 'relative',
            '& .MuiCircularProgress-root': {
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            },
          }}
        >
          {isSubmitting ? (
            <>
              Processing...
              <CircularProgress size={24} color="inherit" />
            </>
          ) : (
            'Place Order'
          )}
        </Button>
      </Box>
    </form>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderCartReview();
      case 1:
        return renderShippingForm();
      case 2:
        return renderPaymentForm();
      case 3:
        return renderOrderReview();
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Checkout
        </Typography>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {items.length === 0 && activeStep === 0 ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            Your cart is empty. Please add items to your cart to continue checkout.
          </Alert>
        ) : (
          getStepContent(activeStep)
        )}
      </Paper>
    </Container>
  );
};

export default Checkout; 