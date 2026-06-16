// ===========================
// He Jin Jang Dance — JS
// ===========================

document.addEventListener('DOMContentLoaded', () => {
  initDropdowns();
  setActiveNavLink();
  initClothParallax();
  initKeyboardNav();
});

// ===========================
// DROPDOWN NAVIGATION
// ===========================
function initDropdowns() {
  const toggles = document.querySelectorAll('.nav-dropdown-toggle');

  toggles.forEach(toggle => {
    const dropdownId = toggle.id.replace('nav-', 'dropdown-').replace('-container', '');
    const dropdown = document.getElementById(dropdownId) || toggle.nextElementSibling;

    if (!dropdown) return;

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';

      // Close all other dropdowns
      toggles.forEach(otherToggle => {
        if (otherToggle !== toggle) {
          otherToggle.setAttribute('aria-expanded', 'false');
          const otherDropdown = otherToggle.nextElementSibling;
          if (otherDropdown) {
            otherDropdown.classList.remove('is-open');
          }
        }
      });

      // Toggle this one
      toggle.setAttribute('aria-expanded', String(!isOpen));
      dropdown.classList.toggle('is-open', !isOpen);
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', () => {
    toggles.forEach(toggle => {
      toggle.setAttribute('aria-expanded', 'false');
      const dropdown = toggle.nextElementSibling;
      if (dropdown) dropdown.classList.remove('is-open');
    });
  });

  // Prevent dropdown close when clicking inside nav
  document.querySelector('.sidebar-nav')?.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

// ===========================
// ACTIVE NAV LINK
// ===========================
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .nav-dropdown-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href && href !== '#' && href.includes(currentPage.replace('.html', ''))) {
      link.classList.add('active');
    }
  });
}

// ===========================
// CLOTH PARALLAX EFFECT
// ===========================
function initClothParallax() {
  const clothWrapper = document.getElementById('cloth-wrapper');
  const blackBar = document.getElementById('black-bar');
  const heroDesc = document.getElementById('hero-description');

  if (!clothWrapper) return;

  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;
  const ease = 0.04;

  document.addEventListener('mousemove', (e) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    mouseX = (e.clientX - centerX) / centerX;
    mouseY = (e.clientY - centerY) / centerY;
  });

  function animateParallax() {
    currentX += (mouseX - currentX) * ease;
    currentY += (mouseY - currentY) * ease;

    const translateX = currentX * 18;
    const translateY = currentY * 12;
    const rotateZ = currentX * 2.5;

    if (clothWrapper) {
      clothWrapper.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotateZ}deg)`;
    }

    if (blackBar) {
      blackBar.style.transform = `rotate(-38deg) translateX(${-10 + currentX * 8}px) translateY(${currentY * 6}px)`;
    }

    if (heroDesc) {
      heroDesc.style.transform = `translateY(calc(-50% + ${currentY * 4}px))`;
    }

    requestAnimationFrame(animateParallax);
  }

  animateParallax();

  // Touch support
  document.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    mouseX = (touch.clientX - centerX) / centerX;
    mouseY = (touch.clientY - centerY) / centerY;
  }, { passive: true });
}

// ===========================
// KEYBOARD NAVIGATION
// ===========================
function initKeyboardNav() {
  const toggles = document.querySelectorAll('.nav-dropdown-toggle');

  toggles.forEach(toggle => {
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle.click();
      }
      if (e.key === 'Escape') {
        toggle.setAttribute('aria-expanded', 'false');
        const dropdown = toggle.nextElementSibling;
        if (dropdown) dropdown.classList.remove('is-open');
      }
    });
  });
}

// ===========================
// PAGE TRANSITIONS (subtle fade)
// ===========================
document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  // Internal links only
  if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto')) {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      // Vercel cleanUrls: .html 확장자 제거
      const cleanHref = href.replace(/\.html$/, '') || '/';
      document.body.style.transition = 'opacity 0.28s ease';
      document.body.style.opacity = '0';
      setTimeout(() => {
        window.location.href = cleanHref;
      }, 300);
    });
  }
});

// 페이드인 함수 — load와 pageshow(bfcache 복원) 양쪽에서 사용
function fadePageIn() {
  // transition 일시 제거 후 opacity 0 확정 → 그 다음 프레임에서 트랜지션 적용
  document.body.style.transition = 'none';
  document.body.style.opacity = '0';
  // 이중 rAF: 첫 번째 rAF에서 opacity:0이 렌더링된 뒤, 두 번째 rAF에서 트랜지션 시작
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.transition = 'opacity 0.4s ease';
      document.body.style.opacity = '1';
    });
  });
}

// 일반 페이지 로드
window.addEventListener('load', fadePageIn);

// bfcache(뒤로/앞으로 이동) 복원 시 — load 이벤트가 재실행되지 않으므로 별도 처리
window.addEventListener('pageshow', (e) => {
  if (e.persisted) {
    fadePageIn();
  }
});
