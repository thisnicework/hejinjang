import React, { useState, useEffect } from 'react';
import { getAllPages } from '../sanity';
import logoImg from '../assets/logo.png';

// Hardcoded fallback list matching the original menu structure
const FALLBACK_PAGES = [
  { title: "About", path: "/about-bio", navCategory: "about", navLabel: "About", navOrder: 0 },
  { title: "Unseaming. (2021-2025)", path: "/unseaming-2021-2025", navCategory: "works-selected", navLabel: "Unseaming. (2021-2025)", navOrder: 1 },
  { title: "Slow Carnival World (2023-ongoing)", path: "/slow-carnival-world-2023", navCategory: "works-selected", navLabel: "Slow Carnival World (2023-ongoing)", navOrder: 2 },
  { title: "I Bet You'd Put That On (2022)", path: "/i-bet-you-d-put-that-on-2022", navCategory: "works-selected", navLabel: "I Bet You'd Put That On (2022)", navOrder: 3 },
  { title: "You Cannot Disinvite X-being (2021)", path: "/you-cannot-disinvite-x-being-2021", navCategory: "works-selected", navLabel: "You Cannot Disinvite X-being (2021)", navOrder: 4 },
  { title: "the flowing. (2021-23)", path: "/the-flowing-2021-23", navCategory: "works-selected", navLabel: "the flowing. (2021-23)", navOrder: 5 },
  { title: "Microhabitat Body: Last Words (2020)", path: "/microhabitat-body-last-words-2020", navCategory: "works-selected", navLabel: "Microhabitat Body: Last Words (2020)", navOrder: 6 },
  
  { title: "2019 꿈꾼꿈-곳", path: "/dreams-dreamt-place-2019", navCategory: "works-archive", navLabel: "2019 꿈꾼꿈-곳", navOrder: 7 },
  { title: "2017 전시: 감기긁기걷기", path: "/exhibition-catching-a-cold-2017", navCategory: "works-archive", navLabel: "2017 전시: 감기긁기걷기", navOrder: 8 },
  { title: "2015 The artist is absent", path: "/the-artist-is-absent-2015", navCategory: "works-archive", navLabel: "2015 The artist is absent", navOrder: 9 },
  { title: "2015 당인리-Dance for 1", path: "/dangin-ri-dance-for-1-2015", navCategory: "works-archive", navLabel: "2015 당인리-Dance for 1", navOrder: 10 },
  { title: "2015 당인리-BODYLAND", path: "/dangin-ri-bodyland-2015", navCategory: "works-archive", navLabel: "2015 당인리-BODYLAND", navOrder: 11 },
  { title: "2014 Ethical goodbyes", path: "/ethical-goodbyes-2014", navCategory: "works-archive", navLabel: "2014 Ethical goodbyes", navOrder: 12 },
  { title: "2013-14 Tantalizingly Empathetic", path: "/tantalizingly-empathetic-2013-2014", navCategory: "works-archive", navLabel: "2013-14 Tantalizingly Empathetic", navOrder: 13 },
  { title: "2014 Uncanny of the Uncanny", path: "/uncanny-of-the-uncanny-2014", navCategory: "works-archive", navLabel: "2014 Uncanny of the Uncanny", navOrder: 14 },
  { title: "2013 Practice of Being Together", path: "/practice-of-being-together-2013", navCategory: "works-archive", navLabel: "2013 Practice of Being Together", navOrder: 15 },
  { title: "2013 We will all be dreaming", path: "/we-will-all-be-dreaming-2013", navCategory: "works-archive", navLabel: "2013 We will all be dreaming", navOrder: 16 },
  { title: "2013 Of the presence of “us-ness”", path: "/of-the-presence-of-us-ness-2013", navCategory: "works-archive", navLabel: "2013 Of the presence of “us-ness”", navOrder: 17 },
  { title: "2012 Practice of Cost-effectiveness", path: "/practice-of-cost-effectiveness-2012", navCategory: "works-archive", navLabel: "2012 Practice of Cost-effectiveness", navOrder: 18 },
  { title: "2011 Movement Study on No to self-editing", path: "/movement-study-on-no-to-self-editing-2011", navCategory: "works-archive", navLabel: "2011 Movement Study on No to self-editing", navOrder: 19 },
  { title: "2011 De-re-pair", path: "/de-re-pair-2011", navCategory: "works-archive", navLabel: "2011 De-re-pair", navOrder: 20 },
  { title: "2010 Dear Silence", path: "/dear-silence-2010", navCategory: "works-archive", navLabel: "2010 Dear Silence", navOrder: 21 },
  { title: "2018 협업 Piece with gaps", path: "/piece-with-gaps-2018", navCategory: "works-archive", navLabel: "2018 협업 Piece with gaps", navOrder: 22 },
  { title: "View Full Archive →", path: "/archive", navCategory: "works-archive", navLabel: "View Full Archive →", navOrder: 23 },

  { title: "Teaching Bio", path: "/teaching-bio", navCategory: "teaching", navLabel: "Teaching Bio", navOrder: 24 },
  { title: "View All Workshops →", path: "/workshops", navCategory: "teaching", navLabel: "View All Workshops →", navOrder: 25 },

  { title: "Press", path: "/press-review", navCategory: "press", navLabel: "Press", navOrder: 26 },
  { title: "Contact", path: "/contact", navCategory: "contact", navLabel: "Contact", navOrder: 27 },
];

