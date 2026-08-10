import { useEffect } from 'react';
import NavBar from '../components/NavBar';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import AchievementsSection from '../components/AchievementsSection';
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

    // Catches .reveal elements that mount later (e.g. after an async fetch resolves),
    // which the querySelectorAll above would otherwise miss.
    const mutObs = new MutationObserver(mutations => {
      for (const m of mutations) {
        m.addedNodes.forEach(node => {
          if (!(node instanceof Element)) return;
          if (node.matches('.reveal')) obs.observe(node);
          node.querySelectorAll?.('.reveal').forEach(el => obs.observe(el));
        });
      }
    });
    mutObs.observe(document.body, { childList: true, subtree: true });

    return () => { obs.disconnect(); mutObs.disconnect(); };
  }, []);

  return (
    <>
      <NavBar />
      <HeroSection />
      <AboutSection />
      <AchievementsSection />
      <AskSection />
      <SkillsSection />
      <AiSection />
      <ReferencesSection />
      <WorkSection />
      <ExpertiseSection />
      <TimelineSection />
      <ContactSection />
      <FooterSection />
    </>
  );
}
