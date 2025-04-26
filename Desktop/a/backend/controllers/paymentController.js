const Order = require('../models/Order');
const { verifyUPITransaction } = require('../utils/paymentUtils');

// Verify payment status
exports.verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentMethod, merchantId } = req.body;

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Order not found' 
      });
    }

    // Verify payment with UPI provider
    const paymentStatus = await verifyUPITransaction(orderId, paymentMethod, merchantId);

    if (paymentStatus.success) {
      // Update order status
      order.paymentStatus = 'paid';
      order.status = 'processing';
      await order.save();

      return res.json({
        status: 'success',
        message: 'Payment verified successfully',
        order: order
      });
    } else {
      return res.status(400).json({
        status: 'error',
        message: paymentStatus.message || 'Payment verification failed'
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error during payment verification'
    });
  }
}; 