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
// attach validation to the location form (id `locationForm`) used in the page
const contactForm = document.getElementById("locationForm");

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


  // Mobile menu controls: match IDs used in index.html
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMenuBtn = document.getElementById('closeMenuBtn');

  function openMobileMenu() {
    if (!mobileMenu) return;
    // remove hidden so element is rendered, then add menu-open to trigger transition
    mobileMenu.classList.remove('hidden');
    mobileMenu.setAttribute('aria-hidden', 'false');
    // allow next frame for transition
    requestAnimationFrame(() => mobileMenu.classList.add('menu-open'));
    if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'true');
    // lock background scroll but allow the menu itself to scroll
    document.body.classList.add('overflow-hidden');
    document.documentElement.classList.add('no-scroll');
  }

  function closeMobileMenu() {
    if (!mobileMenu) return;
    // start transition
    mobileMenu.classList.remove('menu-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
    // restore scrolling
    document.body.classList.remove('overflow-hidden');
    document.documentElement.classList.remove('no-scroll');
    // after transition ends, hide with `hidden` to remove from flow
    const removeHidden = () => {
      mobileMenu.classList.add('hidden');
      mobileMenu.removeEventListener('transitionend', removeHidden);
    };
    // fallback timeout in case transitionend doesn't fire
    mobileMenu.addEventListener('transitionend', removeHidden);
    setTimeout(removeHidden, 300);
  }

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', openMobileMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMobileMenu);

    // Close when any link inside the menu is clicked
    mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobileMenu));

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobileMenu();
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
      text: "Ember Commercial has access to deals that simply don’t circulate publicly. Their sourcing and underwriting process is disciplined, transparent, and thorough. Every opportunity we reviewed was well-vetted and professionally presented.",
      name: "David Harrington",
      role: "Commercial Real Estate Investor"
    },
    {
      text: "From initial discussions through closing, Ember Commercial handled the transaction with precision. Their team managed negotiations, due diligence, and execution efficiently, making the entire process straightforward and reliable.",
      name: "Laura Mitchell",
      role: "Managing Partner, Private Investment Group"
    },
    {
      text: "Ember Commercial understands the importance of discretion in off-market transactions. Their relationship driven approach and strong underwriting gave us confidence at every stage of the acquisition.",
      name: "Andrew Collins",
      role: "Principal, Commercial Asset Holdings"
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

