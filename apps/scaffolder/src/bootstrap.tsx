import '@portal/ui/tokens.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import GoldenPaths from './GoldenPaths';

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element');

createRoot(root).render(
  <StrictMode>
    <GoldenPaths />
  </StrictMode>,
);
