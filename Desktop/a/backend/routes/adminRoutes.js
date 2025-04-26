const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, adminAuth } = require('../middleware/auth');

// User management
router.get('/users', auth, adminAuth, adminController.getAllUsers);
router.get('/users/:id', auth, adminAuth, adminController.getUserById);
router.put('/users/:id/role', auth, adminAuth, adminController.updateUserRole);

// Order management
router.get('/orders', auth, adminAuth, adminController.getAllOrders);
router.get('/orders/:id', auth, adminAuth, adminController.getOrderDetails);
router.put('/orders/:id/status', auth, adminAuth, adminController.updateOrderStatus);

// Statistics
router.get('/stats/sales', auth, adminAuth, adminController.getSalesStats);
router.get('/stats/products', auth, adminAuth, adminController.getProductStats);

module.exports = router; 