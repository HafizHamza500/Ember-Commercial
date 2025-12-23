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

function attachPhoneValidatedSubmit(form) {
  if (!form) return;
  form.addEventListener('submit', e => {
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
    if (typeof sendEmail === 'function') {
      sendEmail(e.target);
    } else {
      // fallback to native submit if no sendEmail handler is present
      form.submit();
    }
  });
}

attachPhoneValidatedSubmit(heroForm);
attachPhoneValidatedSubmit(contactForm);

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


  const testimonials = [
    {
      text: "Ember Commercial approaches real estate with integrity, discipline, and a long-term mindset. Their off-market sourcing is exceptional.",
      name: "Capital Partner",
      role: "Private Investment Firm"
    },
    {
      text: "Their execution is precise, communication is clear, and the entire acquisition process was handled professionally.",
      name: "Property Owner",
      role: "Multifamily Seller"
    },
    {
      text: "Strong relationships, disciplined underwriting, and consistent delivery of quality opportunities.",
      name: "Broker Partner",
      role: "Commercial Brokerage"
    }
  ];

  let current = 0;
  const card = document.getElementById("testimonialCard");
  const textEl = document.getElementById("testimonialText");
  const nameEl = document.getElementById("testimonialName");
  const roleEl = document.getElementById("testimonialRole");

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function renderTestimonial(index) {
    if (!prefersReducedMotion) {
      card.classList.add("opacity-0", "translate-x-6");
    }

    setTimeout(() => {
      textEl.textContent = testimonials[index].text;
      nameEl.textContent = testimonials[index].name;
      roleEl.textContent = testimonials[index].role;

      if (!prefersReducedMotion) {
        card.classList.remove("opacity-0", "translate-x-6");
      }
    }, prefersReducedMotion ? 0 : 300);
  }

  function nextTestimonial() {
    current = (current + 1) % testimonials.length;
    renderTestimonial(current);
  }

  function prevTestimonial() {
    current = (current - 1 + testimonials.length) % testimonials.length;
    renderTestimonial(current);
  }

  // Auto slide every 3 seconds (disabled if reduced motion)
  if (!prefersReducedMotion) {
    setInterval(nextTestimonial, 3000);
  }

  // Initial render
  renderTestimonial(current);

  // Mobile swipe
  let startX = 0;
  card.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  card.addEventListener("touchend", e => {
    const endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) nextTestimonial();
    if (endX - startX > 50) prevTestimonial();
  });

