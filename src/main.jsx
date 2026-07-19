import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import WebGLCanvas from './components/WebGLCanvas';
import Navigation from './components/Navigation';
import PageRenderer from './components/PageRenderer';
import { getPageData } from './sanity';
import { renderFallbackRoute } from './fallbackRoutes';
import './style.css';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [sanityData, setSanityData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Handle SPA routing navigation
  const navigateTo = (path) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handle accordion toggles inside raw fallback HTML (event delegation)
  useEffect(() => {
    const handleGlobalClick = (e) => {
      const toggle = e.target.closest('.accordion-toggle');
      if (toggle) {
        e.preventDefault();
        const content = toggle.nextElementSibling;
        if (content && content.classList.contains('accordion-content')) {
          const isOpen = content.style.display === 'block';
          content.style.display = isOpen ? 'none' : 'block';
          toggle.classList.toggle('expanded', !isOpen);
          
          const text = toggle.textContent;
          if (text.includes('+')) {
            toggle.textContent = text.replace('+', '−');
          } else if (text.includes('−')) {
            toggle.textContent = text.replace('−', '+');
          } else if (text.includes('-')) {
            toggle.textContent = text.replace('-', '+');
          }
        }
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  // Fetch page content from Sanity when path changes
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on navigation

    if (currentPath === '/' || currentPath === '/admin') {
      setSanityData(null);
      return;
    }

    const fetchPage = async () => {
      setIsLoading(true);
      const data = await getPageData(currentPath);
      setSanityData(data);
      setIsLoading(false);

      // Initialize intersection observer animations for new page content
      setTimeout(initScrollAnimations, 100);
    };

    fetchPage();
  }, [currentPath]);

  const isHome = currentPath === '/';
  const isAdmin = currentPath === '/admin';

  // Apply layout modifications based on route states
  useEffect(() => {
    if (isMobileOpen) {
      document.body.classList.add('mobile-nav-open');
    } else {
      document.body.classList.remove('mobile-nav-open');
    }
  }, [isMobileOpen]);

  // Render logic
  const renderContent = () => {
    if (isAdmin) {
      return (
        <div className="content-page" style={{ padding: '60px 40px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2>⚙️ Sanity CMS Studio</h2>
          <p style={{ marginTop: '20px', lineHeight: '1.6' }}>
            콘텐츠를 추가하고 수정하려면 Sanity Studio를 사용하세요.<br />
            로컬에서 개발 중일 경우 아래 주소로 접속할 수 있습니다:
          </p>
          <p style={{ margin: '20px 0' }}>
            <a href="http://localhost:3333" target="_blank" rel="noopener noreferrer" style={{ color: '#FF00CB', fontWeight: 'bold', textDecoration: 'underline' }}>
              http://localhost:3333 (Local Studio)
            </a>
          </p>
          <p style={{ fontSize: '14px', color: '#666' }}>
            배포 후에는 <a href="https://sanity.io/manage" target="_blank" rel="noopener noreferrer" style={{ color: '#0080FF' }}>Sanity Manage</a> 콘솔에서 스튜디오 배포 링크를 생성하거나 클라우드 관리가 가능합니다.
          </p>
          <p style={{ marginTop: '40px' }}>
            <a href="/" onClick={(e) => { e.preventDefault(); navigateTo('/'); }} style={{ textDecoration: 'underline' }}>← 홈으로 돌아가기</a>
          </p>
        </div>
      );
    }

    if (isHome) {
      return null;
    }

    if (isLoading) {
      return (
        <div className="content-page" style={{ textAlign: 'center', padding: '100px 0', color: '#888' }}>
          Loading...
        </div>
      );
    }

    // Sanity에 데이터가 설정되어 있으면 Sanity 렌더러를 사용, 없으면 기존 하드코딩 Fallback 컴포넌트 사용
    if (sanityData) {
      return <PageRenderer data={sanityData} />;
    } else {
      return renderFallbackRoute(currentPath);
    }
  };

  return (
    <div id="app">
      {!isAdmin && (
        <Navigation
          currentPath={currentPath}
          onNavigate={navigateTo}
          isHome={isHome}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />
      )}

      {!isAdmin && <WebGLCanvas isHome={isHome} />}

      <div id="page-content">
        {renderContent()}
      </div>

      {!isAdmin && (
        <footer className="footer" id="footer">
          <div className="footer-line"></div>
          <div className="footer-content">
            <p className="footer-copyright">© 2026 by He Jin Jang Dance. all right reserved.</p>
            <div className="footer-social">
              <a href="https://www.instagram.com/hejinjangdance" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="https://www.youtube.com/@hejinjangdance" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="YouTube">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

// Fade in animations utility
function initScrollAnimations() {
  const elements = document.querySelectorAll('.content-page p, .content-page img, .about-section p, .about-section img');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  elements.forEach(el => {
    el.classList.add('fade-in-up');
    observer.observe(el);
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
