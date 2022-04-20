import { createRoot } from 'react-dom/client';

import './shared/font/inter.css';
import './shared/index.css';
import App from 'App/App';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

root.render(<App />);
