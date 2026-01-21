import { Outlet } from 'react-router-dom';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen flex flex-col py-8 px-4" style={{ backgroundColor: 'var(--bg-body)' }}>
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default App;
