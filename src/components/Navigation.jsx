import React, { useState, useEffect } from 'react';
import { getAllPages } from '../sanity';
import logoImg from '../assets/logo.png';

// Reconstructed menu pages list from hejinjang.com
const FALLBACK_PAGES = [
  { title: "About", path: "/about-bio", navCategory: "about", navLabel: "About", navOrder: 10 },
  
  // Selected Works
  { title: "Soft Rehearsal for Fugitive Gathering", path: "/softrehearsalforfugitivegathering", navCategory: "works-selected", navLabel: "Soft Rehearsal for Fugitive Gathering", navOrder: 30 },
  { title: "Slow Carnival World (2023-ongoing)", path: "/slow-carnival-world-2023", navCategory: "works-selected", navLabel: "Slow Carnival World (2023-ongoing)", navOrder: 31 },
  { title: "I Bet You’d Put That On (2022)", path: "/i-bet-you-d-put-that-on-2022", navCategory: "works-selected", navLabel: "I Bet You’d Put That On (2022)", navOrder: 32 },
  { title: "You Cannot Disinvite X-being (2021)", path: "/you-cannot-disinvite-x-being-2021", navCategory: "works-selected", navLabel: "You Cannot Disinvite X-being (2021)", navOrder: 33 },
  { title: "the flowing. (2021-23)", path: "/the-flowing-2021-23", navCategory: "works-selected", navLabel: "the flowing. (2021-23)", navOrder: 34 },
  { title: "Microhabitat Body: Last Words (2020)", path: "/microhabitat-body-last-words-2020", navCategory: "works-selected", navLabel: "Microhabitat Body: Last Words (2020)", navOrder: 35 },
  
  // Archive
  { title: "Latent in Pre-Chaos (2024)", path: "/복제-slow-carnival-world-2023-recent", navCategory: "works-archive", navLabel: "Latent in Pre-Chaos (2024)", navOrder: 40 },
  { title: "Whirling Skin (2024)", path: "/복제-latent-in-pre-chaos-2024", navCategory: "works-archive", navLabel: "Whirling Skin (2024)", navOrder: 41 },
  { title: "Porous Research (2023)", path: "/porous-research-2023", navCategory: "works-archive", navLabel: "Porous Research (2023)", navOrder: 42 },
  { title: "Weekly Weakly: Performance (2020)", path: "/weekly-weakly-2020", navCategory: "works-archive", navLabel: "Weekly Weakly: Performance (2020)", navOrder: 43 },
  { title: "Weekly Weakly: Exhibition (2020)", path: "/exhibition-weekly-weakly-2020", navCategory: "works-archive", navLabel: "Weekly Weakly: Exhibition (2020)", navOrder: 44 },
  { title: "Microhabitat Body (2018)", path: "/microhabitat-body-2018", navCategory: "works-archive", navLabel: "Microhabitat Body (2018)", navOrder: 45 },
  { title: "living without (      ) (2017)", path: "/living-without-2017", navCategory: "works-archive", navLabel: "living without (      ) (2017)", navOrder: 46 },
  { title: "Drifting Body (2015-17)", path: "/drifting-body-2015-17", navCategory: "works-archive", navLabel: "Drifting Body (2015-17)", navOrder: 47 },
  { title: "migrant-self the speed of a door (2012)", path: "/migrant-self-the-speed-of-a-door-2012-16", navCategory: "works-archive", navLabel: "migrant-self the speed of a door (2012)", navOrder: 48 },
  { title: "Silence Replaced: (2009-12)", path: "/silence-replaced-2009-12", navCategory: "works-archive", navLabel: "Silence Replaced: (2009-12)", navOrder: 49 },
  { title: "Do Not Lean On Door (2008-09)", path: "/do-not-lean-on-door-2008-09", navCategory: "works-archive", navLabel: "Do Not Lean On Door (2008-09)", navOrder: 50 },
  { title: "Open Skin Inscribed (2008)", path: "/open-skin-inscribed-2008", navCategory: "works-archive", navLabel: "Open Skin Inscribed (2008)", navOrder: 51 },

  // Collective Works
  { title: "Navigating Uncertain.. (2023-ongoing)", path: "/navigating-uncertain-terrain-with-generosity-2023", navCategory: "works-collective", navLabel: "Navigating Uncertain.. (2023-ongoing)", navOrder: 60 },
  { title: "We Need 9 Dance Songs, Seriously (2023)", path: "/we-need-9-dance-songs-seriously-2023", navCategory: "works-collective", navLabel: "We Need 9 Dance Songs, Seriously (2023)", navOrder: 61 },
  { title: "Ghost Shower (2020-21)", path: "/ghost-shower-2020-21", navCategory: "works-collective", navLabel: "Ghost Shower (2020-21)", navOrder: 62 },
  { title: "Judson Drama (2020)", path: "/judson-drama-2020", navCategory: "works-collective", navLabel: "Judson Drama (2020)", navOrder: 63 },
  { title: "Entanglement Residency (2020)", path: "/entanglement-residency-2020", navCategory: "works-collective", navLabel: "Entanglement Residency (2020)", navOrder: 64 },
  { title: "Mirror Neuron Salon (2017)", path: "/mirror-neuron-salon-2017", navCategory: "works-collective", navLabel: "Mirror Neuron Salon (2017)", navOrder: 65 },
  { title: "Available (2011)", path: "/available-2011", navCategory: "works-collective", navLabel: "Available (2011)", navOrder: 66 },

  // Teaching
  { title: "Teaching Bio", path: "/teaching-bio", navCategory: "teaching", navLabel: "Teaching Bio", navOrder: 70 },
  { title: "Franklin Method Workshop & 1:1 Session", path: "/franklin-method-workshop-session", navCategory: "teaching", navLabel: "Franklin Method Workshop & 1:1 Session", navOrder: 71 },
  { title: "Movement Class: Dance with Fascia & Biom", path: "/movement-class-dance-with-fascia-biom", navCategory: "teaching", navLabel: "Movement Class: Dance with Fascia & Biom", navOrder: 72 },
  { title: "Workshop: Making (it) Work", path: "/workshop-making-it-work", navCategory: "teaching", navLabel: "Workshop: Making (it) Work", navOrder: 73 },
  { title: "Visceral Body Workshop for Visual Artist", path: "/visceral-body-workshop-for-visual-artist", navCategory: "teaching", navLabel: "Visceral Body Workshop for Visual Artist", navOrder: 74 },
  { title: "Workshop: Weekly Weakly", path: "/workshop-weekly-weakly", navCategory: "teaching", navLabel: "Workshop: Weekly Weakly", navOrder: 75 },

  // Writing
  { title: "Book Publication", path: "/book-publication", navCategory: "writing", navLabel: "Book Publication", navOrder: 80 },
  { title: "Contributed Articles", path: "/복제-contributed-articles", navCategory: "writing", navLabel: "Contributed Articles", navOrder: 81 },

  // Other static pages
  { title: "Press", path: "/press-review", navCategory: "press", navLabel: "Press", navOrder: 90 },
  { title: "Contact", path: "/contact", navCategory: "contact", navLabel: "Contact", navOrder: 100 },
];

