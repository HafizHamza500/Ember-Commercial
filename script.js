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

// Phone helpers: formatting and validation for US numbers
function cleanPhoneDigits(value){
  return (value||'').toString().replace(/\D/g,'');
}

function isValidUSPhone(digits){
  if (!digits) return false;
  // allow 10-digit (local) or 11-digit starting with '1' (US with country code)
  if (digits.length === 10) return true;
  if (digits.length === 11 && digits.charAt(0) === '1') return true;
  return false;
}

function formatUSPhone(digits){
  // digits: only numbers, max 11 (leading 1 allowed)
  if (!digits) return '';
  if (digits.length === 11 && digits.charAt(0) === '1'){
    const d = digits.slice(1);
    return '+1 (' + d.slice(0,3) + ') ' + d.slice(3,6) + (d.length>6 ? '-' + d.slice(6,10) : (d.length>3 ? '-' + d.slice(6) : ''));
  }
  const d = digits.slice(0,10);
  if (d.length <= 3) return '(' + d;
  if (d.length <= 6) return '(' + d.slice(0,3) + ') ' + d.slice(3);
  return '(' + d.slice(0,3) + ') ' + d.slice(3,6) + '-' + d.slice(6);
}

const heroForm = document.getElementById("heroForm");
const contactForm = document.getElementById("contactForm");

if (heroForm) {
  heroForm.addEventListener('submit', e => {
    e.preventDefault();
    const phoneInput = e.target.querySelector('input[name="phone"]');
    const digits = cleanPhoneDigits(phoneInput ? phoneInput.value : '');
    if (!isValidUSPhone(digits)){
      if (window.Swal) {
        Swal.fire({icon:'error',title:'Invalid phone',text:'Please enter a valid US phone number (10 digits).'});
      } else {
        alert('Please enter a valid US phone number (10 digits).');
      }
      return;
    }
    // normalize phone field to formatted value before sending
    if (phoneInput) phoneInput.value = formatUSPhone(digits);
    sendEmail(e.target);
  });
}

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const phoneInput = e.target.querySelector('input[name="phone"]');
    const digits = cleanPhoneDigits(phoneInput ? phoneInput.value : '');
    if (!isValidUSPhone(digits)){
      if (window.Swal) {
        Swal.fire({icon:'error',title:'Invalid phone',text:'Please enter a valid US phone number (10 digits).'});
      } else {
        alert('Please enter a valid US phone number (10 digits).');
      }
      return;
    }
    if (phoneInput) phoneInput.value = formatUSPhone(digits);
    sendEmail(e.target);
  });
}

const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileBackdrop = document.getElementById('mobileBackdrop');
const menuIcon = document.getElementById('menuIcon');
if (menuBtn && mobileMenu) {
  const openMenu = () => {
    // ensure element is visible (Tailwind's `hidden` sets display:none)
    mobileMenu.classList.remove('hidden');
    if (mobileBackdrop) mobileBackdrop.classList.remove('hidden');
    // force a reflow so the animation class transition is picked up
    void mobileMenu.offsetWidth;
    mobileMenu.classList.remove('menu-hidden-anim');
    mobileMenu.classList.add('menu-visible');
    if (mobileBackdrop) mobileBackdrop.classList.add('backdrop-visible');
    document.body.classList.add('no-scroll');
    menuBtn.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    if (menuIcon) menuIcon.textContent = '✕';
  };

  const closeMenu = () => {
    // play exit animation then hide elements and restore scroll
    mobileMenu.classList.remove('menu-visible');
    mobileMenu.classList.add('menu-hidden-anim');
    if (mobileBackdrop) mobileBackdrop.classList.remove('backdrop-visible');
    if (menuIcon) menuIcon.textContent = '☰';
    // keep `no-scroll` during exit animation for smooth UX
    const exitDuration = 340; // should match CSS timing
    setTimeout(() => {
      mobileMenu.classList.add('hidden');
      if (mobileBackdrop) mobileBackdrop.classList.add('hidden');
      mobileMenu.classList.remove('menu-hidden-anim');
      document.body.classList.remove('no-scroll');
      menuBtn.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    }, exitDuration);
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
  // allow formatted display but keep digits limited to 11 (allow leading 1)
  input.setAttribute('maxlength', '18');
  input.addEventListener('input', () => {
    let digits = cleanPhoneDigits(input.value);
    if (digits.length > 11) digits = digits.slice(0,11);
    const formatted = formatUSPhone(digits);
    if (input.value !== formatted) input.value = formatted;
  });
  // on blur, ensure formatting is normalized
  input.addEventListener('blur', () => {
    const digits = cleanPhoneDigits(input.value);
    input.value = formatUSPhone(digits);
  });
});