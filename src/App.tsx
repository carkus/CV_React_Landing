import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Notepad from './pages/Notepad';
import Visits from './pages/Visits';
import SmoothSoftware from './pages/SmoothSoftware';
import DisciplinePage from './pages/DisciplinePage';
import BackToTop from './components/BackToTop';
import SkipLink from './components/SkipLink';

export default function App() {
  return (
    <BrowserRouter>
      <SkipLink />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notepad" element={<Notepad />} />
        <Route path="/visits" element={<Visits />} />
        <Route path="/smooth-software" element={<SmoothSoftware />} />
        <Route path="/web" element={<DisciplinePage discipline="web" />} />
        <Route path="/ai" element={<DisciplinePage discipline="ai" />} />
        <Route path="/mobile" element={<DisciplinePage discipline="mobile" />} />
        {/* Any undefined path redirects to the homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BackToTop />
    </BrowserRouter>
  );
}