export default function Navigation({ currentPath, onNavigate, isHome, isMobileOpen, setIsMobileOpen }) {
  const [pages, setPages] = useState(FALLBACK_PAGES);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Fetch pages dynamically from Sanity on mount
  useEffect(() => {
    async function loadPages() {
      const fetched = await getAllPages();
      if (fetched && fetched.length > 0) {
        const filtered = fetched.filter(p => p.navCategory !== 'none');
        const merged = [...filtered];

        // Ensure all key static pages are present from fallbacks if not in CMS
        const pathsInFetched = new Set(filtered.map(p => p.path));
        FALLBACK_PAGES.forEach(fb => {
          if (!pathsInFetched.has(fb.path)) {
            merged.push(fb);
          }
        });

        merged.sort((a, b) => (a.navOrder || 0) - (b.navOrder || 0));
        setPages(merged);
      }
    }
    loadPages();
  }, []);

  // Group pages by category
  const aboutPage = pages.find(p => p.navCategory === 'about') || { path: '/about-bio', navLabel: 'About' };
  const worksSelected = pages.filter(p => p.navCategory === 'works-selected');
  const worksArchive = pages.filter(p => p.navCategory === 'works-archive');
  const worksCollective = pages.filter(p => p.navCategory === 'works-collective');
  const teachingPages = pages.filter(p => p.navCategory === 'teaching');
  const writingPages = pages.filter(p => p.navCategory === 'writing');
  const pressPage = pages.find(p => p.navCategory === 'press') || { path: '/press-review', navLabel: 'Press' };
  const contactPage = pages.find(p => p.navCategory === 'contact') || { path: '/contact', navLabel: 'Contact' };

  // Auto-expand dropdown accordion depending on active URL path
  useEffect(() => {
    const isSel = worksSelected.some(p => p.path === currentPath);
    const isArc = worksArchive.some(p => p.path === currentPath);
    const isCol = worksCollective.some(p => p.path === currentPath);
    const isTeach = teachingPages.some(p => p.path === currentPath);
    const isWrit = writingPages.some(p => p.path === currentPath);

    if (isSel) {
      setActiveDropdown('selected');
    } else if (isArc) {
      setActiveDropdown('archive');
    } else if (isCol) {
      setActiveDropdown('collective');
    } else if (isTeach) {
      setActiveDropdown('teaching');
    } else if (isWrit) {
      setActiveDropdown('writing');
    }
  }, [currentPath, pages]);

  const handleLinkClick = (e, path) => {
    e.preventDefault();
    onNavigate(path);
    setIsMobileOpen(false); // Close mobile panel
  };

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <>
      {/* Header */}
      <header className="header" id="header">
        <a href="/" className="logo" onClick={(e) => handleLinkClick(e, '/')}>
          <img src={logoImg} alt="He Jin Jang Dance" className="logo-img" />
        </a>
        
        {/* Mobile Menu Toggle */}
        <button 
          id="mobile-menu-btn" 
          className="mobile-menu-btn" 
          aria-label="Toggle navigation menu"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </header>

      {/* Navigation */}
      <nav className={`nav ${activeDropdown ? 'has-active-submenu' : ''}`} id="nav">
        <ul className="nav-list">
          {/* About */}
          <li className="nav-item">
            <a 
              href={aboutPage.path} 
              className={`nav-link ${currentPath === aboutPage.path ? 'active' : ''}`}
              onClick={(e) => handleLinkClick(e, aboutPage.path)}
            >
              {aboutPage.navLabel || 'About'}
            </a>
          </li>
          
          {/* Selected Works */}
          <li className={`nav-item has-dropdown ${activeDropdown === 'selected' ? 'accordion-open' : ''}`}>
            <a 
              href="#" 
              className={`nav-link ${activeDropdown === 'selected' ? 'submenu-open' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                toggleDropdown('selected');
              }}
            >
              Selected Works <span className="menu-arrow">{activeDropdown === 'selected' ? '−' : '+'}</span>
            </a>
            <ul className="dropdown">
              {worksSelected.map((p, idx) => (
                <li key={`sel-${idx}`}>
                  <a 
                    href={p.path} 
                    className={currentPath === p.path ? 'active' : ''} 
                    onClick={(e) => handleLinkClick(e, p.path)}
                  >
                    {p.navLabel || p.title || 'Untitled'}
                  </a>
                </li>
              ))}
            </ul>
          </li>

          {/* Archive */}
          <li className={`nav-item has-dropdown ${activeDropdown === 'archive' ? 'accordion-open' : ''}`}>
            <a 
              href="#" 
              className={`nav-link ${activeDropdown === 'archive' ? 'submenu-open' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                toggleDropdown('archive');
              }}
            >
              Archive <span className="menu-arrow">{activeDropdown === 'archive' ? '−' : '+'}</span>
            </a>
            <ul className="dropdown">
              {worksArchive.map((p, idx) => (
                <li key={`arc-${idx}`}>
                  <a 
                    href={p.path} 
                    className={currentPath === p.path ? 'active' : ''} 
                    onClick={(e) => handleLinkClick(e, p.path)}
                  >
                    {p.navLabel || p.title || 'Untitled'}
                  </a>
                </li>
              ))}
            </ul>
          </li>

          {/* Collective Works */}
          <li className={`nav-item has-dropdown ${activeDropdown === 'collective' ? 'accordion-open' : ''}`}>
            <a 
              href="#" 
              className={`nav-link ${activeDropdown === 'collective' ? 'submenu-open' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                toggleDropdown('collective');
              }}
            >
              Collective Works <span className="menu-arrow">{activeDropdown === 'collective' ? '−' : '+'}</span>
            </a>
            <ul className="dropdown">
              {worksCollective.map((p, idx) => (
                <li key={`col-${idx}`}>
                  <a 
                    href={p.path} 
                    className={currentPath === p.path ? 'active' : ''} 
                    onClick={(e) => handleLinkClick(e, p.path)}
                  >
                    {p.navLabel || p.title || 'Untitled'}
                  </a>
                </li>
              ))}
            </ul>
          </li>
          
          {/* Teaching */}
          <li className={`nav-item has-dropdown ${activeDropdown === 'teaching' ? 'accordion-open' : ''}`}>
            <a 
              href="#" 
              className={`nav-link ${activeDropdown === 'teaching' ? 'submenu-open' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                toggleDropdown('teaching');
              }}
            >
              Teaching <span className="menu-arrow">{activeDropdown === 'teaching' ? '−' : '+'}</span>
            </a>
            <ul className="dropdown">
              {teachingPages.map((p, idx) => (
                <li key={`teach-${idx}`}>
                  <a 
                    href={p.path} 
                    className={currentPath === p.path ? 'active' : ''} 
                    onClick={(e) => handleLinkClick(e, p.path)}
                  >
                    {p.navLabel || p.title || 'Untitled'}
                  </a>
                </li>
              ))}
            </ul>
          </li>

          {/* Writing */}
          <li className={`nav-item has-dropdown ${activeDropdown === 'writing' ? 'accordion-open' : ''}`}>
            <a 
              href="#" 
              className={`nav-link ${activeDropdown === 'writing' ? 'submenu-open' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                toggleDropdown('writing');
              }}
            >
              Writing <span className="menu-arrow">{activeDropdown === 'writing' ? '−' : '+'}</span>
            </a>
            <ul className="dropdown">
              {writingPages.map((p, idx) => (
                <li key={`writ-${idx}`}>
                  <a 
                    href={p.path} 
                    className={currentPath === p.path ? 'active' : ''} 
                    onClick={(e) => handleLinkClick(e, p.path)}
                  >
                    {p.navLabel || p.title || 'Untitled'}
                  </a>
                </li>
              ))}
            </ul>
          </li>
          
          {/* Press */}
          <li className="nav-item">
            <a 
              href={pressPage.path} 
              className={`nav-link ${currentPath === pressPage.path ? 'active' : ''}`}
              onClick={(e) => handleLinkClick(e, pressPage.path)}
            >
              {pressPage.navLabel || 'Press'}
            </a>
          </li>
          
          {/* Contact */}
          <li className="nav-item">
            <a 
              href={contactPage.path} 
              className={`nav-link ${currentPath === contactPage.path ? 'active' : ''}`}
              onClick={(e) => handleLinkClick(e, contactPage.path)}
            >
              {contactPage.navLabel || 'Contact'}
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}

