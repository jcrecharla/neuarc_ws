/* ══════════════════════════════════════════════════════════════
   NeuArc Login Popup
   Triggered by any element with class "nav-login-btn"
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var ADMIN_URL   = 'https://neuarc-admin.vercel.app';
  var LEARNER_URL = 'https://learner.neuarcaiacademy.com';

  function build() {
    var overlay = document.createElement('div');
    overlay.className = 'login-overlay';
    overlay.id        = 'loginOverlay';

    overlay.innerHTML =
      '<div class="login-modal-wrap">' +
        '<div class="login-modal" role="dialog" aria-modal="true" aria-label="Login">' +
          '<button class="login-close" id="loginClose" aria-label="Close">&times;</button>' +
          '<div class="login-modal-head">' +
            '<h3>Access NeuArc Portal</h3>' +
            '<p>Select your portal to continue</p>' +
          '</div>' +
          '<div class="login-options">' +
            '<a href="' + ADMIN_URL + '" target="_blank" rel="noopener" class="login-option">' +
              '<span class="login-option-icon">&#x1F4BB;</span>' +
              '<span class="login-option-title">Admin Portal</span>' +
              '<span class="login-option-desc">For advisors, trainers &amp; system administrators</span>' +
            '</a>' +
            '<a href="' + LEARNER_URL + '" target="_blank" rel="noopener" class="login-option">' +
              '<span class="login-option-icon">&#x1F393;</span>' +
              '<span class="login-option-title">Learner Hub</span>' +
              '<span class="login-option-desc">AI Assessor, Interview Trainer &amp; progress dashboard</span>' +
            '</a>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);

    overlay.querySelector('#loginClose').addEventListener('click', close);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    function close() {
      overlay.classList.remove('open');
    }
  }

  function open() {
    var el = document.getElementById('loginOverlay');
    if (el) el.classList.add('open');
  }

  function init() {
    build();
    document.addEventListener('click', function (e) {
      if (e.target.classList.contains('nav-login-btn') ||
          e.target.closest('.nav-login-btn')) {
        e.preventDefault();
        open();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
