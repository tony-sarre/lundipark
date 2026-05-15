// ════════════════════════════════════════════════════════════════
//  TESTIMONIAL SUBMISSION WIDGET
//  Injects a "Leave a testimonial" button + modal into the public site
//  Works with the existing Kind Words section
// ════════════════════════════════════════════════════════════════

(function() {
  'use strict';

  // ─── Inject CSS for modal ───
  const styles = `
    .leave-review-btn {
      display: inline-block;
      margin-top: 28px;
      font-family: 'Cormorant Garamond', serif;
      font-size: 13px;
      letter-spacing: .25em;
      text-transform: uppercase;
      color: var(--pine, #4A5D4A);
      text-decoration: none;
      padding: 12px 28px;
      border: 1px solid var(--pine, #4A5D4A);
      border-radius: 999px;
      cursor: pointer;
      background: transparent;
      transition: all .3s;
    }
    .leave-review-btn:hover {
      background: var(--pine, #4A5D4A);
      color: white;
    }

    .review-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      padding: 20px;
      animation: fadeIn .25s ease;
    }
    .review-modal-overlay.open { display: flex; }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    .review-modal {
      background: #FBFCFA;
      max-width: 540px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      padding: 48px 44px;
      position: relative;
      animation: slideUp .35s cubic-bezier(.2,.8,.2,1);
    }
    @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

    .review-modal-close {
      position: absolute;
      top: 18px; right: 22px;
      background: none; border: none;
      font-size: 28px; line-height: 1;
      color: #6B6B6B;
      cursor: pointer;
      transition: color .2s;
    }
    .review-modal-close:hover { color: #1A1A1A; }

    .review-modal h2 {
      font-family: 'Cormorant Garamond', serif;
      font-weight: 400;
      font-size: 32px;
      color: #4A5D4A;
      margin-bottom: 8px;
    }
    .review-modal .modal-subtitle {
      font-family: 'Cormorant Garamond', serif;
      font-style: italic;
      color: #6B6B6B;
      margin-bottom: 28px;
      font-size: 15px;
    }

    .review-form { display: flex; flex-direction: column; gap: 20px; }
    .review-form .field { display: flex; flex-direction: column; gap: 6px; }
    .review-form label {
      font-family: 'Cormorant Garamond', serif;
      font-size: 14px;
      color: #1A1A1A;
    }
    .review-form .req { color: #4A5D4A; }
    .review-form input,
    .review-form select,
    .review-form textarea {
      background: transparent;
      border: none;
      border-bottom: 1px solid #E2E5E0;
      padding: 8px 0;
      font-family: 'Cormorant Garamond', serif;
      font-size: 16px;
      color: #1A1A1A;
      outline: none;
      transition: border-color .25s;
      resize: vertical;
      appearance: none;
    }
    .review-form input::placeholder,
    .review-form textarea::placeholder { color: #B0B0B0; font-style: italic; }
    .review-form input:focus,
    .review-form select:focus,
    .review-form textarea:focus { border-bottom-color: #4A5D4A; }

    .review-rating {
      display: flex; gap: 8px;
      align-items: center;
      padding: 8px 0;
    }
    .review-star {
      font-size: 32px;
      color: #E2E5E0;
      cursor: pointer;
      transition: all .15s;
      user-select: none;
    }
    .review-star.filled,
    .review-star:hover,
    .review-star:hover ~ .review-star.was-filled { color: #C48942; }
    .review-rating:hover .review-star { color: #E2E5E0; }
    .review-rating .review-star:hover,
    .review-rating .review-star:hover ~ .review-star { color: #E2E5E0; }
    .review-rating[data-hover="1"] .review-star:nth-child(-n+1),
    .review-rating[data-hover="2"] .review-star:nth-child(-n+2),
    .review-rating[data-hover="3"] .review-star:nth-child(-n+3),
    .review-rating[data-hover="4"] .review-star:nth-child(-n+4),
    .review-rating[data-hover="5"] .review-star:nth-child(-n+5) { color: #C48942; }

    .review-counter {
      font-size: 11px;
      color: #6B6B6B;
      text-align: right;
      margin-top: 4px;
      letter-spacing: .1em;
    }
    .review-counter.warn { color: #C48942; }

    .review-submit {
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: .3em;
      text-transform: uppercase;
      padding: 14px 36px;
      background: #4A5D4A;
      color: white;
      border: none;
      border-radius: 999px;
      cursor: pointer;
      margin-top: 12px;
      transition: background .25s;
    }
    .review-submit:hover { background: #3A4A3A; }
    .review-submit:disabled { opacity: .6; cursor: not-allowed; }

    .review-success {
      display: none;
      text-align: center;
      padding: 20px 0;
    }
    .review-success.show { display: block; }
    .review-success h3 {
      font-family: 'Cormorant Garamond', serif;
      font-size: 24px;
      color: #4A5D4A;
      margin-bottom: 12px;
    }
    .review-success p {
      color: #6B6B6B;
      font-family: 'Cormorant Garamond', serif;
      font-style: italic;
      font-size: 16px;
    }
    .review-error {
      color: #B84444;
      font-size: 13px;
      font-style: italic;
      margin-top: 10px;
    }

    @media (max-width: 600px) {
      .review-modal { padding: 32px 24px; }
      .review-modal h2 { font-size: 26px; }
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  // ─── Inject "Leave a testimonial" button into Kind Words section ───
  function injectButton() {
    const kwContent = document.querySelector('.kw-content');
    if (!kwContent) {
      // Retry once DOM ready
      setTimeout(injectButton, 500);
      return;
    }

    // Don't double-inject
    if (kwContent.querySelector('.leave-review-btn')) return;

    const btn = document.createElement('button');
    btn.className = 'leave-review-btn';
    btn.textContent = 'Leave a Testimonial';
    btn.setAttribute('data-i18n', 'leave_review_btn');
    btn.onclick = openModal;
    kwContent.appendChild(btn);

    // Update with translation if I18N is available
    if (typeof I18N !== 'undefined') {
      I18N.leave_review_btn = { en: 'Leave a Testimonial', fr: 'Laisser un témoignage' };
      I18N.review_modal_title = { en: 'Share Your Experience', fr: 'Partagez votre expérience' };
      I18N.review_modal_subtitle = {
        en: 'Your story helps others find their photographer. Reviews are moderated before publication.',
        fr: 'Votre récit aide les autres à trouver leur photographe. Les avis sont modérés avant publication.'
      };
      I18N.review_field_name = { en: 'Your name', fr: 'Votre nom' };
      I18N.review_field_session = { en: 'Type of session', fr: 'Type de séance' };
      I18N.review_field_rating = { en: 'Your rating', fr: 'Votre note' };
      I18N.review_field_text = { en: 'Your testimonial', fr: 'Votre témoignage' };
      I18N.review_ph_text = {
        en: 'Tell us about your experience with Lundipark...',
        fr: 'Parlez-nous de votre expérience avec Lundipark…'
      };
      I18N.review_submit = { en: 'Submit', fr: 'Envoyer' };
      I18N.review_success_title = { en: 'Thank you!', fr: 'Merci !' };
      I18N.review_success_text = {
        en: "Your testimonial has been received. We'll review it before publishing.",
        fr: 'Votre témoignage a été reçu. Nous le relirons avant publication.'
      };

      // Re-apply current language
      if (typeof setLang === 'function') {
        const currentLang = document.documentElement.lang || 'en';
        setLang(currentLang);
      }
    }
  }

  // ─── Build modal HTML ───
  const modalHTML = `
    <div id="reviewModalOverlay" class="review-modal-overlay">
      <div class="review-modal">
        <button class="review-modal-close" onclick="closeReviewModal()">×</button>

        <div id="reviewFormBlock">
          <h2 data-i18n="review_modal_title">Share Your Experience</h2>
          <p class="modal-subtitle" data-i18n="review_modal_subtitle">Your story helps others find their photographer. Reviews are moderated before publication.</p>

          <form class="review-form" id="reviewForm" onsubmit="event.preventDefault(); submitReview();">
            <div class="field">
              <label data-i18n="review_field_name">Your name <span class="req">*</span></label>
              <input type="text" id="revName" placeholder="Jane Doe" required maxlength="100">
            </div>

            <div class="field">
              <label data-i18n="review_field_session">Type of session <span class="req">*</span></label>
              <select id="revSession" required>
                <option value="" disabled selected>—</option>
                <option value="wedding">Wedding / Mariage</option>
                <option value="engagement">Engagement / Fiançailles</option>
                <option value="couples">Couples</option>
                <option value="family">Family / Famille</option>
                <option value="maternity">Maternity / Maternité</option>
                <option value="newborn">Newborn / Nouveau-né</option>
                <option value="portrait">Portrait / Branding</option>
                <option value="lifestyle">Lifestyle</option>
              </select>
            </div>

            <div class="field">
              <label data-i18n="review_field_rating">Your rating <span class="req">*</span></label>
              <div class="review-rating" id="revRating" data-rating="0">
                <span class="review-star" data-value="1">★</span>
                <span class="review-star" data-value="2">★</span>
                <span class="review-star" data-value="3">★</span>
                <span class="review-star" data-value="4">★</span>
                <span class="review-star" data-value="5">★</span>
              </div>
            </div>

            <div class="field">
              <label data-i18n="review_field_text">Your testimonial <span class="req">*</span></label>
              <textarea id="revText" rows="5" placeholder="Tell us about your experience with Lundipark..." data-i18n-ph="review_ph_text" required minlength="20" maxlength="1000"></textarea>
              <p class="review-counter" id="revCounter">0 / 1000</p>
            </div>

            <button type="submit" class="review-submit" id="revSubmit" data-i18n="review_submit">Submit</button>
            <p id="revError" class="review-error" style="display:none;"></p>
          </form>
        </div>

        <div id="reviewSuccess" class="review-success">
          <h3 data-i18n="review_success_title">Thank you!</h3>
          <p data-i18n="review_success_text">Your testimonial has been received. We'll review it before publishing.</p>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // ─── Rating stars logic ───
  const ratingEl = document.getElementById('revRating');
  let currentRating = 0;

  ratingEl.querySelectorAll('.review-star').forEach(star => {
    star.addEventListener('click', () => {
      currentRating = parseInt(star.dataset.value);
      ratingEl.dataset.rating = currentRating;
      updateStars();
    });
    star.addEventListener('mouseenter', () => {
      ratingEl.dataset.hover = star.dataset.value;
    });
  });
  ratingEl.addEventListener('mouseleave', () => {
    ratingEl.removeAttribute('data-hover');
  });

  function updateStars() {
    ratingEl.querySelectorAll('.review-star').forEach((s, i) => {
      s.classList.toggle('filled', i < currentRating);
      s.classList.toggle('was-filled', i < currentRating);
    });
  }

  // ─── Character counter ───
  const textEl = document.getElementById('revText');
  const counterEl = document.getElementById('revCounter');
  textEl.addEventListener('input', () => {
    const len = textEl.value.length;
    counterEl.textContent = `${len} / 1000`;
    counterEl.classList.toggle('warn', len > 900);
  });

  // ─── Open/close modal ───
  window.openModal = function() {
    document.getElementById('reviewModalOverlay').classList.add('open');
    document.getElementById('reviewFormBlock').style.display = 'block';
    document.getElementById('reviewSuccess').classList.remove('show');
    document.getElementById('revError').style.display = 'none';
  };

  window.closeReviewModal = function() {
    document.getElementById('reviewModalOverlay').classList.remove('open');
  };

  // Click outside to close
  document.getElementById('reviewModalOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'reviewModalOverlay') closeReviewModal();
  });

  // ─── Submit review ───
  window.submitReview = async function() {
    const submitBtn = document.getElementById('revSubmit');
    const errEl = document.getElementById('revError');
    errEl.style.display = 'none';

    const name = document.getElementById('revName').value.trim();
    const session_type = document.getElementById('revSession').value;
    const text = document.getElementById('revText').value.trim();
    const language = document.documentElement.lang || 'en';

    if (currentRating === 0) {
      errEl.textContent = language === 'fr' ? 'Veuillez sélectionner une note' : 'Please select a rating';
      errEl.style.display = 'block';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = language === 'fr' ? 'Envoi…' : 'Sending...';

    // Check if Supabase is available
    if (typeof submitTestimonial !== 'function') {
      errEl.textContent = language === 'fr'
        ? 'Configuration manquante. Contactez l\'administrateur.'
        : 'Configuration missing. Contact the administrator.';
      errEl.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = language === 'fr' ? 'Envoyer' : 'Submit';
      return;
    }

    const result = await submitTestimonial({
      name, session_type, rating: currentRating, text, language
    });

    if (result.success) {
      document.getElementById('reviewFormBlock').style.display = 'none';
      document.getElementById('reviewSuccess').classList.add('show');
      // Auto close after 4s
      setTimeout(() => {
        closeReviewModal();
        // Reset form
        document.getElementById('reviewForm').reset();
        currentRating = 0;
        updateStars();
      }, 4000);
    } else {
      errEl.textContent = result.error || 'An error occurred';
      errEl.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = language === 'fr' ? 'Envoyer' : 'Submit';
    }
  };

  // ─── Init ───
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectButton);
  } else {
    injectButton();
  }
})();
