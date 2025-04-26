import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Chip,
} from '@mui/material';
import { fetchProductById } from '../redux/slices/productSlice';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { useNavigate } from 'react-router-dom';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentProduct: product, loading, error } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  const handleBuyNow = () => {
    navigate('/checkout', { state: { product } });
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="info">Product not found</Alert>
      </Container>
    );
  }

  const renderDesktopView = () => (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '600px',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            backgroundColor: 'background.paper',
            overflow: 'hidden',
            cursor: 'zoom-in',
            '&:hover img': {
              transform: 'scale(1.05)',
            }
          }}
        >
          <img
            src={product.images?.[0] ? `http://localhost:5000/${product.images[0]}` : '/placeholder-image.jpg'}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: '4px',
              transition: 'transform 0.3s ease-in-out',
            }}
          />
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ mb: 3 }}
          >
            Back to Products
          </Button>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              mb: 2,
            }}
          >
            {product.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Typography 
              variant="h5" 
              color="primary" 
              sx={{
                fontWeight: 600,
              }}
            >
              ₹{product.price}
            </Typography>
            {product.discount > 0 && (
              <Chip
                label={`${product.discount}% OFF`}
                color="success"
                size="small"
              />
            )}
          </Box>
          <Box sx={{ 
            display: 'inline-block', 
            bgcolor: product.stock > 0 ? 'success.light' : 'error.light',
            color: 'white',
            px: 2,
            py: 0.5,
            borderRadius: 1,
            mb: 3
          }}>
            <Typography variant="body2">
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </Typography>
          </Box>
          <Divider sx={{ my: 3 }} />
          <Typography 
            variant="body1" 
            paragraph
            sx={{
              lineHeight: 1.8,
              color: 'text.secondary',
              mb: 4,
            }}
          >
            {product.description}
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleBuyNow}
              fullWidth
              disabled={product.stock <= 0}
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none',
                },
              }}
            >
              {product.stock > 0 ? 'Buy Now' : 'Out of Stock'}
            </Button>
          </Box>
        </Box>
        <Paper 
          sx={{ 
            p: 3,
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            backgroundColor: 'background.paper',
          }}
        >
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              mb: 3,
            }}
          >
            Product Details
          </Typography>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Category:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {product.category}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Material:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {product.material || 'Not specified'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Color:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {product.color || 'Not specified'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Size:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {product.size || 'Not specified'}
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderMobileView = () => (
    <Stack spacing={3}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
      >
        Back to Products
      </Button>
      <Card>
        <CardMedia
          component="img"
          image={product.images?.[0] ? `http://localhost:5000/${product.images[0]}` : '/placeholder-image.jpg'}
          alt={product.name}
          sx={{ 
            height: 400, 
            objectFit: 'contain',
            bgcolor: 'background.paper',
            p: 2
          }}
        />
        <CardContent>
          <Typography variant="h5" component="h1" gutterBottom>
            {product.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="h6" color="primary">
              ₹{product.price}
            </Typography>
            {product.discount > 0 && (
              <Chip
                label={`${product.discount}% OFF`}
                color="success"
                size="small"
              />
            )}
          </Box>
          <Box sx={{ 
            display: 'inline-block', 
            bgcolor: product.stock > 0 ? 'success.light' : 'error.light',
            color: 'white',
            px: 2,
            py: 0.5,
            borderRadius: 1,
            mb: 2
          }}>
            <Typography variant="body2">
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleBuyNow}
            fullWidth
            disabled={product.stock <= 0}
            sx={{ mt: 2 }}
          >
            {product.stock > 0 ? 'Buy Now' : 'Out of Stock'}
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Product Details
          </Typography>
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              Category: {product.category}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Material: {product.material || 'Not specified'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Color: {product.color || 'Not specified'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Size: {product.size || 'Not specified'}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {isMobile ? renderMobileView() : renderDesktopView()}
    </Container>
  );
};

export default ProductDetails; 