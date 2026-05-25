/* ══════════════════════════════════════════════════════════════
   NeuArc Phone OTP Module
   Shared across: apply form, chatbot, WhatsApp widget
   ══════════════════════════════════════════════════════════════ */
var NeuArcOTP = (function () {
  'use strict';

  var API_BASE = 'https://admin.neuarcaiacademy.com';

  function cleanPhone(phone) {
    return phone.replace(/[^0-9]/g, '').replace(/^91/, '');
  }

  function isValidPhone(phone) {
    return /^\d{10}$/.test(cleanPhone(phone));
  }

  /* sendOtp(phone, purpose, cb)
     cb(null, maskedPhone) on success
     cb(errorMessage)      on failure */
  function sendOtp(phone, purpose, cb) {
    var cleaned = cleanPhone(phone);
    fetch(API_BASE + '/api/public/otp/send', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ phone: cleaned, purpose: purpose || 'apply' }),
    })
    .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
    .then(function (x) {
      if (!x.ok) { cb(x.d.error || 'Failed to send OTP.'); return; }
      cb(null, x.d.masked);
    })
    .catch(function () { cb('Network error. Please check your connection.'); });
  }

  /* verifyOtp(phone, otp, cb)
     cb(null, token) on success
     cb(errorMessage) on failure */
  function verifyOtp(phone, otp, cb) {
    var cleaned = cleanPhone(phone);
    fetch(API_BASE + '/api/public/otp/verify', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ phone: cleaned, otp: otp.trim() }),
    })
    .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
    .then(function (x) {
      if (!x.ok) { cb(x.d.error || 'Verification failed.'); return; }
      cb(null, x.d.token);
    })
    .catch(function () { cb('Network error. Please check your connection.'); });
  }

  /* buildInlineOTP(container, phone, purpose, onVerified)
     Injects an inline OTP UI into container element.
     onVerified(token, phone) called when user verifies. */
  function buildInlineOTP(container, phone, purpose, onVerified) {
    var cleaned = cleanPhone(phone);
    container.innerHTML =
      '<div class="otp-inline-wrap">' +
        '<p class="otp-inline-label">Enter the 6-digit OTP sent to <strong>+91 ' + cleaned.slice(0,5) + '&hellip;' + cleaned.slice(-2) + '</strong></p>' +
        '<div class="otp-inline-row">' +
          '<input type="text" inputmode="numeric" maxlength="6" class="otp-inline-input" id="otpInlineInput" placeholder="_ _ _ _ _ _" autocomplete="one-time-code" />' +
          '<button type="button" class="otp-inline-btn" id="otpInlineVerify">Verify</button>' +
        '</div>' +
        '<button type="button" class="otp-inline-resend" id="otpInlineResend" disabled>Resend OTP <span id="otpCountdown">(60s)</span></button>' +
        '<p class="otp-inline-err" id="otpInlineErr" style="display:none"></p>' +
      '</div>';

    var inputEl   = container.querySelector('#otpInlineInput');
    var verifyBtn = container.querySelector('#otpInlineVerify');
    var resendBtn = container.querySelector('#otpInlineResend');
    var errEl     = container.querySelector('#otpInlineErr');
    var countdown = container.querySelector('#otpCountdown');

    /* Countdown timer */
    var secs = 60;
    var timer = setInterval(function () {
      secs--;
      if (secs <= 0) {
        clearInterval(timer);
        resendBtn.disabled = false;
        countdown.textContent = '';
      } else {
        countdown.textContent = '(' + secs + 's)';
      }
    }, 1000);

    verifyBtn.addEventListener('click', function () {
      var otp = inputEl.value.replace(/\s/g, '');
      if (otp.length !== 6) { showErr('Enter the 6-digit code.'); return; }
      verifyBtn.disabled = true;
      verifyBtn.textContent = '…';
      verifyOtp(phone, otp, function (err, token) {
        if (err) {
          showErr(err);
          verifyBtn.disabled = false;
          verifyBtn.textContent = 'Verify';
          return;
        }
        clearInterval(timer);
        container.innerHTML =
          '<div class="otp-verified"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Phone verified</div>';
        onVerified(token, phone);
      });
    });

    resendBtn.addEventListener('click', function () {
      resendBtn.disabled = true;
      errEl.style.display = 'none';
      sendOtp(phone, purpose, function (err) {
        if (err) { showErr(err); resendBtn.disabled = false; return; }
        secs = 60; countdown.textContent = '(60s)';
        timer = setInterval(function () {
          secs--;
          if (secs <= 0) { clearInterval(timer); resendBtn.disabled = false; countdown.textContent = ''; }
          else countdown.textContent = '(' + secs + 's)';
        }, 1000);
      });
    });

    inputEl.focus();

    function showErr(msg) {
      errEl.textContent = msg;
      errEl.style.display = 'block';
    }
  }

  return { sendOtp: sendOtp, verifyOtp: verifyOtp, buildInlineOTP: buildInlineOTP, isValidPhone: isValidPhone, cleanPhone: cleanPhone };
})();
