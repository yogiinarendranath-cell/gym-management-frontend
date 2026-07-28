// src/components/common/Footer.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Stack,
  Divider,
  Chip,
  useTheme,
  Paper,
  useMediaQuery,
} from '@mui/material';
import {
  Facebook,
  LinkedIn,
  Instagram,
  GitHub,
  Favorite,
  Email,
  Phone,
  LocationOn,
  Refresh,
  YouTube,
  WhatsApp,
  Twitter,
  Pinterest,
  FitnessCenter,
  SportsGymnastics,
  DirectionsRun,
  Pool,
  Spa,
  SelfImprovement,
  ArrowForward,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

// Gym-related images for the marquee
const GYM_IMAGES = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=150&fit=crop',
    alt: 'Gym Equipment',
    label: 'Fitness Equipment',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&h=150&fit=crop',
    alt: 'Yoga Class',
    label: 'Yoga & Wellness',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=150&fit=crop',
    alt: 'Weight Training',
    label: 'Weight Training',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=150&fit=crop',
    alt: 'Cardio Workout',
    label: 'Cardio Zone',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=200&h=150&fit=crop',
    alt: 'Gym Interior',
    label: 'Modern Gym',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1558618666-fcd25c85f0f0?w=200&h=150&fit=crop',
    alt: 'Group Class',
    label: 'Group Fitness',
  },
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=200&h=150&fit=crop',
    alt: 'CrossFit',
    label: 'CrossFit Training',
  },
  {
    id: 8,
    src: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=150&fit=crop',
    alt: 'Dumbbells',
    label: 'Free Weights',
  },
  {
    id: 9,
    src: 'https://images.unsplash.com/photo-1574958269340-fd7f1e6d2c7c?w=200&h=150&fit=crop',
    alt: 'Pilates',
    label: 'Pilates Studio',
  },
  {
    id: 10,
    src: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=200&h=150&fit=crop',
    alt: 'Boxing',
    label: 'Boxing & MMA',
  },
];

const SOCIAL_LINKS = [
  { icon: <Facebook />, href: 'https://facebook.com', label: 'Facebook', color: '#1877f2' },
  { icon: <Instagram />, href: 'https://instagram.com', label: 'Instagram', color: '#e4405f' },
  { icon: <YouTube />, href: 'https://www.youtube.com', label: 'YouTube', color: '#ff0000' },
  { icon: <WhatsApp />, href: 'https://wa.me/your-number', label: 'WhatsApp', color: '#25d366' },
  { icon: <Twitter />, href: 'https://twitter.com', label: 'Twitter', color: '#1da1f2' },
  { icon: <LinkedIn />, href: 'https://linkedin.com', label: 'LinkedIn', color: '#0a66c2' },
  { icon: <Pinterest />, href: 'https://pinterest.com', label: 'Pinterest', color: '#e60023' },
  { icon: <GitHub />, href: 'https://github.com', label: 'GitHub', color: '#181717' },
];

const QUICK_LINKS = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Members', path: '/members' },
  { label: 'Trainers', path: '/trainers' },
  { label: 'Classes', path: '/classes' },
  { label: 'Payments', path: '/payments' },
];

const RESOURCE_LINKS = [
  { label: 'Help Center', path: '/help' },
  { label: 'Documentation', path: '/docs' },
  { label: 'Privacy Policy', path: '/legal' },
  { label: 'Terms of Service', path: '/terms' },
];

