// ===== MOBILE MENU =====
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenuBtn = document.getElementById('closeMenuBtn');

function openMobileMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.remove('hidden');
  mobileMenu.setAttribute('aria-hidden', 'false');
  requestAnimationFrame(() => mobileMenu.classList.add('menu-open'));
  if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'true');
  document.body.classList.add('overflow-hidden');
  document.documentElement.classList.add('no-scroll');
}

function closeMobileMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.remove('menu-open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('overflow-hidden');
  document.documentElement.classList.remove('no-scroll');

  const removeHidden = () => {
    mobileMenu.classList.add('hidden');
    mobileMenu.removeEventListener('transitionend', removeHidden);
  };
  mobileMenu.addEventListener('transitionend', removeHidden);
  setTimeout(removeHidden, 300);
}

if (mobileMenuBtn && mobileMenu && !mobileMenu.dataset.menuListenersAttached) {
  mobileMenuBtn.addEventListener('click', openMobileMenu);
  if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMobileMenu);
  mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobileMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileMenu(); });
  mobileMenu.dataset.menuListenersAttached = 'true';
}

// ===== INPUT SANITIZATION =====
const nameInputs = Array.from(document.querySelectorAll('input[name="fullName"], .name-field'));
nameInputs.forEach(input => {
  if (input.dataset.nameSanitizeAttached) return;
  input.dataset.nameSanitizeAttached = 'true';
  input.addEventListener('input', () => {
    input.value = input.value.replace(/[^a-zA-Z\s.'-]/g, '');
  });
});

const phoneInputs = Array.from(document.querySelectorAll('input[name="phone"], .phone-field'));
phoneInputs.forEach(input => {
  if (input.dataset.phoneSanitizeAttached) return;
  input.dataset.phoneSanitizeAttached = 'true';
  input.setAttribute('maxlength', '14');

  const formatDigits = digits => {
    if (!digits) return '';
    digits = digits.slice(0,10);
    if (digits.length > 6) return '(' + digits.slice(0,3) + ') ' + digits.slice(3,6) + '-' + digits.slice(6);
    if (digits.length > 3) return '(' + digits.slice(0,3) + ') ' + digits.slice(3);
    return '(' + digits;
  };

  input.addEventListener('input', () => {
    let digits = input.value.replace(/\D/g, '');
    input.value = digits ? formatDigits(digits) : '';
  });

  input.addEventListener('blur', () => {
    const digits = input.value.replace(/\D/g, '').slice(0,10);
    input.value = digits.length === 10 ? formatDigits(digits) : digits;
  });
});

// ===== TESTIMONIALS =====
const testimonials = [
  { text: "Ember Commercial has access to deals that simply don’t circulate publicly. Their sourcing and underwriting process is disciplined, transparent, and thorough. Every opportunity we reviewed was well-vetted and professionally presented.", name: "David Harrington", role: "Commercial Real Estate Investor" },
  { text: "From initial discussions through closing, Ember Commercial handled the transaction with precision. Their team managed negotiations, due diligence, and execution efficiently, making the entire process straightforward and reliable.", name: "Laura Mitchell", role: "Managing Partner, Private Investment Group" },
  { text: "Ember Commercial understands the importance of discretion in off-market transactions. Their relationship driven approach and strong underwriting gave us confidence at every stage of the acquisition.", name: "Andrew Collins", role: "Principal, Commercial Asset Holdings" }
];

let current = 0;
const card = document.getElementById("testimonialCard");
const textEl = document.getElementById("testimonialText");
const nameEl = document.getElementById("testimonialName");
const roleEl = document.getElementById("testimonialRole");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function renderTestimonial(index) {
  if (!prefersReducedMotion) card.classList.add("opacity-0", "translate-x-6");
  setTimeout(() => {
    textEl.textContent = testimonials[index].text;
    nameEl.textContent = testimonials[index].name;
    roleEl.textContent = testimonials[index].role;
    if (!prefersReducedMotion) card.classList.remove("opacity-0", "translate-x-6");
  }, prefersReducedMotion ? 0 : 300);
}

function nextTestimonial() { current = (current + 1) % testimonials.length; renderTestimonial(current); }
function prevTestimonial() { current = (current - 1 + testimonials.length) % testimonials.length; renderTestimonial(current); }

if (!prefersReducedMotion && !window.__emberTestimonialIntervalSet) {
  setInterval(nextTestimonial, 3000);
  window.__emberTestimonialIntervalSet = true;
}
renderTestimonial(current);

let startX = 0;
card.addEventListener("touchstart", e => { startX = e.touches[0].clientX; });
card.addEventListener("touchend", e => {
  const endX = e.changedTouches[0].clientX;
  if (startX - endX > 50) nextTestimonial();
  if (endX - startX > 50) prevTestimonial();
});

// ================= FORM SUBMIT HANDLER =================
document.querySelectorAll('.inquiryForm').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    sendEmail(form);
  });
});

