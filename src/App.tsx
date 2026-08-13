import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Notepad from './pages/Notepad';
import SmoothSoftware from './pages/SmoothSoftware';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notepad" element={<Notepad />} />
        <Route path="/smooth-software" element={<SmoothSoftware />} />
        {/* Any undefined path redirects to the homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
