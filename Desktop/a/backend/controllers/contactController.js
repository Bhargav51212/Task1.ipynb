const ContactForm = require('../models/contactForm');
const asyncHandler = require('express-async-handler');

// @desc    Submit a contact form
// @route   POST /api/contact
// @access  Public
const submitContactForm = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    res.status(400);
    throw new Error('Please fill in all fields');
  }

  const contactForm = await ContactForm.create({
    name,
    email,
    subject,
    message
  });

  if (contactForm) {
    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully'
    });
  } else {
    res.status(400);
    throw new Error('Invalid contact form data');
  }
});

// @desc    Get all contact form submissions
// @route   GET /api/contact
// @access  Private/Admin
const getContactForms = asyncHandler(async (req, res) => {
  const contactForms = await ContactForm.find({}).sort({ createdAt: -1 });
  res.json(contactForms);
});

module.exports = {
  submitContactForm,
  getContactForms
}; 