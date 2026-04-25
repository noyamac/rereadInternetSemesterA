import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './custom.scss';
import './index.css';
import './App.css';
import App from './App.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId="1080660668277-4ipj38tcmbl876vnd57tu8nshqfj5lkc.apps.googleusercontent.com">
    <StrictMode>
      <App />
    </StrictMode>
  </GoogleOAuthProvider>,
);
