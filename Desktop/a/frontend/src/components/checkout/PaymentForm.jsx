import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  Box,
  Typography,
  Button,
  alpha,
  useTheme,
  Grid,
} from '@mui/material';

const PaymentForm = ({ onSubmit, initialData }) => {
  const theme = useTheme();
  const [paymentMethod, setPaymentMethod] = useState('upi');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ paymentMethod });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Select Payment Method
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={() => setPaymentMethod('upi')}
          sx={{ mb: 2 }}
        >
          UPI
        </Button>

        <Box sx={{ mt: 2 }}>
          <FormControl component="fieldset" sx={{ width: '100%' }}>
            <RadioGroup
              name="upiMethod"
              value={initialData?.upiMethod || ''}
              onChange={(e) => onSubmit({ paymentMethod: 'upi', upiMethod: e.target.value })}
            >
              <Grid container spacing={2}>
                {[
                  { id: 'phonepe', name: 'PhonePe', logo: '/images/phonepe.png' },
                  { id: 'googlepay', name: 'Google Pay', logo: '/images/googlepay.png' },
                  { id: 'paytm', name: 'Paytm', logo: '/images/paytm.png' }
                ].map((method) => (
                  <Grid item xs={12} key={method.id}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        border: '1px solid',
                        borderColor: theme.palette.divider,
                        borderRadius: 1,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.04),
                          transform: 'translateY(-2px)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        },
                      }}
                    >
                      <FormControlLabel
                        value={method.id}
                        control={<Radio />}
                        label={
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 2,
                            '& img': {
                              height: 40,
                              width: 'auto',
                              objectFit: 'contain'
                            }
                          }}>
                            <img
                              src={method.logo}
                              alt={method.name}
                            />
                            <Typography>{method.name}</Typography>
                          </Box>
                        }
                        sx={{ 
                          width: '100%', 
                          m: 0,
                          '& .MuiFormControlLabel-label': {
                            flex: 1
                          }
                        }}
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </RadioGroup>
          </FormControl>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          type="button"
          onClick={() => window.history.back()}
        >
          Back
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={!initialData?.upiMethod}
        >
          Next
        </Button>
      </Box>
    </form>
  );
};

export default PaymentForm; 