import { useEffect } from 'react';
import { useDocumentMeta } from '../seo';
import NavBar from '../components/NavBar';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import BadgeRail from '../components/rails/BadgeRail';
import SkillsSection from '../components/SkillsSection';
import WorkSection from '../components/WorkSection';
import AskSection from '../components/AskSection';
import TimelineSection from '../components/TimelineSection';
import ContactSection from '../components/ContactSection';
import FooterSection from '../components/FooterSection';

export default function Home() {
  useDocumentMeta({
    title: 'Mark Scicluna',
    description: 'Mark Scicluna — software engineer with 10+ years building cross-platform mobile (Swift/SwiftUI, Flutter, React Native), web (React, Blazor/.NET), and visionOS/spatial computing apps. Recent work in multi-provider LLM orchestration, RAG, and structured AI outputs. Based in Melbourne, Australia, open to remote.',
    path: '/',
  });

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

  // BrowserRouter keeps the previous page's scroll position, so coming back
  // home from a sub-page would land mid-page — always start at the top,
  // unless arriving via a link like /#contact, which the browser won't
  // hash-scroll for a client-side navigation, so do that manually instead.
  useEffect(() => {
    if (window.location.hash) {
      document.querySelector(window.location.hash)?.scrollIntoView();
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, []);

  return (
    <>
      <NavBar />
      <HeroSection />
      <AboutSection />
      <BadgeRail railId="deep-dives" />
      <AskSection />
      <BadgeRail railId="ai-threads" sectionId="ai" />
      <SkillsSection />
      <WorkSection />
      <TimelineSection />
      <ContactSection />
      <FooterSection />
    </>
  );
}
