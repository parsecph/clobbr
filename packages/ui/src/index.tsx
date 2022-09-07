import { createRoot } from 'react-dom/client';
import { rootContainer } from 'rootContainer';

import './shared/font/inter.css';
import './shared/index.css';
import App from 'app/App';

const root = createRoot(rootContainer);

root.render(<App />);
