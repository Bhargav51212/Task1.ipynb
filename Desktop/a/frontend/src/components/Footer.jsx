import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material';
import {
  YouTube as YouTubeIcon,
  WhatsApp as WhatsAppIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    'Quick Links': [
      { name: 'Home', path: '/' },
      { name: 'Products', path: '/products' },
      { name: 'About Us', path: '/about' },
      { name: 'Contact', path: '/contact' },
    ],
    'Customer Service': [
      { name: 'Shipping Policy', path: '/shipping' },
      { name: 'Return Policy', path: '/returns' },
      { name: 'FAQ', path: '/faq' },
      { name: 'Size Guide', path: '/size-guide' },
    ],
    'Categories': [
      { name: 'Silk Sarees', path: '/products?category=silk' },
      { name: 'Cotton Sarees', path: '/products?category=cotton' },
      { name: 'Georgette Sarees', path: '/products?category=georgette' },
      { name: 'Chiffon Sarees', path: '/products?category=chiffon' },
    ],
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#f8f9fa',
        py: 6,
        borderTop: '1px solid',
        borderColor: 'divider',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 2,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Vasundhara Saree Center
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Your one-stop destination for exclusive traditional and contemporary sarees.
              We bring you the finest collection of handcrafted pieces from across India.
            </Typography>
            <Box sx={{ mb: 2 }}>
              <IconButton
                component="a"
                href="https://www.youtube.com/@vasundharasareecenterlbnag6089"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  mr: 1,
                  color: '#FF0000',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-3px)', color: '#CC0000' },
                }}
              >
                <YouTubeIcon />
              </IconButton>
              <IconButton
                component="a"
                href="https://wa.me/message/2M3J6IAWP33SA1"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  mr: 1,
                  color: '#25D366',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-3px)', color: '#128C7E' },
                }}
              >
                <WhatsAppIcon />
              </IconButton>
              <IconButton
                component="a"
                href="https://www.instagram.com/vasundhara_sarees_wholesale?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  mr: 1,
                  color: '#E4405F',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-3px)', color: '#C13584' },
                }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                component="a"
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: '#0A66C2',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-3px)', color: '#004182' },
                }}
              >
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <Grid item xs={12} sm={6} md={2} key={title}>
              <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 600, mb: 2, color: '#2c3e50' }}>
                {title}
              </Typography>
              <Box
                component="ul"
                sx={{
                  listStyle: 'none',
                  p: 0,
                  m: 0,
                }}
              >
                {links.map((link) => (
                  <Box
                    component="li"
                    key={link.name}
                    sx={{ mb: 1 }}
                  >
                    <Link
                      component={RouterLink}
                      to={link.path}
                      sx={{
                        color: '#6c757d',
                        textDecoration: 'none',
                        transition: 'all 0.2s',
                        display: 'inline-block',
                        '&:hover': {
                          color: '#2196F3',
                          transform: 'translateX(5px)',
                        },
                      }}
                    >
                      {link.name}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 600, mb: 2, color: '#2c3e50' }}>
              Contact Us
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PhoneIcon sx={{ fontSize: 20, mr: 1, color: '#2196F3' }} />
                <Typography variant="body2" color="text.secondary">
                  +91 6281397158
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EmailIcon sx={{ fontSize: 20, mr: 1, color: '#2196F3' }} />
                <Typography variant="body2" color="text.secondary">
                  vasundharasareecenter@gmail.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationIcon sx={{ fontSize: 20, mr: 1, color: '#2196F3' }} />
                <Typography variant="body2" color="text.secondary">
                  L B nagar main road metro pillar no 1676 near by D MART Hyderabad
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(0, 0, 0, 0.1)' }} />

        {/* Copyright */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {currentYear} Vasundhara Saree Center. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 