export default function Navigation({ currentPath, onNavigate, isHome, isMobileOpen, setIsMobileOpen }) {
  const [pages, setPages] = useState(FALLBACK_PAGES);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Fetch pages dynamically from Sanity on mount
  useEffect(() => {
    async function loadPages() {
      const fetched = await getAllPages();
      if (fetched && fetched.length > 0) {
        // filter out documents set to 'none' category
        const filtered = fetched.filter(p => p.navCategory !== 'none');
        const merged = [...filtered];

        // Ensure key static pages (about, press, contact, archive, workshops) are present
        const pathsInFetched = new Set(filtered.map(p => p.path));
        FALLBACK_PAGES.forEach(fb => {
          if (!pathsInFetched.has(fb.path) && 
              (fb.navCategory === 'about' || 
               fb.navCategory === 'press' || 
               fb.navCategory === 'contact' || 
               fb.path === '/archive' || 
               fb.path === '/workshops')) {
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
  const teachingPages = pages.filter(p => p.navCategory === 'teaching');
  const pressPage = pages.find(p => p.navCategory === 'press') || { path: '/press-review', navLabel: 'Press' };
  const contactPage = pages.find(p => p.navCategory === 'contact') || { path: '/contact', navLabel: 'Contact' };

  // Auto-expand dropdown accordion depending on active URL path
  useEffect(() => {
    const isWorksPath = worksSelected.some(p => p.path === currentPath) || 
                        worksArchive.some(p => p.path === currentPath) || 
                        currentPath === '/archive';
    const isTeachingPath = teachingPages.some(p => p.path === currentPath) || 
                           currentPath === '/workshops';

    if (isWorksPath) {
      setActiveDropdown('works');
    } else if (isTeachingPath) {
      setActiveDropdown('teaching');
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
          <li className="nav-item">
            <a 
              href={aboutPage.path} 
              className={`nav-link ${currentPath === aboutPage.path ? 'active' : ''}`}
              onClick={(e) => handleLinkClick(e, aboutPage.path)}
            >
              {aboutPage.navLabel || 'About'}
            </a>
          </li>
          
          <li className={`nav-item has-dropdown ${activeDropdown === 'works' ? 'accordion-open' : ''}`}>
            <a 
              href="#" 
              className={`nav-link ${activeDropdown === 'works' ? 'submenu-open' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                toggleDropdown('works');
              }}
            >
              Works <span className="menu-arrow">{activeDropdown === 'works' ? '−' : '+'}</span>
            </a>
            <ul className="dropdown">
              <li className="dropdown-section-title">Selected Works</li>
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
              
              <li className="dropdown-section-title divider">Archive</li>
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
          
          <li className="nav-item">
            <a 
              href={pressPage.path} 
              className={`nav-link ${currentPath === pressPage.path ? 'active' : ''}`}
              onClick={(e) => handleLinkClick(e, pressPage.path)}
            >
              {pressPage.navLabel || 'Press'}
            </a>
          </li>
          
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