const Footer = ({ currentTime, onRefresh }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const currentYear = new Date().getFullYear();
  const now = currentTime || new Date();

  // Gym brand colors
  const primaryColor = '#FF5722';
  const secondaryColor = '#1a237e';

  // Add keyframes for marquee animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <Box
      component="footer"
      sx={{
        mt: 4,
        py: 4,
        px: 2,
        backgroundColor: theme.palette.mode === 'light' ? '#f5f5f5' : theme.palette.grey[900],
        borderTop: `3px solid ${primaryColor}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.03,
          background: `radial-gradient(circle at 20% 50%, ${primaryColor} 0%, transparent 50%),
                       radial-gradient(circle at 80% 50%, ${secondaryColor} 0%, transparent 50%)`,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg">
        {/* Marquee Slideshow Section */}
        <Paper
          elevation={0}
          sx={{
            overflow: 'hidden',
            position: 'relative',
            width: '100%',
            background: `linear-gradient(90deg, ${primaryColor}22, ${secondaryColor}22)`,
            borderRadius: '12px',
            padding: '8px 0',
            border: `1px solid ${primaryColor}33`,
            mb: 4,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', px: 2, minWidth: 'fit-content' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
              <FitnessCenter sx={{ color: primaryColor }} />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  color: primaryColor,
                  whiteSpace: 'nowrap',
                }}
              >
                GYM LIFE
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                animation: 'marquee 30s linear infinite',
                width: 'max-content',
                '&:hover': {
                  animationPlayState: 'paused',
                },
              }}
            >
              {[...GYM_IMAGES, ...GYM_IMAGES].map((image, index) => (
                <Box
                  key={`${image.id}-${index}`}
                  sx={{
                    position: 'relative',
                    display: 'inline-block',
                    mx: 1,
                    borderRadius: '8px',
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      zIndex: 10,
                    },
                  }}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    style={{
                      width: isMobile ? 120 : 160,
                      height: isMobile ? 80 : 100,
                      objectFit: 'cover',
                      borderRadius: '8px',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                      color: 'white',
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      padding: '4px 8px',
                      textAlign: 'center',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      '&:hover': {
                        opacity: 1,
                      },
                    }}
                  >
                    {image.label}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Paper>

        <Grid container spacing={4}>
          {/* About Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: secondaryColor,
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <FitnessCenter sx={{ color: primaryColor }} />
              Smart Fitness Gym Membership & Billing Management Platform
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                lineHeight: 1.8,
              }}
              paragraph
            >
              Complete gym management solution for fitness centers. Track members,
              trainers, classes, and payments effortlessly.
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
              {SOCIAL_LINKS.map((social) => (
                <IconButton
                  key={social.label}
                  size="small"
                  sx={{
                    color: social.color,
                    bgcolor: `${social.color}11`,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s ease',
                      bgcolor: `${social.color}22`,
                    },
                  }}
                  component="a"
                  href={social.href}
                  target="_blank"
                  aria-label={social.label}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: 700,
                fontSize: '1rem',
                color: secondaryColor,
              }}
            >
              Quick Links
            </Typography>
            <Stack spacing={1}>
              {QUICK_LINKS.map((link) => (
                <Link
                  key={link.label}
                  component={RouterLink}
                  to={link.path}
                  sx={{
                    color: theme.palette.text.secondary,
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    '&:hover': {
                      color: primaryColor,
                      textDecoration: 'underline',
                      transition: 'color 0.3s ease',
                    },
                  }}
                >
                  <ArrowForward sx={{ fontSize: 12, color: primaryColor }} />
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Resources */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: 700,
                fontSize: '1rem',
                color: secondaryColor,
              }}
            >
              Resources
            </Typography>
            <Stack spacing={1}>
              {RESOURCE_LINKS.map((link) => (
                <Link
                  key={link.label}
                  component={RouterLink}
                  to={link.path}
                  sx={{
                    color: theme.palette.text.secondary,
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    '&:hover': {
                      color: primaryColor,
                      textDecoration: 'underline',
                      transition: 'color 0.3s ease',
                    },
                  }}
                >
                  <ArrowForward sx={{ fontSize: 12, color: primaryColor }} />
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: 700,
                fontSize: '1rem',
                color: secondaryColor,
              }}
            >
              Contact Us
            </Typography>
            <Stack spacing={1.5}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <LocationOn sx={{ color: primaryColor, fontSize: 20, mt: 0.5 }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    lineHeight: 1.6,
                  }}
                >
                  123 Fitness Street, Gym Park, Bangalore - 560001 India.
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Email sx={{ color: primaryColor, fontSize: 20 }} />
                <Link
                  href="mailto:support@gymmanager.com"
                  sx={{
                    color: theme.palette.text.secondary,
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: primaryColor,
                      textDecoration: 'underline',
                    },
                  }}
                >
                  support@gymmanager.com
                </Link>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Phone sx={{ color: primaryColor, fontSize: 20 }} />
                <Link
                  href="tel:+919876543210"
                  sx={{
                    color: theme.palette.text.secondary,
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: primaryColor,
                      textDecoration: 'underline',
                    },
                  }}
                >
                  +91 98765 43210
                </Link>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: `${primaryColor}44` }} />

        {/* Bottom Bar */}
        <Box
          sx={{
            mt: 2,
            p: 2,
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <Chip
              label="🏋️ GYM"
              size="small"
              variant="outlined"
              sx={{
                color: secondaryColor,
                borderColor: secondaryColor,
                fontWeight: 600,
              }}
            />
            <Chip
              label="🇮🇳 IN"
              size="small"
              variant="outlined"
              sx={{
                color: secondaryColor,
                borderColor: secondaryColor,
                fontWeight: 600,
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: primaryColor,
                fontWeight: 500,
              }}
            >
              Location: India
            </Typography>

            <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
              <SportsGymnastics sx={{ fontSize: 18, color: primaryColor }} />
              <DirectionsRun sx={{ fontSize: 18, color: secondaryColor }} />
              <Pool sx={{ fontSize: 18, color: '#4fc3f7' }} />
              <Spa sx={{ fontSize: 18, color: '#66bb6a' }} />
              <SelfImprovement sx={{ fontSize: 18, color: '#ab47bc' }} />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: secondaryColor,
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
              }}
            >
              {now.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
              })}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: primaryColor,
                fontSize: { xs: '0.7rem', sm: '0.875rem' },
              }}
            >
              {now.toLocaleDateString('en-IN', {
                weekday: 'short',
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </Typography>

            {onRefresh && (
              <IconButton
                size="small"
                onClick={onRefresh}
                title="Refresh"
                sx={{ color: secondaryColor }}
              >
                <Refresh fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Copyright Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            mt: 2,
            pt: 1,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: 500,
              fontSize: { xs: '0.7rem', sm: '0.8rem' },
            }}
          >
            © {currentYear} Gym Management System. All rights reserved.
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 500,
                fontSize: { xs: '0.7rem', sm: '0.8rem' },
              }}
            >
              Made with
            </Typography>
            <Favorite
              sx={{
                color: '#e91e63',
                fontSize: 16,
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
              aria-hidden="true"
            />
            <Typography
              variant="body2"
              sx={{
                color: primaryColor,
                fontWeight: 700,
                fontSize: { xs: '0.7rem', sm: '0.8rem' },
              }}
            >
              by Narendra Nath
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Link
              component={RouterLink}
              to="/legal"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: { xs: '0.6rem', sm: '0.75rem' },
                fontWeight: 500,
                textDecoration: 'none',
                '&:hover': {
                  color: primaryColor,
                  textDecoration: 'underline',
                },
              }}
            >
              Privacy
            </Link>
            <Link
              component={RouterLink}
              to="/legal"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: { xs: '0.6rem', sm: '0.75rem' },
                fontWeight: 500,
                textDecoration: 'none',
                '&:hover': {
                  color: primaryColor,
                  textDecoration: 'underline',
                },
              }}
            >
              Terms
            </Link>
            <Link
              component={RouterLink}
              to="/legal"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: { xs: '0.6rem', sm: '0.75rem' },
                fontWeight: 500,
                textDecoration: 'none',
                '&:hover': {
                  color: primaryColor,
                  textDecoration: 'underline',
                },
              }}
            >
              Cookies
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;