/* ══════════════════════════════════════════════════════════════
   NeuArc WhatsApp Float Widget  —  with OTP lead capture
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var API_BASE = 'https://admin.neuarcaiacademy.com';

  var PHONES = [
    { number: '+91 90711 19371', wa: '919071119371', label: 'Primary Line'   },
    { number: '+91 90711 19372', wa: '919071119372', label: 'Secondary Line' },
  ];

  var MSG_TEMPLATE =
    'Hi NeuArc AI Academy! I\'m interested in learning more about your courses and ' +
    'programs. Could you please provide some information on upcoming batches? ' +
    'Looking forward to hearing from you!';

  /* ── SVGs ── */
  var WA_SVG =
    '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15' +
      '-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475' +
      '-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52' +
      '.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207' +
      '-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372' +
      '-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2' +
      ' 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118' +
      '.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347' +
      'm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374' +
      'a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898' +
      'a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884' +
      'm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892' +
      'c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005' +
      'c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>' +
    '</svg>';

  var PHONE_SVG =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
    ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07' +
      'A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3' +
      'a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91' +
      'a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.9.372 1.85.62 2.81.7' +
      'A2 2 0 0122 14.9v2z"/>' +
    '</svg>';

  /* ── State ── */
  var pendingWa  = null;
  var otpStep    = 'idle'; // idle | form | otp_sent | submitting
  var capturedPhone = '';
  var capturedToken = '';

  /* ── Build main widget ── */
  function build() {
    var widget = document.createElement('div');
    widget.className = 'wa-widget';
    widget.id = 'waWidget';

    var linksHtml = PHONES.map(function (p) {
      return '<a href="#" class="wa-num-link" data-wa="' + p.wa + '">' +
        PHONE_SVG +
        '<span>' + p.number + '<span class="wa-num-label">' + p.label + '</span></span>' +
      '</a>';
    }).join('');

    widget.innerHTML =
      '<div class="wa-popup" id="waPopup" role="dialog" aria-label="WhatsApp contact">' +
        '<div class="wa-popup-header">' +
          WA_SVG.replace('28', '18').replace('28', '18') + ' Chat on WhatsApp' +
        '</div>' +
        '<div class="wa-popup-body">' + linksHtml + '</div>' +
      '</div>' +
      '<button class="wa-btn" id="waBtn" aria-label="Chat on WhatsApp" aria-expanded="false">' +
        WA_SVG +
      '</button>';

    document.body.appendChild(widget);

    /* OTP overlay */
    var overlay = document.createElement('div');
    overlay.className = 'wa-otp-overlay';
    overlay.id = 'waOtpOverlay';
    overlay.innerHTML = buildOverlayHtml('form');
    document.body.appendChild(overlay);

    /* Toggle popup */
    var btn   = widget.querySelector('#waBtn');
    var popup = widget.querySelector('#waPopup');

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = popup.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('#waWidget')) {
        popup.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    /* Number link click → show OTP capture */
    widget.querySelectorAll('.wa-num-link').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        pendingWa = link.getAttribute('data-wa');
        popup.classList.remove('open');
        openOtpOverlay('form');
      });
    });
  }

  function buildOverlayHtml(mode) {
    if (mode === 'form') {
      return '<div class="wa-otp-modal">' +
        '<p class="wa-otp-title">' + WA_SVG.replace('28', '20').replace('28', '20') + ' Quick details first</p>' +
        '<p class="wa-otp-sub">We\'ll log your enquiry and connect you instantly on WhatsApp.</p>' +
        '<div class="wa-otp-field"><label>Your Name <span style="color:#f87171">*</span></label><input type="text" id="waName" placeholder="Full name" /></div>' +
        '<div class="wa-otp-field"><label>Mobile Number <span style="color:#f87171">*</span></label><input type="tel" id="waPhone" placeholder="10-digit mobile" maxlength="10" inputmode="numeric" /></div>' +
        '<div class="wa-otp-field"><label>Email <span style="color:var(--text-3);font-weight:400">(optional)</span></label><input type="email" id="waEmail" placeholder="you@example.com" /></div>' +
        '<p class="wa-otp-err" id="waOtpErr"></p>' +
        '<div class="wa-otp-btns">' +
          '<button type="button" class="wa-otp-btn-cancel" id="waOtpCancel">Cancel</button>' +
          '<button type="button" class="wa-otp-btn-primary" id="waOtpSend">Send OTP &rarr;</button>' +
        '</div>' +
      '</div>';
    }
    if (mode === 'otp') {
      var masked = capturedPhone.slice(0,2) + '****' + capturedPhone.slice(-2);
      return '<div class="wa-otp-modal">' +
        '<p class="wa-otp-title">Verify Your Phone</p>' +
        '<p class="wa-otp-sub">Enter the 6-digit OTP sent to +91 ' + masked + '</p>' +
        '<div class="wa-otp-field"><label>OTP</label><input type="text" id="waOtpCode" inputmode="numeric" maxlength="6" placeholder="_ _ _ _ _ _" autocomplete="one-time-code" style="letter-spacing:0.2em;font-family:monospace" /></div>' +
        '<p class="wa-otp-err" id="waOtpErr"></p>' +
        '<div class="wa-otp-btns">' +
          '<button type="button" class="wa-otp-btn-cancel" id="waOtpCancel">Back</button>' +
          '<button type="button" class="wa-otp-btn-primary" id="waOtpVerify">Verify &amp; Connect</button>' +
        '</div>' +
        '<button type="button" id="waOtpResend" style="margin-top:10px;background:none;border:none;color:var(--text-3);font-size:0.78rem;cursor:pointer;text-decoration:underline" disabled>Resend OTP <span id="waCountdown">(60s)</span></button>' +
      '</div>';
    }
    return '';
  }

  function openOtpOverlay(mode) {
    var overlay = document.getElementById('waOtpOverlay');
    overlay.innerHTML = buildOverlayHtml(mode);
    overlay.classList.add('open');
    wireOverlay(mode);
  }

  function closeOtpOverlay() {
    var overlay = document.getElementById('waOtpOverlay');
    overlay.classList.remove('open');
    otpStep = 'idle';
  }

  function showErr(msg) {
    var el = document.getElementById('waOtpErr');
    if (el) { el.textContent = msg; el.style.display = 'block'; }
  }

  function wireOverlay(mode) {
    var overlay = document.getElementById('waOtpOverlay');

    overlay.querySelector('#waOtpCancel').addEventListener('click', function () {
      if (mode === 'otp') { openOtpOverlay('form'); }
      else { closeOtpOverlay(); }
    });

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeOtpOverlay();
    });

    if (mode === 'form') {
      var sendBtn = overlay.querySelector('#waOtpSend');
      sendBtn.addEventListener('click', function () {
        var name  = (overlay.querySelector('#waName').value  || '').trim();
        var phone = (overlay.querySelector('#waPhone').value || '').replace(/[^0-9]/g, '');
        var email = (overlay.querySelector('#waEmail').value || '').trim();

        if (!name)  { showErr('Please enter your name.'); return; }
        if (!/^\d{10}$/.test(phone)) { showErr('Enter a valid 10-digit mobile number.'); return; }

        sendBtn.disabled = true;
        sendBtn.textContent = 'Sending…';

        window._waLeadData = { name: name, phone: phone, email: email };

        var otpFn = (typeof NeuArcOTP !== 'undefined') ? NeuArcOTP.sendOtp : null;
        if (!otpFn) {
          /* Fallback: open WA directly without OTP */
          openWa();
          closeOtpOverlay();
          return;
        }

        capturedPhone = phone;
        otpFn(phone, 'whatsapp', function (err) {
          if (err) { sendBtn.disabled = false; sendBtn.textContent = 'Send OTP →'; showErr(err); return; }
          openOtpOverlay('otp');
          startCountdown();
        });
      });
    }

    if (mode === 'otp') {
      var verifyBtn = overlay.querySelector('#waOtpVerify');
      verifyBtn.addEventListener('click', function () {
        var code = (overlay.querySelector('#waOtpCode').value || '').replace(/\s/g, '');
        if (code.length !== 6) { showErr('Enter the 6-digit OTP.'); return; }

        verifyBtn.disabled = true;
        verifyBtn.textContent = 'Verifying…';

        NeuArcOTP.verifyOtp(capturedPhone, code, function (err, token) {
          if (err) { verifyBtn.disabled = false; verifyBtn.textContent = 'Verify & Connect'; showErr(err); return; }

          capturedToken = token;
          /* Submit lead then open WA */
          var d = window._waLeadData || {};
          fetch(API_BASE + '/api/public/wa-lead', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ full_name: d.name, phone: capturedPhone, email: d.email || '', phone_token: capturedToken }),
          })
          .catch(function () {}) // non-blocking
          .finally(function () {
            closeOtpOverlay();
            openWa();
          });
        });
      });

      var resendBtn = overlay.querySelector('#waOtpResend');
      if (resendBtn) {
        resendBtn.addEventListener('click', function () {
          resendBtn.disabled = true;
          NeuArcOTP.sendOtp(capturedPhone, 'whatsapp', function (err) {
            if (err) { showErr(err); resendBtn.disabled = false; return; }
            startCountdown();
          });
        });
      }
    }
  }

  function startCountdown() {
    var secs = 60;
    var cdEl = document.getElementById('waCountdown');
    var rbtn = document.getElementById('waOtpResend');
    if (!rbtn) return;
    rbtn.disabled = true;
    var t = setInterval(function () {
      secs--;
      if (!document.getElementById('waCountdown')) { clearInterval(t); return; }
      if (secs <= 0) {
        clearInterval(t);
        if (rbtn) rbtn.disabled = false;
        if (cdEl) cdEl.textContent = '';
      } else {
        if (cdEl) cdEl.textContent = '(' + secs + 's)';
      }
    }, 1000);
  }

  function openWa() {
    if (!pendingWa) return;
    var url = 'https://wa.me/' + pendingWa + '?text=' + encodeURIComponent(MSG_TEMPLATE);
    window.open(url, '_blank', 'noopener');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
