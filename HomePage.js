import React from 'react';
import { Box, Button, Container, Typography, useTheme, useMediaQuery } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';

const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '80vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  padding: theme.spacing(8, 2),
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.primary.contrastText,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(8),
}));

const FeatureCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  height: '100%',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const HomePage = () => {
  const theme = useTheme();
  const { isAuthenticated } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: '📚',
      title: 'Share Books',
      description: 'Find and share textbooks and study materials with fellow students in your university.',
    },
    {
      icon: '🔄',
      title: 'Barter System',
      description: 'Exchange books you no longer need for ones that will help you in your studies.',
    },
    {
      icon: '🎓',
      title: 'University Network',
      description: 'Connect with students from your university and build your academic network.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="md">
          <Typography 
            variant={isMobile ? 'h3' : 'h2'} 
            component="h1" 
            gutterBottom
            sx={{ fontWeight: 700, mb: 3 }}
          >
            Trade, Share, Succeed
          </Typography>
          <Typography 
            variant={isMobile ? 'h6' : 'h5'} 
            component="h2" 
            gutterBottom
            sx={{ mb: 4, opacity: 0.9 }}
          >
            The student-to-student platform for sharing and exchanging academic resources
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            {isAuthenticated ? (
              <Button
                component={RouterLink}
                to="/books"
                variant="contained"
                color="secondary"
                size="large"
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  fontSize: isMobile ? '1rem' : '1.1rem',
                  backgroundColor: 'white',
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  },
                }}
              >
                Browse Books
              </Button>
            ) : (
              <>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  color="secondary"
                  size="large"
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    fontSize: isMobile ? '1rem' : '1.1rem',
                    backgroundColor: 'white',
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    },
                  }}
                >
                  Get Started
                </Button>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  size="large"
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    fontSize: isMobile ? '1rem' : '1.1rem',
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'rgba(255, 255, 255, 0.8)',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Login
                </Button>
              </>
            )}
          </Box>
        </Container>
      </HeroSection>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          align="center" 
          gutterBottom
          sx={{ fontWeight: 600, mb: 6 }}
        >
          Why Choose Student Barter?
        </Typography>
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 4,
          }}
        >
          {features.map((feature, index) => (
            <FeatureCard key={index}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontSize: '3rem', 
                  mb: 2,
                  lineHeight: 1,
                }}
              >
                {feature.icon}
              </Typography>
              <Typography 
                variant="h5" 
                component="h3" 
                gutterBottom
                sx={{ 
                  fontWeight: 600, 
                  mb: 2,
                  color: theme.palette.primary.main,
                }}
              >
                {feature.title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {feature.description}
              </Typography>
            </FeatureCard>
          ))}
        </Box>
      </Container>

      {/* Call to Action */}
      <Box 
        sx={{ 
          backgroundColor: theme.palette.grey[100],
          py: 8,
          borderRadius: theme.shape.borderRadius,
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom
            sx={{ fontWeight: 600, mb: 2 }}
          >
            Ready to get started?
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ mb: 4, maxWidth: 700, mx: 'auto' }}
          >
            Join thousands of students who are already saving money and making connections through our platform.
          </Typography>
          <Button
            component={RouterLink}
            to={isAuthenticated ? "/add-book" : "/register"}
            variant="contained"
            color="primary"
            size="large"
            sx={{ 
              px: 4, 
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
            }}
          >
            {isAuthenticated ? 'List a Book' : 'Join Now'}
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
