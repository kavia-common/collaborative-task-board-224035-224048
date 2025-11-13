import { render } from '@testing-library/react';
import App from './pages/App';

test('renders app without crashing', () => {
  render(<App />);
});
