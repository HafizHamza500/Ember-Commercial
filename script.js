emailjs.init("0B5h7tP2Jx7zVJ73o");

function sendEmail(form) {
  emailjs.sendForm(
    "service_f4ozl9o",
    "YOUR_TEMPLATE_ID",
    form
  ).then(() => {
    if (window.Swal) {
      Swal.fire({icon:'success',title:'Message sent',text:'We received your message and will be in touch.'});
    } else {
      alert("Message sent successfully!");
    }
    form.reset();
  }).catch(err => {
    console.error('EmailJS error:', err);
    if (window.Swal) {
      Swal.fire({icon:'error',title:'Send failed',text:'Failed to send message. Please try again later.'});
    } else {
      alert('Failed to send message. Please try again later.');
    }
  });
}

const heroForm = document.getElementById("heroForm");
const contactForm = document.getElementById("contactForm");

if (heroForm) {
  heroForm.addEventListener('submit', e => {
    e.preventDefault();
    sendEmail(e.target);
  });
}

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    sendEmail(e.target);
  });
}

const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileBackdrop = document.getElementById('mobileBackdrop');
const menuIcon = document.getElementById('menuIcon');
if (menuBtn && mobileMenu) {
  const openMenu = () => {
    mobileMenu.classList.remove('hidden');
    if (mobileBackdrop) mobileBackdrop.classList.remove('hidden');
    document.body.classList.add('no-scroll');
    menuBtn.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    if (menuIcon) menuIcon.textContent = '✕';
  };

  const closeMenu = () => {
    mobileMenu.classList.add('hidden');
    if (mobileBackdrop) mobileBackdrop.classList.add('hidden');
    document.body.classList.remove('no-scroll');
    menuBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    if (menuIcon) menuIcon.textContent = '☰';
  };

  menuBtn.addEventListener('click', () => {
    const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
    if (isOpen) closeMenu(); else openMenu();
  });

  // Close menu when a mobile link is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => closeMenu());
  });

  // Click on backdrop closes menu
  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', () => closeMenu());
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

// FAQ: ensure only one details in #faq is open at a time (use click on summary)
const faqSection = document.getElementById('faq');
if (faqSection) {
  faqSection.querySelectorAll('details').forEach(d => d.open = false);
  faqSection.querySelectorAll('summary').forEach(summary => {
    summary.addEventListener('click', (e) => {
      // Prevent default native toggle to control behavior reliably
      e.preventDefault();
      const details = summary.parentElement;
      const isOpen = details.open;
      // Close all
      faqSection.querySelectorAll('details').forEach(other => other.open = false);
      // Toggle clicked
      details.open = !isOpen;
    });
    // keyboard support for Enter/Space
    summary.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        summary.click();
      }
    });
  });
}

// Input sanitization: name fields (no numbers), phone fields (digits only)
document.querySelectorAll('.name-field').forEach(input => {
  input.addEventListener('input', () => {
    const clean = input.value.replace(/[^a-zA-Z\s.'-]/g, '');
    if (input.value !== clean) input.value = clean;
  });
});

document.querySelectorAll('.phone-field').forEach(input => {
  input.addEventListener('input', () => {
    const clean = input.value.replace(/\D/g, '');
    if (input.value !== clean) input.value = clean;
  });
});