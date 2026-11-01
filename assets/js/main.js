/**
 * AVENUE BUSINESS SERVICES - Modern Interactive Landing Page Script
 * Management: Hossam Nabil Abdel-Khalek (المدير العام)
 * Contact: 0100 942 6680 | h30635576@gmail.com
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initCounters();
  initCalculator();
  initFaqAccordion();
  initWhatsAppWidget();
  initContactForm();
  initCardModal();
  initClipboardButtons();
});

/* --------------------------------------------------------------------------
   1. Navbar & Header Scroll State
   -------------------------------------------------------------------------- */
function initNavbar() {
  const header = document.querySelector('.header-wrapper');
  const mobileToggle = document.querySelector('.mobile-toggle-btn');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Shrinking / blurred header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    highlightActiveNavLink();
  }, { passive: true });

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // Active link scroll spy
  function highlightActiveNavLink() {
    const scrollPos = window.scrollY + 120;
    const sections = document.querySelectorAll('section[id]');

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

/* --------------------------------------------------------------------------
   2. Scroll Animations (Scroll-Driven with IntersectionObserver Fallback)
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in-up');

  // If CSS scroll-driven animations are supported, the browser handles it via CSS.
  // Otherwise, use IntersectionObserver as recommended by modern-web-guidance
  if (!window.CSS || !CSS.supports('((animation-timeline: view()) and (animation-range: entry))')) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
  } else {
    // Immediate reveal fallback if CSS handles the timeline
    animatedElements.forEach(el => el.classList.add('revealed'));
  }
}

/* --------------------------------------------------------------------------
   3. Animated KPI / Metrics Counters
   -------------------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('.counter-val');
  let animated = false;

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const duration = 1800;
          const stepTime = 20;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = target;
              clearInterval(timer);
            } else {
              counter.textContent = Math.ceil(current);
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.5 });

  const metricsSection = document.querySelector('.hero-metrics');
  if (metricsSection) {
    countObserver.observe(metricsSection);
  }
}

/* --------------------------------------------------------------------------
   4. Interactive Consultation & Service Estimator Calculator
   -------------------------------------------------------------------------- */
function initCalculator() {
  const tabs = document.querySelectorAll('.calc-tab-btn');
  const panes = document.querySelectorAll('.calc-tab-pane');
  const optionCards = document.querySelectorAll('.calc-option-card');
  const summaryTitle = document.getElementById('calcSummaryTitle');
  const summaryNote = document.getElementById('calcSummaryNote');
  const calcWhatsAppBtn = document.getElementById('calcWhatsAppBtn');

  // Service data definition
  const serviceDetails = {
    'company-formation': {
      title: 'تأسيس شركة ذات مسؤولية محدودة (LLC)',
      duration: 'من 3 إلى 5 أيام عمل فقط',
      docs: 'صور بطاقات الرقم القومي للشركاء، التوكيل الرسمي، شهادة عدم التباس الاسم التجاري',
      defaultMsg: 'مرحباً، أود الاستفسار عن تأسيس شركة ذات مسؤولية محدودة، ما هي التكلفة والمستندات المطلوبة؟'
    },
    'tax-audit': {
      title: 'الإقرارات الضريبية والميزانيات المعتمدة',
      duration: 'إنجاز دوري شهري وسنوي معتمد',
      docs: 'فواتير المبيعات والمشتريات، كشوف الحسابات البنكية، مسير الرواتب',
      defaultMsg: 'مرحباً، أحتاج إلى محاسب قانوني لإعداد الإقرارات الضريبية والميزانية السنوية لشركتي.'
    },
    'schengen-visa': {
      title: 'استخراج وتجهيز تأشيرة دول الشنجن',
      duration: 'تجهيز الملف خلال 48 ساعة وحجز أقرب موعد',
      docs: 'جواز سفر ساري، كشف حساب بنكي لآخر 6 أشهر، إثبات المهنة أو السجل التجاري والبطاقة الضريبية',
      defaultMsg: 'مرحباً أڤينيو، أرغب في استخراج تأشيرة شنجن الأوروبية، برجاء المساعدة في تجهيز الملف وحجز الموعد.'
    },
    'investment-residency': {
      title: 'الإقامة الاستثمارية في مصر للعرب والأجانب',
      duration: 'من 15 إلى 30 يوماً حسب نوع الإقامة',
      docs: 'جواز السفر، السجل التجاري للشركة أو عقد الملكية الموثق، الموافقة الأمنية',
      defaultMsg: 'مرحباً، أود الحصول على استشارة بخصوص الإقامة الاستثمارية في مصر وشروط استخراجها.'
    }
  };

  let currentCategory = 'company-formation';
  let currentSelectionText = 'تأسيس شركة ذات مسؤولية محدودة (LLC)';

  // Tab switching
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPane = document.getElementById(tab.getAttribute('data-target'));
      if (targetPane) {
        targetPane.classList.add('active');
        currentCategory = tab.getAttribute('data-service');
        const firstCard = targetPane.querySelector('.calc-option-card');
        if (firstCard) {
          selectCard(firstCard, currentCategory);
        }
      }
    });
  });

  // Option selection
  optionCards.forEach(card => {
    card.addEventListener('click', () => {
      const parentPane = card.closest('.calc-tab-pane');
      if (parentPane) {
        parentPane.querySelectorAll('.calc-option-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const serviceKey = card.getAttribute('data-key') || currentCategory;
        const customTitle = card.querySelector('.calc-option-title').innerText;
        const customDesc = card.querySelector('.calc-option-desc').innerText;
        
        currentSelectionText = customTitle;
        updateSummary(customTitle, customDesc);
      }
    });
  });

  function selectCard(card, category) {
    const parentPane = card.closest('.calc-tab-pane');
    if (parentPane) {
      parentPane.querySelectorAll('.calc-option-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const data = serviceDetails[category];
      if (data) {
        updateSummary(data.title, `المستندات: ${data.docs} | الوقت المقدر: ${data.duration}`);
      }
    }
  }

  function updateSummary(title, note) {
    if (summaryTitle) summaryTitle.textContent = title;
    if (summaryNote) summaryNote.textContent = note;
    if (calcWhatsAppBtn) {
      const message = `مرحباً شركة أڤينيو لخدمات الأعمال، أرغب في استشارة ومعرفة تكلفة: ${title}. هل يمكن تزويدي بالتفاصيل؟`;
      calcWhatsAppBtn.href = `https://wa.me/201009426680?text=${encodeURIComponent(message)}`;
    }
  }

  // Initial update
  if (calcWhatsAppBtn) {
    updateSummary(serviceDetails['company-formation'].title, `المستندات: ${serviceDetails['company-formation'].docs} | الوقت: ${serviceDetails['company-formation'].duration}`);
  }
}

/* --------------------------------------------------------------------------
   5. FAQ Accordion
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    const answer = item.querySelector('.faq-answer-content');

    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other opened items for clean accordion behavior
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const otherAns = other.querySelector('.faq-answer-content');
          if (otherAns) otherAns.style.maxHeight = null;
        }
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 30 + 'px';
      } else {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      }
    });
  });
}

/* --------------------------------------------------------------------------
   6. Floating WhatsApp Widget ("الواتساب الطائر")
   -------------------------------------------------------------------------- */
function initWhatsAppWidget() {
  const fab = document.getElementById('floatingWhatsAppBtn');
  const tooltip = document.getElementById('whatsappTooltip');
  const popup = document.getElementById('whatsappChatPopup');
  const closeBtn = document.getElementById('closeWhatsAppPopup');
  const customInput = document.getElementById('chatCustomInput');
  const sendBtn = document.getElementById('chatSendBtn');
  const presetChips = document.querySelectorAll('.chat-preset-chip');

  const basePhone = '201009426680';

  function openPopup() {
    if (popup) {
      popup.classList.add('active');
      if (tooltip) tooltip.style.display = 'none';
      if (customInput) customInput.focus();
    }
  }

  function closePopup() {
    if (popup) {
      popup.classList.remove('active');
    }
  }

  if (fab) {
    fab.addEventListener('click', () => {
      if (popup.classList.contains('active')) {
        closePopup();
      } else {
        openPopup();
      }
    });
  }

  if (tooltip) {
    tooltip.addEventListener('click', openPopup);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closePopup);
  }

  // Handle Preset Questions Chips
  presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const text = chip.getAttribute('data-msg') || chip.innerText.trim();
      sendToWhatsApp(text);
    });
  });

  // Handle Custom Input
  function handleCustomSend() {
    if (customInput && customInput.value.trim() !== '') {
      const userText = customInput.value.trim();
      sendToWhatsApp(userText);
      customInput.value = '';
    }
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', handleCustomSend);
  }

  if (customInput) {
    customInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleCustomSend();
      }
    });
  }

  function sendToWhatsApp(message) {
    const formatted = `مرحباً Avenue Business Services،\n${message}`;
    const url = `https://wa.me/${basePhone}?text=${encodeURIComponent(formatted)}`;
    window.open(url, '_blank');
  }

  // Dismiss on outside click
  document.addEventListener('click', (e) => {
    if (popup && popup.classList.contains('active')) {
      if (!popup.contains(e.target) && !fab.contains(e.target) && (!tooltip || !tooltip.contains(e.target))) {
        closePopup();
      }
    }
  });
}

