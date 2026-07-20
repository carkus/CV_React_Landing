import { useEffect } from 'react';
import NavBar from '../components/NavBar';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import SkillsSection from '../components/SkillsSection';
import WorkSection from '../components/WorkSection';
import AiSection from '../components/AiSection';
import AskSection from '../components/AskSection';
import ExpertiseSection from '../components/ExpertiseSection';
import TimelineSection from '../components/TimelineSection';
import ReferencesSection from '../components/ReferencesSection';
import ContactSection from '../components/ContactSection';
import FooterSection from '../components/FooterSection';

export default function Home() {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <NavBar />
      <HeroSection />
      <AboutSection />
      <AskSection />
      <SkillsSection />
      <AiSection />
      <WorkSection />
      <ExpertiseSection />
      <TimelineSection />
      <ReferencesSection />
      <ContactSection />
      <FooterSection />
    </>
  );
}