// ================= NAME SANITIZATION =================
document.querySelectorAll('.name-field').forEach(input => {
  input.addEventListener('input', () => {
    input.value = input.value.replace(/[^a-zA-Z\s.'-]/g, '');
  });
});

// ================= PHONE FORMAT =================
document.querySelectorAll('.phone-field').forEach(input => {
  input.setAttribute('maxlength', '14');

  const formatPhone = digits => {
    if (digits.length > 6)
      return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6,10)}`;
    if (digits.length > 3)
      return `(${digits.slice(0,3)}) ${digits.slice(3)}`;
    return digits ? `(${digits}` : '';
  };

  input.addEventListener('input', () => {
    let digits = input.value.replace(/\D/g, '').slice(0, 10);
    input.value = formatPhone(digits);
  });

  input.addEventListener('blur', () => {
    let digits = input.value.replace(/\D/g, '');
    input.value = digits.length === 10 ? formatPhone(digits) : digits;
  });
});

// ================= SEND EMAIL =================
async function sendEmail(form) {
  if (form.dataset.sending === 'true') return;
  form.dataset.sending = 'true';

  // ===== BUTTON LOADER =====
  const submitBtn = form.querySelector("button[type='submit']");
  const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Sending...';
  }

  const get = name => form.querySelector(`[name="${name}"]`);
  
  const phoneDigits = get('phone').value.replace(/\D/g, '');
  if (phoneDigits.length !== 10) {
    Swal.fire({
      title: "Invalid Phone",
      text: "Please enter a valid 10-digit phone number.",
      icon: "warning",
      confirmButtonColor: "#ae2535"
    });
    form.dataset.sending = 'false';
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
    return;
  }

  get('phone').value = `(${phoneDigits.slice(0,3)}) ${phoneDigits.slice(3,6)}-${phoneDigits.slice(6)}`;

  const data = {
    fullName: get('fullName').value.trim(),
    email: get('email').value.trim(),
    phone: get('phone').value.trim(),
    address: get('address') ? get('address').value.trim() : '',
    message: get('message').value.trim()
  };

  try {
    const res = await fetch(
      "https://script.google.com/macros/s/AKfycbztJOjMpZHF8cUXOzr4GmPRxbFTN0K1E1P2P1BIMJ0Qez9hCSEhGAy7QjZRErZiafsLgA/exec",
      {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(data)
      }
    );

    const result = await res.json();

    if (result.status === "success") {
      const userName = data.fullName.split(' ')[0] || 'there';
      Swal.fire({
        title: `Thank you, ${userName}!`,
        html: `
          <p style="font-size:15px;">
            We’ve received your message <br>
            Our team will contact you shortly.
          </p>
<p style="margin-top:18px;font-weight:bold;font-size:1.1rem;color:#000;">
              – Ember Commercial Team
            </p>
        `,
        icon: "success",
        confirmButtonText: "Close",
        confirmButtonColor: "#ae2535"
      });
      form.reset();
    } else {
      throw new Error("Submission failed");
    }
  } catch (err) {
    Swal.fire({
      title: "Error",
      text: err.message,
      icon: "error",
      confirmButtonColor: "#ae2535"
    });
  } finally {
    form.dataset.sending = 'false';
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  }
}
