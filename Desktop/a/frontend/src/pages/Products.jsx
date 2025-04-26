import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
  Snackbar,
  CircularProgress,
  Stack,
  Chip,
  useTheme,
  alpha,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import { fetchProducts } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const CATEGORIES = ['All', 'Silk', 'Cotton', 'Georgette', 'Chiffon'];

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { products, loading, error } = useSelector((state) => state.products || { products: [], loading: false, error: null });
  const [addToCartError, setAddToCartError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    
    // Normalize the category
    let formattedCategory;
    if (category) {
      formattedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
      if (CATEGORIES.includes(formattedCategory)) {
        setSelectedCategory(formattedCategory);
      } else {
        setSelectedCategory('All');
      }
    } else {
      setSelectedCategory('All');
      formattedCategory = undefined;
    }

    // Only pass category if it's not 'All'
    const fetchParams = {
      category: formattedCategory === 'All' ? undefined : formattedCategory
    };

    dispatch(fetchProducts(fetchParams))
      .unwrap()
      .then(response => {
        if (response.length === 0 && formattedCategory) {
          console.log(`No products found in category: ${formattedCategory}`);
        }
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, [dispatch, location]);

  const handleCategoryChange = (event, newCategory) => {
    setSelectedCategory(newCategory);
    if (newCategory === 'All') {
      navigate('/products');
    } else {
      navigate(`/products?category=${newCategory.toLowerCase()}`);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      if (product.stock <= 0) {
        throw new Error('Product is out of stock');
      }

      const cartProduct = {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] ? `${import.meta.env.VITE_API_URL || 'http://localhost:5173'}/${product.images[0]}` : '/placeholder-image.jpg',
      };

      dispatch(addToCart({ product: cartProduct, quantity: 1 }));
      setSuccessMessage('Product added to cart successfully!');
      setAddToCartError(null);
      setIsSnackbarOpen(true);
    } catch (error) {
      setAddToCartError(error.message || 'Failed to add product to cart');
      setSuccessMessage('');
      setIsSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setIsSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          background: 'linear-gradient(to bottom right, #f8f3ff 0%, #fff5f8 100%)',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      py: 4,
      background: 'linear-gradient(to bottom right, #f8f3ff 0%, #fff5f8 100%)',
      minHeight: '100vh',
    }}>
      <Container maxWidth="xl">
        <Typography
          variant="h4"
          component="h1"
          sx={{
            mb: 4,
            fontWeight: 600,
            textAlign: 'center',
            color: 'text.primary',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60px',
              height: '3px',
              bgcolor: 'primary.main',
              borderRadius: '2px',
            }
          }}
        >
          {selectedCategory === 'All' ? 'All Products' : `${selectedCategory} Collection`}
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Tabs
            value={selectedCategory}
            onChange={handleCategoryChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: 'primary.main',
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                minWidth: 'auto',
                px: { xs: 2, sm: 3 },
                py: 1,
                fontSize: { xs: '0.875rem', sm: '1rem' },
                fontWeight: 500,
                color: 'text.secondary',
                '&.Mui-selected': {
                  color: 'primary.main',
                  fontWeight: 600,
                },
              },
            }}
          >
            {CATEGORIES.map((category) => (
              <Tab 
                key={category} 
                label={category} 
                value={category}
                sx={{
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              />
            ))}
          </Tabs>
          <Divider sx={{ mt: 1 }} />
        </Box>

        {products.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No products found in this category
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/products')}
              sx={{ mt: 2 }}
            >
              View All Products
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease-in-out',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                    }
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      sx={{
                        height: 280,
                        objectFit: 'cover',
                        bgcolor: alpha(theme.palette.primary.light, 0.1),
                      }}
                      image={product.images?.[0] ? `http://localhost:5000/${product.images[0]}` : '/placeholder-image.jpg'}
                      alt={product.name}
                    />
                    {product.discount > 0 && (
                      <Chip
                        icon={<LocalOfferIcon />}
                        label={`${product.discount}% OFF`}
                        color="error"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography 
                      gutterBottom 
                      variant="h6" 
                      component="h2"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {product.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {product.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                        ₹{product.price}
                      </Typography>
                      <Chip
                        label={product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                        color={product.stock > 0 ? 'success' : 'error'}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                        onClick={() => navigate(`/products/${product._id}`)}
                        sx={{
                          borderRadius: '8px',
                          textTransform: 'none',
                          '&:hover': {
                            backgroundColor: 'primary.light',
                            color: 'white',
                          },
                        }}
                      >
                        View Details
                      </Button>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<AddShoppingCartIcon />}
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock <= 0}
                        sx={{
                          borderRadius: '8px',
                          textTransform: 'none',
                          boxShadow: 'none',
                          '&:hover': {
                            boxShadow: 'none',
                            bgcolor: 'primary.dark',
                          },
                        }}
                      >
                        Add to Cart
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Snackbar
          open={isSnackbarOpen}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={successMessage ? "success" : "error"}
            sx={{ width: '100%' }}
          >
            {successMessage || addToCartError}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Products; 