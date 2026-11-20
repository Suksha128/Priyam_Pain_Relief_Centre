/* ==========================================================================
   Priyam Pain Relief Centre - Interactive Logic & WhatsApp Booking
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking any nav link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // Appointment Modal Logic
  const modalOverlay = document.getElementById('appointmentModalOverlay');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const appointmentForm = document.getElementById('appointmentForm');
  const bookBtns = document.querySelectorAll('.open-booking-modal');
  const serviceSelect = document.getElementById('modalServiceSelect');

  const openModal = (defaultService = '') => {
    if (serviceSelect && defaultService) {
      serviceSelect.value = defaultService;
    }
    if (modalOverlay) {
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  bookBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.getAttribute('data-service') || '';
      openModal(service);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // Handle Form Submission -> WhatsApp pre-filled message
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('patientName').value.trim();
      const phone = document.getElementById('patientPhone').value.trim();
      const service = document.getElementById('modalServiceSelect').value;
      const date = document.getElementById('appointmentDate').value;
      const timeSlot = document.getElementById('appointmentTime').value;
      const notes = document.getElementById('patientNotes').value.trim();

      const clinicPhone = '919344421464';
      let message = `*New Appointment Request - Priyam Pain Relief Centre*\n\n` +
                    `*Patient Name:* ${name}\n` +
                    `*Contact Number:* ${phone}\n` +
                    `*Requested Service:* ${service}\n` +
                    `*Preferred Date:* ${date || 'Flexible'}\n` +
                    `*Preferred Time Slot:* ${timeSlot}\n`;

      if (notes) {
        message += `*Health Concern/Notes:* ${notes}\n`;
      }

      message += `\n_Submitted via Priyam Pain Relief Centre Official Website_`;

      const whatsappUrl = `https://wa.me/${clinicPhone}?text=${encodeURIComponent(message)}`;
      
      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');
      
      // Reset & close modal
      appointmentForm.reset();
      closeModal();
    });
  }

  // Interactive Ailment Search & Filter
  const ailmentSearchInput = document.getElementById('ailmentSearchInput');
  const ailmentCards = document.querySelectorAll('.ailment-card');
  const filterChips = document.querySelectorAll('.filter-chip');

  let currentCategory = 'all';

  const filterAilments = () => {
    const searchTerm = ailmentSearchInput ? ailmentSearchInput.value.toLowerCase().trim() : '';

    ailmentCards.forEach(card => {
      const title = card.querySelector('h4').textContent.toLowerCase();
      const text = card.querySelector('p').textContent.toLowerCase();
      const cardCategory = card.getAttribute('data-category') || 'all';

      const matchesSearch = title.includes(searchTerm) || text.includes(searchTerm);
      const matchesCategory = currentCategory === 'all' || cardCategory.includes(currentCategory);

      if (matchesSearch && matchesCategory) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  };

  if (ailmentSearchInput) {
    ailmentSearchInput.addEventListener('input', filterAilments);
  }

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentCategory = chip.getAttribute('data-filter');
      filterAilments();
    });
  });

  // Set minimum date for appointment booking to today
  const appointmentDateInput = document.getElementById('appointmentDate');
  if (appointmentDateInput) {
    const today = new Date().toISOString().split('T')[0];
    appointmentDateInput.setAttribute('min', today);
  }
});
