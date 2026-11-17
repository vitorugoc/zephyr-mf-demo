import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ServiceCatalog from './ServiceCatalog';

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element');

createRoot(root).render(
  <StrictMode>
    <ServiceCatalog />
  </StrictMode>,
);
