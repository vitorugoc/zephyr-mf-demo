import '@portal/ui/tokens.css';
import { loadRemote } from '@module-federation/enhanced/runtime';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App, { type RemotePage } from './App';

async function loadCatalog(): Promise<RemotePage> {
  const page = await loadRemote<RemotePage>('catalog/ServiceCatalog');
  if (!page) throw new Error('Remote "catalog" returned no module');
  return page;
}

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element');

createRoot(root).render(
  <StrictMode>
    <App loadCatalog={loadCatalog} />
  </StrictMode>,
);
