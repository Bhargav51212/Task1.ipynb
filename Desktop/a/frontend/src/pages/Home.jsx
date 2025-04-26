import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  useTheme,
  alpha,
  useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box
        className="hero-section"
        sx={{
          minHeight: '100vh',
          width: '100%',
          position: 'relative',
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/images/saree-display-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          alignItems: 'center',
          color: 'white',
          marginTop: '-64px',
          paddingTop: '64px',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 1
          },
          '& > *': {
            position: 'relative',
            zIndex: 2
          }
        }}
      >
        <Container maxWidth="lg">
          <Box 
            sx={{ 
              maxWidth: 600,
              p: { xs: 2, md: 0 }
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 'bold',
                mb: 2,
              }}
            >
              Elegant Saree Collection
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 4,
                fontSize: { xs: '1.2rem', md: '1.5rem' },
              }}
            >
              Discover our exquisite range of traditional and contemporary sarees
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/products')}
              sx={{
                fontSize: '1.2rem',
                py: 1.5,
                px: 4,
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              Shop Now
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Featured Categories */}
      <Box sx={{ 
        py: { xs: 6, md: 8 }, 
        px: { xs: 2, md: 4 },
        background: 'linear-gradient(to bottom, #f8f3ff 0%, #fff5f8 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at top right, rgba(255,240,255,0.8) 0%, rgba(255,245,255,0.3) 50%, rgba(248,243,255,0.1) 100%)',
          pointerEvents: 'none',
        },
        borderRadius: { xs: '24px', md: '40px' },
        mx: { xs: 2, md: 4 },
        my: { xs: 3, md: 4 },
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h2" 
            component="h2" 
            align="center" 
            sx={{ 
              mb: { xs: 6, md: 8 },
              fontWeight: 600,
              color: 'text.primary',
              fontSize: { 
                xs: '1.75rem',
                sm: '2rem', 
                md: '2.25rem',
                lg: '2.5rem' 
              },
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -16,
                left: '50%',
                transform: 'translateX(-50%)',
                width: { xs: '40px', md: '60px' },
                height: '3px',
                bgcolor: 'primary.main',
                borderRadius: '2px',
              }
            }}
          >
            Featured Collections
          </Typography>
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {['Silk', 'Cotton', 'Georgette', 'Chiffon'].map((category) => (
              <Grid item xs={12} sm={6} md={3} key={category}>
                <Paper
                  elevation={0}
                  onClick={() => navigate(`/products?category=${category.toLowerCase()}`)}
                  sx={{
                    p: { xs: 3, md: 4 },
                    textAlign: 'center',
                    height: '100%',
                    transition: 'all 0.3s ease-in-out',
                    bgcolor: 'background.paper',
                    borderRadius: { xs: '12px', md: '16px' },
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                      bgcolor: 'rgba(255, 255, 255, 0.95)',
                      '& .category-title': {
                        color: 'primary.main',
                      },
                      '& .category-description': {
                        color: 'primary.main',
                      },
                      '&::before': {
                        transform: 'scale(1.1)',
                      }
                    },
                    '&:active': {
                      transform: 'translateY(-4px)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(45deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.6) 100%)',
                      transition: 'transform 0.3s ease-in-out',
                      zIndex: 1,
                    }
                  }}
                >
                  <Box sx={{ position: 'relative', zIndex: 2 }}>
                    <Typography 
                      variant="h5" 
                      className="category-title"
                      sx={{
                        fontWeight: 600,
                        mb: { xs: 1, md: 2 },
                        fontSize: { xs: '1.25rem', md: '1.5rem' },
                        transition: 'color 0.3s ease-in-out',
                      }}
                    >
                      {category}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      className="category-description"
                      sx={{
                        color: 'text.secondary',
                        transition: 'color 0.3s ease-in-out',
                        fontSize: { xs: '0.875rem', md: '0.95rem' },
                      }}
                    >
                      Explore our {category.toLowerCase()} collection
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* USP Section */}
      <Box sx={{ 
        bgcolor: 'grey.100', 
        py: { xs: 6, md: 8 },
        px: { xs: 2, md: 0 },
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 100%)',
          zIndex: 0,
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom 
            align="center" 
            sx={{ 
              mb: { xs: 4, md: 6 },
              fontWeight: 600,
              color: 'text.primary',
              fontSize: { 
                xs: '1.5rem',
                sm: '1.75rem', 
                md: '2rem' 
              },
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -12,
                left: '50%',
                transform: 'translateX(-50%)',
                width: { xs: '40px', md: '60px' },
                height: '3px',
                bgcolor: 'primary.main',
                borderRadius: '2px',
              }
            }}
          >
            Why Choose Us
          </Typography>
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {[
              {
                title: 'Authentic Craftsmanship',
                description: 'Handcrafted by skilled artisans',
                icon: '🎨',
              },
              {
                title: 'Premium Quality',
                description: 'Finest fabrics and materials',
                icon: '✨',
              },
              {
                title: 'Wide Selection',
                description: 'Traditional to contemporary designs',
                icon: '👗',
              },
              {
                title: 'Fast Delivery',
                description: 'Secure packaging & quick shipping',
                icon: '🚚',
              },
            ].map((usp, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, md: 4 },
                    textAlign: 'center',
                    height: '100%',
                    transition: 'all 0.3s ease-in-out',
                    bgcolor: 'background.paper',
                    borderRadius: { xs: '10px', md: '12px' },
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                      bgcolor: alpha(theme.palette.primary.light, 0.1),
                      '& .usp-icon': {
                        transform: 'scale(1.1)',
                      },
                      '& .usp-title': {
                        color: 'primary.main',
                      }
                    },
                    '&:active': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <Box
                    className="usp-icon"
                    sx={{
                      fontSize: { xs: '2.5rem', md: '3rem' },
                      mb: { xs: 1.5, md: 2 },
                      transition: 'transform 0.3s ease-in-out',
                    }}
                  >
                    {usp.icon}
                  </Box>
                  <Typography 
                    className="usp-title"
                    variant="h6" 
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      mb: { xs: 1, md: 2 },
                      fontSize: { xs: '1.1rem', md: '1.25rem' },
                      transition: 'color 0.3s ease-in-out',
                    }}
                  >
                    {usp.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.6,
                      fontSize: { xs: '0.875rem', md: '0.95rem' },
                    }}
                  >
                    {usp.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 