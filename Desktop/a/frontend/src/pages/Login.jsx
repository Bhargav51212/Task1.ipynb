import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  Alert,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { login } from '../redux/slices/authSlice';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login(formData)).unwrap();
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(to bottom right, #f8f3ff 0%, #fff5f8 100%)',
        py: 8,
        animation: 'fadeIn 0.5s ease-out',
        '@keyframes fadeIn': {
          '0%': {
            opacity: 0,
          },
          '100%': {
            opacity: 1,
          },
        },
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: '16px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
            position: 'relative',
            overflow: 'hidden',
            transform: 'translateY(0)',
            transition: 'all 0.3s ease-in-out',
            animation: 'slideUp 0.5s ease-out',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 12px 48px rgba(0,0,0,0.12)',
            },
            '@keyframes slideUp': {
              '0%': {
                transform: 'translateY(20px)',
                opacity: 0,
              },
              '100%': {
                transform: 'translateY(0)',
                opacity: 1,
              },
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: (theme) => `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              transition: 'opacity 0.3s ease-in-out',
            },
          }}
        >
          <Box
            sx={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
              animation: 'scaleIn 0.5s ease-out',
              '@keyframes scaleIn': {
                '0%': {
                  transform: 'scale(0)',
                },
                '100%': {
                  transform: 'scale(1)',
                },
              },
            }}
          >
            <LockOutlinedIcon sx={{ color: 'white' }} />
          </Box>
          <Typography
            component="h1"
            variant="h5"
            sx={{
              mb: 3,
              fontWeight: 600,
              color: 'text.primary',
              animation: 'fadeInUp 0.5s ease-out',
              '@keyframes fadeInUp': {
                '0%': {
                  transform: 'translateY(10px)',
                  opacity: 0,
                },
                '100%': {
                  transform: 'translateY(0)',
                  opacity: 1,
                },
              },
            }}
          >
            Sign In
          </Typography>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                width: '100%', 
                mb: 3,
                animation: 'shake 0.5s ease-in-out',
                '@keyframes shake': {
                  '0%, 100%': {
                    transform: 'translateX(0)',
                  },
                  '10%, 30%, 50%, 70%, 90%': {
                    transform: 'translateX(-2px)',
                  },
                  '20%, 40%, 60%, 80%': {
                    transform: 'translateX(2px)',
                  },
                },
              }}
            >
              {error}
            </Alert>
          )}

          <Box 
            component="form" 
            onSubmit={handleSubmit} 
            sx={{ 
              width: '100%',
              '& .MuiTextField-root': {
                animation: 'fadeInUp 0.5s ease-out',
                animationFillMode: 'both',
              },
              '& .MuiTextField-root:nth-of-type(2)': {
                animationDelay: '0.1s',
              },
            }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderWidth: '2px',
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderWidth: '2px',
                  },
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: 'none',
                transition: 'all 0.3s ease-in-out',
                animation: 'fadeInUp 0.5s ease-out',
                animationDelay: '0.2s',
                animationFillMode: 'both',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
                  bgcolor: 'primary.dark',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
            <Box 
              sx={{ 
                textAlign: 'center',
                animation: 'fadeInUp 0.5s ease-out',
                animationDelay: '0.3s',
                animationFillMode: 'both',
              }}
            >
              <Link
                component={RouterLink}
                to="/register"
                variant="body2"
                sx={{
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 600,
                  textDecoration: 'none',
                  position: 'relative',
                  transition: 'all 0.3s ease-in-out',
                  fontSize: '0.95rem',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    width: '0',
                    height: '2px',
                    bottom: '-2px',
                    left: '50%',
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    transition: 'all 0.3s ease-in-out',
                    transform: 'translateX(-50%)',
                  },
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    '&::after': {
                      width: '100%',
                    },
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                }}
              >
                Don't have an account? Sign Up
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login; 