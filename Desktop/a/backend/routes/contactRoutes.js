const express = require('express');
const router = express.Router();
const { submitContactForm, getContactForms } = require('../controllers/contactController');
const { auth } = require('../middleware/auth');

router.route('/')
  .post(submitContactForm)
  .get(auth, getContactForms);

module.exports = router; 