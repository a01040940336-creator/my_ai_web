/* ===== 스크롤 시 헤더 스타일 변경 ===== */
const header = document.getElementById('header');
const backTop = document.getElementById('backTop');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 50;
  header.classList.toggle('scrolled', scrolled);
  backTop.classList.toggle('visible', window.scrollY > 400);
});

/* ===== 맨 위로 버튼 ===== */
backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ===== 모바일 햄버거 메뉴 ===== */
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  nav.classList.toggle('open');
});

// 메뉴 링크 클릭 시 닫기
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    nav.classList.remove('open');
  });
});

/* ===== 스킬 바 애니메이션 (IntersectionObserver) ===== */
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      fill.style.width = fill.dataset.width + '%';
      skillObserver.unobserve(fill);
    }
  });
}, { threshold: 0.3 });

skillFills.forEach(fill => skillObserver.observe(fill));

/* ===== 프로젝트 필터 ===== */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
    });
  });
});

/* ===== 섹션 페이드인 애니메이션 ===== */
const sections = document.querySelectorAll('.section');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

sections.forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(30px)';
  section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  sectionObserver.observe(section);
});

/* ===== 문의 폼 제출 ===== */
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type="submit"]');
  btn.textContent = '전송 완료! ✓';
  btn.style.background = '#22c55e';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = '메시지 보내기';
    btn.style.background = '';
    btn.disabled = false;
    contactForm.reset();
  }, 3000);
});
