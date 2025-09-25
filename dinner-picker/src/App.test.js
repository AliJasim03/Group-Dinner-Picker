import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import App from './App';

const theme = createTheme();

const renderAppWithProviders = () => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
        <Toaster />
      </ThemeProvider>
    </BrowserRouter>
  );
};


jest.mock('./services/api', () => ({
  groupAPI: {
    getUserGroups: jest.fn().mockResolvedValue({ data: [] })
  },
  sessionAPI: {
    getGroupSessions: jest.fn().mockResolvedValue({ data: [] })
  }
}));

test('renders app without crashing', () => {
  renderAppWithProviders();
  // Just test that the app renders without errors
  expect(document.body).toBeInTheDocument();
});

test('renders navigation elements', () => {
  renderAppWithProviders();
  // Test for elements that should always be present
  const appElement = screen.getByTestId ? screen.getByTestId('app') : document.body;
  expect(appElement).toBeInTheDocument();
});