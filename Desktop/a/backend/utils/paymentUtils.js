require('dotenv').config();
const axios = require('axios');

// Verify UPI transaction with respective payment providers
exports.verifyUPITransaction = async (orderId, paymentMethod, merchantId) => {
  try {
    let verificationEndpoint;
    let apiKey;
    
    // Common merchant ID for all UPI methods
    const upiMerchantId = process.env.UPI_MERCHANT_ID || 'bhar5518@ybl';

    // Get credentials based on payment method
    switch(paymentMethod) {
      case 'phonepe':
        verificationEndpoint = process.env.PHONEPE_VERIFICATION_URL;
        apiKey = process.env.PHONEPE_API_KEY;
        break;
      case 'googlepay':
        verificationEndpoint = process.env.GOOGLEPAY_VERIFICATION_URL;
        apiKey = process.env.GOOGLEPAY_API_KEY;
        break;
      case 'paytm':
        verificationEndpoint = process.env.PAYTM_VERIFICATION_URL;
        apiKey = process.env.PAYTM_API_KEY;
        break;
      default:
        throw new Error('Invalid payment method');
    }

    // Make API call to payment provider
    const response = await axios.post(verificationEndpoint, {
      orderId,
      merchantId: upiMerchantId // Use common merchant ID instead of provider-specific one
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    // Check payment status from response
    if (response.data.status === 'SUCCESS' || response.data.status === 'COMPLETED') {
      return {
        success: true,
        message: 'Payment verified successfully'
      };
    } else {
      return {
        success: false,
        message: response.data.message || 'Payment verification failed'
      };
    }
  } catch (error) {
    console.error('UPI transaction verification error:', error);
    
    // For development/testing, you can auto-approve payments
    if (process.env.NODE_ENV === 'development') {
      console.log('Auto-approving payment in development mode');
      return {
        success: true,
        message: 'Payment auto-approved in development mode'
      };
    }
    
    return {
      success: false,
      message: error.message || 'Error verifying payment'
    };
  }
}; 