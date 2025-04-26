import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  CircularProgress,
  useTheme,
  useMediaQuery,
  TextField,
  Alert,
} from '@mui/material';
import { getCurrentUser } from '../redux/slices/authSlice';
import axios from 'axios';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [successMessage, setSuccessMessage] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      // Only include non-empty fields and exclude email
      const updateData = {};
      if (formData.name) updateData.name = formData.name;
      if (formData.phone) updateData.phone = formData.phone;
      if (formData.address) updateData.address = formData.address;
      if (formData.city) updateData.city = formData.city;
      if (formData.state) updateData.state = formData.state;
      if (formData.pincode) updateData.pincode = formData.pincode;

      console.log('Sending update request with data:', updateData);
      console.log('API URL:', `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/users/profile`);

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/users/profile`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      
      console.log('Update response:', response.data);
      setSuccessMessage('Profile updated successfully!');
      dispatch(getCurrentUser()); // Refresh user data
    } catch (error) {
      console.error('Update error details:', {
        message: error.response?.data?.message,
        status: error.response?.status,
        data: error.response?.data
      });
      setUpdateError(error.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          align="center" 
          gutterBottom
          sx={{ mb: 4 }}
        >
          Profile
        </Typography>

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        {updateError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {updateError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name *"
            name="name"
            value={formData.name}
            disabled
            margin="normal"
          />

          <TextField
            fullWidth
            label="Email *"
            name="email"
            type="email"
            value={formData.email}
            disabled
            margin="normal"
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile; 