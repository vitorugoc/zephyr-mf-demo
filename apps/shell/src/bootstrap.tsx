import '@portal/ui/tokens.css';
import { loadRemote } from '@module-federation/enhanced/runtime';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App, { type RemotePage } from './App';
import { type RemoteEntry, registry } from './registry';

async function loadPage(entry: RemoteEntry): Promise<RemotePage> {
  // "./ServiceCatalog" exposed by "catalog" is requested as "catalog/ServiceCatalog".
  const id = `${entry.name}/${entry.module.replace(/^\.\//, '')}`;
  const page = await loadRemote<RemotePage>(id);
  if (!page) throw new Error(`Remote module "${id}" resolved to nothing`);
  return page;
}

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element');

createRoot(root).render(
  <StrictMode>
    <App remotes={registry} load={loadPage} />
  </StrictMode>,
);
