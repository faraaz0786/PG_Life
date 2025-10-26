// client/src/main.jsx
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './services/queryClient.js';
import { AuthProvider } from './context/AuthContext.jsx';
import App from './App.jsx';
import { Toaster } from 'react-hot-toast';

import './styles/index.css';
import 'leaflet/dist/leaflet.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* Vercel: make sure you added a rewrite so deep links always serve `/` */}
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <>
            <App />
            <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
          </>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
