import { PaletteMode } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { colors } from './colors.js';

const globalColors: { [key: string]: string | { [key: string]: string } } =
  colors;

// Set css vars
Object.keys(globalColors).forEach((variant) => {
  Object.keys(globalColors[variant]).forEach((color) => {
    const value = (globalColors[variant] as { [key: string]: string })[color];
    document.body.style.setProperty(`--${variant}-${color}`, value);
  });
});

export const getTheme = (mode: string = 'dark') => {
  const baseTheme = createTheme({
    palette: { ...colors, mode: mode as PaletteMode },
    typography: {
      fontFamily: [
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"'
      ].join(','),

      h5: {
        fontWeight: 500,
        fontSize: 26,
        letterSpacing: 0.5
      }
    },
    mixins: {
      toolbar: {
        minHeight: 48
      }
    }
  });

  return {
    ...baseTheme,

    components: {
      MuiInputLabel: {
        variants: [
          {
            props: {}, // match any props combination
            style: ({ theme }: any) => {
              if (theme.palette.mode === 'light') {
                return {
                  '&.Mui-focused': {
                    color: colors.secondary.main
                  }
                };
              }

              return {};
            }
          }
        ]
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: colors.secondary.main
          }
        }
      },
      MuiButton: {
        defaultProps: {
          color: 'primary',
          variant: 'contained'
        },
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontSize: '1.1rem'
          },
          contained: {
            textTransform: 'none',
            boxShadow: 'none',
            '&:active': {
              boxShadow: 'none'
            }
          }
        }
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            background: 'rgba(100,100,100,0.1)'
          },
          indicator: {
            height: 3,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0
          }
        }
      },
      MuiTab: {
        variants: [
          {
            props: {}, // match any props combination
            style: ({ theme }: any) => {
              if (theme.palette.mode === 'light') {
                return {
                  '&.Mui-selected': {
                    color: 'black'
                  }
                };
              }

              return {};
            }
          }
        ],
        styleOverrides: {
          root: {
            textTransform: 'none',
            marginRight: '1em',
            padding: '1em 1.75em',
            minWidth: 0,
            [baseTheme.breakpoints.up('md')]: {
              padding: 0,
              minWidth: 0
            }
          }
        }
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            padding: baseTheme.spacing(1)
          }
        }
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 4
          }
        }
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            backgroundColor: colors.secondary.light
          }
        }
      },
      MuiListItemText: {
        styleOverrides: {
          primary: {
            fontWeight: baseTheme.typography.fontWeightMedium
          }
        }
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            color: 'inherit',
            marginRight: 0,
            '& svg': {
              fontSize: 20
            }
          }
        }
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            width: 32,
            height: 32
          }
        }
      }
    }
  };
};
