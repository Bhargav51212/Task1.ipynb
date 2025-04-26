import axios from 'axios';

// Use environment variable if available, otherwise fallback to default URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const orderService = {
  getUserOrders: async () => {
    const response = await axios.get(`${API_URL}/orders/my-orders`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response;
  },

  getOrderDetails: async (orderId) => {
    const response = await axios.get(`${API_URL}/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response;
  },

  createOrder: async (orderData) => {
    const response = await axios.post(`${API_URL}/orders`, orderData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await axios.put(`${API_URL}/orders/${orderId}/status`, { status }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response;
  },
};

export { orderService }; 