/* --------------------------------------------------------------------------
   7. Contact Form Handler (Direct to WhatsApp & Feedback)
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('consultationForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('formName').value.trim();
    const phone = document.getElementById('formPhone').value.trim();
    const service = document.getElementById('formService').value;
    const branch = document.getElementById('formBranch').value;
    const notes = document.getElementById('formNotes').value.trim();

    if (!name || !phone) {
      alert('يرجى كتابة الاسم ورقم الهاتف للتواصل.');
      return;
    }

    const message = 
`*طلب استشارة جديدة من الموقع الإلكتروني - Avenue*
━━━━━━━━━━━━━━━━━
👤 *الاسم:* ${name}
📱 *رقم الهاتف:* ${phone}
🏢 *الخدمة المطلوبة:* ${service}
📍 *الفرع المفضل:* ${branch}
📝 *تفاصيل الاستفسار:*
${notes || 'لا توجد ملاحظات إضافية'}
━━━━━━━━━━━━━━━━━`;

    const whatsappUrl = `https://wa.me/201009426680?text=${encodeURIComponent(message)}`;

    // Show temporary confirmation toast
    showToast('جاري تحويلك إلى واتساب للتواصل المباشر مع المستشار...');

    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      form.reset();
    }, 900);
  });
}

/* --------------------------------------------------------------------------
   8. Business Card Preview Modal
   -------------------------------------------------------------------------- */
