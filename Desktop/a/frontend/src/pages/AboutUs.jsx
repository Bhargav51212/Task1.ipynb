import React from 'react';
import { Container, Typography, Box, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
}));

const AboutUs = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ mb: 6 }}>
        About Us
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <StyledPaper elevation={3}>
            <Typography variant="h4" gutterBottom>
              Our Story
            </Typography>
            <Typography variant="body1" paragraph>
              Welcome to our e-commerce platform! We started with a simple mission: to provide high-quality products 
              with exceptional customer service. Our journey began with a small team of passionate individuals who 
              believed in making online shopping more personal and enjoyable.
            </Typography>
          </StyledPaper>
        </Grid>

        <Grid item xs={12} md={6}>
          <StyledPaper elevation={3}>
            <Typography variant="h4" gutterBottom>
              Our Mission
            </Typography>
            <Typography variant="body1" paragraph>
              We strive to create a seamless shopping experience that brings joy to our customers. Our commitment 
              to quality, transparency, and customer satisfaction drives everything we do.
            </Typography>
          </StyledPaper>
        </Grid>

        <Grid item xs={12} md={6}>
          <StyledPaper elevation={3}>
            <Typography variant="h4" gutterBottom>
              Our Values
            </Typography>
            <Typography variant="body1" paragraph>
              • Quality First
              • Customer Satisfaction
              • Transparency
              • Innovation
              • Sustainability
            </Typography>
          </StyledPaper>
        </Grid>

        <Grid item xs={12}>
          <StyledPaper elevation={3}>
            <Typography variant="h4" gutterBottom>
              Our Promise
            </Typography>
            <Typography variant="body1" paragraph>
              We're committed to providing you with the best possible shopping experience. From carefully curated 
              products to responsive customer support, we're here to serve you every step of the way.
            </Typography>
          </StyledPaper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AboutUs; 