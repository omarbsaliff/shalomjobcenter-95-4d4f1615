
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/theme.css';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './hooks/useTheme';
import { AccessibilityProvider } from './hooks/useAccessibility';
import { AuthProvider } from './hooks/auth/useAuth';

// Création d'un composant ErrorBoundary pour gérer les erreurs de rendu
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="p-4 m-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <h2>Une erreur s'est produite.</h2>
        <p>L'application a rencontré un problème. Veuillez rafraîchir la page.</p>
      </div>;
    }

    return this.props.children;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Réduire le nombre de tentatives en cas d'échec
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AccessibilityProvider>
              <AuthProvider>
                <App />
              </AuthProvider>
            </AccessibilityProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);