function initCardModal() {
  const modal = document.getElementById('businessCardModal');
  const openBtns = document.querySelectorAll('.open-card-modal');
  const closeBtn = document.getElementById('closeCardModal');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}

/* --------------------------------------------------------------------------
   9. Clipboard Helpers (Copy Phone & Email with Toast)
   -------------------------------------------------------------------------- */
function initClipboardButtons() {
  const copyBtns = document.querySelectorAll('[data-copy]');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const val = btn.getAttribute('data-copy');
      if (val) {
        navigator.clipboard.writeText(val).then(() => {
          showToast(`تم نسخ: ${val}`);
        }).catch(() => {
          // Fallback
          showToast(`الرقم: ${val}`);
        });
      }
    });
  });
}

function showToast(text) {
  let toast = document.getElementById('siteToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'siteToast';
    toast.style.position = 'fixed';
    toast.style.bottom = '28px';
    toast.style.right = '28px';
    toast.style.background = '#0e3b64';
    toast.style.color = '#ffffff';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '30px';
    toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
    toast.style.zIndex = '100000';
    toast.style.fontSize = '0.9rem';
    toast.style.fontWeight = '700';
    toast.style.transition = 'all 0.3s ease';
    toast.style.direction = 'rtl';
    document.body.appendChild(toast);
  }

  toast.textContent = text;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
  }, 3200);
}
