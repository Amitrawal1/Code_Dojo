import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './assets/pages/Dashboard';
import Workspace from './assets/pages/Workspace';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/problem/:id" element={<Workspace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
