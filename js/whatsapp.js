/* ══════════════════════════════════════════════════════════════
   NeuArc WhatsApp Float Widget
   Self-contained IIFE — injected into every page via script tag
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var PHONES = [
    { number: '+91 90711 19371', wa: '919071119371', label: 'Primary Line'   },
    { number: '+91 90711 19372', wa: '919071119372', label: 'Secondary Line' },
  ];

  var MSG_TEMPLATE =
    'Hi NeuArc AI Academy! My name is {name}, and I\'m interested in learning more ' +
    'about your AI courses and programs. Could you please provide some information on ' +
    'upcoming batches? Looking forward to hearing from you!';

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

  var HEADER_WA_SVG =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
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

  /* Builds the wa.me URL with the pre-filled message */
  function waUrl(waNumber, name) {
    var displayName = (name && name.trim()) ? name.trim() : 'Your Name';
    var msg = MSG_TEMPLATE.replace('{name}', displayName);
    return 'https://wa.me/' + waNumber + '?text=' + encodeURIComponent(msg);
  }

  /* Updates all number link hrefs based on current name input value */
  function refreshLinks(nameInput, links) {
    var name = nameInput.value;
    links.forEach(function (link, i) {
      link.href = waUrl(PHONES[i].wa, name);
    });
  }

  function build() {
    var widget = document.createElement('div');
    widget.className = 'wa-widget';
    widget.setAttribute('id', 'waWidget');

    /* Build number link rows */
    var linksHtml = PHONES.map(function (p) {
      return '<a href="#" target="_blank" rel="noopener" class="wa-num-link" data-wa="' + p.wa + '">' +
        PHONE_SVG +
        '<span>' + p.number + '<span class="wa-num-label">' + p.label + '</span></span>' +
      '</a>';
    }).join('');

    widget.innerHTML =
      '<div class="wa-popup" id="waPopup" role="dialog" aria-label="WhatsApp contact">' +
        '<div class="wa-popup-header">' +
          HEADER_WA_SVG + ' Chat on WhatsApp' +
        '</div>' +
        '<div class="wa-name-row">' +
          '<label for="waNameInput">Your name</label>' +
          '<input type="text" class="wa-name-input" id="waNameInput"' +
          ' placeholder="e.g. Priya Sharma" autocomplete="off" />' +
        '</div>' +
        '<div class="wa-popup-body">' + linksHtml + '</div>' +
      '</div>' +
      '<button class="wa-btn" id="waBtn" aria-label="Chat on WhatsApp" aria-expanded="false">' +
        WA_SVG +
      '</button>';

    document.body.appendChild(widget);

    var btn       = widget.querySelector('#waBtn');
    var popup     = widget.querySelector('#waPopup');
    var nameInput = widget.querySelector('#waNameInput');
    var numLinks  = Array.prototype.slice.call(widget.querySelectorAll('.wa-num-link'));

    /* Set initial hrefs */
    refreshLinks(nameInput, numLinks);

    /* Re-build URL as user types */
    nameInput.addEventListener('input', function () {
      refreshLinks(nameInput, numLinks);
    });

    /* Toggle popup */
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = popup.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

      if (isOpen) {
        /* Auto-fill name from chatbot if available */
        if (!nameInput.value && window.NeuArcVisitorName) {
          nameInput.value = window.NeuArcVisitorName;
          refreshLinks(nameInput, numLinks);
        }
        setTimeout(function () { nameInput.focus(); }, 120);
      }
    });

    /* Dismiss on outside click */
    document.addEventListener('click', function (e) {
      if (!e.target.closest('#waWidget')) {
        popup.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }

})();
