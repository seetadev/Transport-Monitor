import { createTheme } from '@material-ui/core';

const defaultTheme = createTheme({});

export const theme = createTheme({
  palette: {
    action: {
      disabled: '#656565',
      disabledBackground: '#E4E4E4',
    },
    common: {
      black: '#050B20',
    },
    primary: {
      main: '#001E26',
    },
    secondary: {
      main: '#00CC8E',
    },
    text: {
      primary: '#050B20',
      secondary: '#656565',
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    allVariants: {
      fontVariantLigatures: 'none',
    },
    body1: {
      fontWeight: 'normal',
      fontSize: 12,
      lineHeight: '16px',
    },
    body2: {
      fontWeight: 'normal',
      fontSize: 14,
      lineHeight: '20px',
    },
    caption: {
      fontWeight: 'normal',
      fontSize: 16,
      lineHeight: '24px',
    },
    subtitle1: {
      fontWeight: 'normal',
      fontSize: 20,
      lineHeight: '32px',
    },
    h1: {
      fontWeight: 600,
      fontSize: 56,
      lineHeight: '84px',
    },
    h2: {
      fontWeight: 600,
      fontSize: 32,
      lineHeight: '48px',
    },
    h3: {
      fontWeight: 600,
      fontSize: 24,
      lineHeight: '36px',
    },
    h4: {
      fontWeight: 600,
      fontSize: 16,
      lineHeight: '24px',
    },
    h5: {
      fontWeight: 600,
      fontSize: 14,
      lineHeight: '20px',
    },
    h6: {
      fontWeight: 600,
      fontSize: 12,
      lineHeight: '16px',
    },
  },
  props: {
    MuiButton: {
      disableElevation: true,
    },
    MuiTextField: {
      autoComplete: 'off',
    },
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        'html, body, #root': {
          height: '100%',
        },
        '#root': {
          display: 'block',
          overflow: 'auto',
        },
      },
    },
    MuiButton: {
      root: {
        textTransform: 'none',
        fontSize: '16px',
        overflow: 'hidden',
      },
      label: {
        fontWeight: 600,
        fontSize: 16,
        lineHeight: '24px',
      },
      contained: {
        minWidth: 158,
        minHeight: 56,
        padding: '16px 24px',
        backgroundColor: '#fff',
        border: '1px solid #E4E4E4',
        boxSizing: 'border-box',
        borderRadius: 4,
        [defaultTheme.breakpoints.up('sm')]: {
          borderRadius: 4,
        },
        '&:hover': {
          backgroundColor: '#F7F7F7',
        },
      },
      containedPrimary: {
        minWidth: 280,
        height: 80,
        '&:hover': {
          boxShadow: '0px 5px 5px rgba(0, 30, 38, 0.3) !important',
          backgroundColor: '#001E26',
        },
        '& .MuiTouchRipple-rippleVisible': {
          backgroundColor: '#050B20',
          animation: 'unset',
          opacity: 0,
          '& .MuiTouchRipple-child': {
            display: 'none',
          },
        },
        border: 0,
        borderRadius: 0,
        [defaultTheme.breakpoints.up('sm')]: {
          borderRadius: 4,
        },
      },
      containedSecondary: {
        padding: '20px 32px',
        height: 64,
        '&:hover': {
          boxShadow: '0px 5px 5px rgba(0, 30, 38, 0.3)',
        },
        border: 0,
      },
    },
    MuiTypography: {},
    MuiDialogContentText: {
      root: {
        marginTop: 0,
        textTransform: 'initial',
      },
    },
    MuiSelect: {
      selectMenu: {
        height: '1.1875em',
      },
    },
    MuiInput: {
      root: {
        fontSize: 14,
        lineHeight: '20px',
        '&:before': {
          borderBottom: '1px solid #E4E4E4 !important',
        },
        // disable webkit spin button
        '& input::-webkit-clear-button, & input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
          display: 'none',
          margin: 80,
        },
      },
      input: {
        '&::placeholder': {
          color: '#656565',
        },
      },
      underline: {
        '&:after': {
          borderBottom: '1px solid #00CC8E !important',
        },
      },
    },
    MuiInputLabel: {
      asterisk: {
        display: 'none',
      },
      shrink: {
        transform: 'translate(0, 1.5px) scale(0.9)',
      },
    },
    MuiFormLabel: {
      root: {
        fontSize: 14,
        '&$focused': {
          color: '#00CC8E',
        },
        '&$error': {
          color: '#00CC8E',
        },
      },
      filled: {
        color: '#00CC8E',
      },
    },
    MuiFormHelperText: {
      root: {
        '&$error': {
          fontSize: 12,
          lineHeight: '16px',
          color: '#DE1C22',
        },
      },
    },
    MuiDialog: {
      paper: {
        backgroundColor: '#fafafa',
      },
    },
    MuiDialogTitle: {
      root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '14px',
        [defaultTheme.breakpoints.up('sm')]: {
          padding: '14px 24px',
        },
      },
    },
    MuiDialogContent: {
      root: {
        padding: '32px',
        [defaultTheme.breakpoints.up('sm')]: {
          padding: '30px 65px 40px 65px',
        },
      },
    },
    MuiBackdrop: {
      root: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
      },
    },
  },
});
