import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

const container = document.getElementById('root');
if (!container)
    throw new Error("Container is undefined");
const root = createRoot(container);
root.render(<App />);

