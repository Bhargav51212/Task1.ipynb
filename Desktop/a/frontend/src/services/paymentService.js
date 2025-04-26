import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const createOrder = async (orderData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Please login to continue');
    }

    const response = await axios.post(`${API_URL}/orders`, orderData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create order');
  }
};

const initiateUPIPayment = async (orderId, amount, upiId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Please login to continue');
    }

    const response = await axios.post(`${API_URL}/payments/upi/initiate`, {
      orderId,
      amount,
      upiId
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to initiate UPI payment');
  }
};

const verifyUPIPayment = async (transactionId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Please login to continue');
    }

    const response = await axios.post(`${API_URL}/payments/upi/verify`, {
      transactionId
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to verify payment');
  }
};

const generateQRCode = async (orderId, amount) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Please login to continue');
    }

    const response = await axios.post(`${API_URL}/payments/upi/qr`, {
      orderId,
      amount
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to generate QR code');
  }
};

const checkPaymentStatus = async (orderId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Please login to continue');
    }

    const response = await axios.get(`${API_URL}/payments/status/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to check payment status');
  }
};

export const paymentService = {
  createOrder,
  initiateUPIPayment,
  verifyUPIPayment,
  generateQRCode,
  checkPaymentStatus
}; 