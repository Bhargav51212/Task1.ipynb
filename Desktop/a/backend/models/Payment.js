const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['upi', 'qr', 'wallet', 'card', 'netbanking'],
    required: true
  },
  upiId: {
    type: String,
    validate: {
      validator: function(v) {
        return !this.paymentMethod === 'upi' || /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(v);
      },
      message: props => `${props.value} is not a valid UPI ID!`
    }
  },
  cardDetails: {
    last4: String,
    brand: String,
    expiryMonth: Number,
    expiryYear: Number
  },
  walletType: {
    type: String,
    enum: ['paytm', 'phonepe', 'googlepay', 'other']
  },
  bankName: String,
  discountApplied: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: String,
  error: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Payment', paymentSchema); 