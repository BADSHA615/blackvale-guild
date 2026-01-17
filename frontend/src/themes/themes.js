// Theme configurations for the website
// Each theme defines CSS variable values

const themes = {
  dark: {
    name: 'Dark Mode',
    description: 'Original dark theme - Perfect for gaming',
    primaryBg: '#0a0e27',
    secondaryBg: '#1a1f3a',
    accentColor: '#ffd700',
    textColor: '#ffffff',
    borderColor: '#333',
    hoverColor: '#00d4ff',
  },
  light: {
    name: 'Light Mode',
    description: 'Clean light theme - Easy on the eyes',
    primaryBg: '#ffffff',
    secondaryBg: '#f5f5f5',
    accentColor: '#0066cc',
    textColor: '#333333',
    borderColor: '#cccccc',
    hoverColor: '#0099ff',
  },
  neon: {
    name: 'Neon',
    description: 'Vibrant neon theme - Maximum gaming vibes',
    primaryBg: '#0a0a0f',
    secondaryBg: '#1a1a2e',
    accentColor: '#00ffff',
    textColor: '#ffffff',
    borderColor: '#00ffff',
    hoverColor: '#ff00ff',
  },
  ocean: {
    name: 'Ocean',
    description: 'Cool ocean-inspired theme',
    primaryBg: '#0b1929',
    secondaryBg: '#1a3a52',
    accentColor: '#00d4ff',
    textColor: '#e0f7ff',
    borderColor: '#0099cc',
    hoverColor: '#00ffff',
  },
  forest: {
    name: 'Forest',
    description: 'Nature-inspired green theme',
    primaryBg: '#0d2818',
    secondaryBg: '#1a3d2a',
    accentColor: '#51cf66',
    textColor: '#e0f2e0',
    borderColor: '#2d5a3d',
    hoverColor: '#69de42',
  },
  sunset: {
    name: 'Sunset',
    description: 'Warm sunset colors',
    primaryBg: '#3d1f1f',
    secondaryBg: '#5a2a2a',
    accentColor: '#ffb366',
    textColor: '#fff5e0',
    borderColor: '#cc6600',
    hoverColor: '#ff9933',
  },
  midnight: {
    name: 'Midnight',
    description: 'Deep midnight blue',
    primaryBg: '#0a0f2c',
    secondaryBg: '#151b4d',
    accentColor: '#6699ff',
    textColor: '#e0e0ff',
    borderColor: '#3333cc',
    hoverColor: '#99bbff',
  }
};

export default themes;
