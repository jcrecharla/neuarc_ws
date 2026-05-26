/* tracks-cms.js — Fully dynamic track renderer from admin Control Plane.
   Fetches all active tracks from the CMS API and renders the complete
   overview grid, filter buttons, and track detail panels.
   Adding/updating/removing a track in the admin portal is reflected here
   on the next page load with no static HTML changes required. */
(function () {
  'use strict';

  var API = 'https://admin.neuarcaiacademy.com/api/public/tracks';

  /* ── Colour map keyed on tag_color field ─────────────────────────── */
  var COLORS = {
    green:  { bg: 'rgba(74,222,128,0.07)',  fg: '#16A34A', bd: 'rgba(74,222,128,0.2)'  },
    purple: { bg: 'rgba(139,92,246,0.07)',  fg: '#7C3AED', bd: 'rgba(139,92,246,0.2)'  },
    amber:  { bg: 'rgba(245,158,11,0.07)',  fg: '#B45309', bd: 'rgba(245,158,11,0.2)'  },
    sky:    { bg: 'rgba(6,182,212,0.07)',   fg: '#0E7490', bd: 'rgba(6,182,212,0.2)'   },
    blue:   { bg: 'rgba(59,130,246,0.07)',  fg: '#1D4ED8', bd: 'rgba(59,130,246,0.2)'  },
    indigo: { bg: 'rgba(99,102,241,0.07)',  fg: '#4338CA', bd: 'rgba(99,102,241,0.2)'  },
    cyan:   { bg: 'rgba(34,211,238,0.07)',  fg: '#0891B2', bd: 'rgba(34,211,238,0.2)'  },
    teal:   { bg: 'rgba(20,184,166,0.07)',  fg: '#0F766E', bd: 'rgba(20,184,166,0.2)'  },
    yellow: { bg: 'rgba(234,179,8,0.07)',   fg: '#854D0E', bd: 'rgba(234,179,8,0.2)'   },
    red:    { bg: 'rgba(220,38,38,0.07)',   fg: '#B91C1C', bd: 'rgba(220,38,38,0.2)'   },
    violet: { bg: 'rgba(124,58,237,0.07)',  fg: '#6D28D9', bd: 'rgba(124,58,237,0.2)'  },
    gray:   { bg: 'rgba(107,114,128,0.07)', fg: '#374151', bd: 'rgba(107,114,128,0.2)' },
  };

  /* ── Utilities ───────────────────────────────────────────────────── */
  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function colorStyle(color) {
    var c = COLORS[color] || COLORS.green;
    return 'background:' + c.bg + ';color:' + c.fg + ';border-color:' + c.bd;
  }

  function colorFg(color) {
    return (COLORS[color] || COLORS.green).fg;
  }

  /* Derive a short toggle-button label from the track_key slug */
  var ABBR = { ai:'AI', sap:'SAP', aws:'AWS', gcp:'GCP', cpi:'CPI', btp:'BTP',
               abap:'ABAP', devops:'DevOps', servicenow:'ServiceNow', infra:'Infra' };
  function shortLabel(key) {
    return key.split('-').map(function (w) {
      return ABBR[w.toLowerCase()] || (w.charAt(0).toUpperCase() + w.slice(1));
    }).join(' ');
  }

  /* Truncate to ~100 chars at a word boundary */
  function excerpt(text, max) {
    if (!text) return '';
    max = max || 100;
    if (text.length <= max) return text;
    return text.slice(0, max).replace(/\s+\S*$/, '') + '…';
  }

  /* Extract "Track XX" number from track_label */
  function trackNum(label) {
    var m = label && label.match(/Track\s+(\d+)/i);
    return m ? 'Track ' + m[1].padStart(2, '0') : '';
  }

  /* Determine vertical group from track_label */
  function isDataAI(label) {
    return label && label.indexOf('Data') >= 0 && label.indexOf('AI') >= 0;
  }

  /* ── HTML builders ───────────────────────────────────────────────── */
  var DELAY = ['d1','d2','d3','d4'];

  function buildOverviewCard(track, idx) {
    return '<div class="track-overview-card reveal ' + DELAY[idx % 4] + '" data-jump="' + esc(track.track_key) + '" style="cursor:pointer">' +
      '<div class="track-overview-icon">' + esc(track.icon_accent) + '</div>' +
      '<div class="track-overview-num">' + esc(trackNum(track.track_label)) + '</div>' +
      '<h4>' + esc(track.title) + '</h4>' +
      (track.track_description ? '<p>' + esc(excerpt(track.track_description, 90)) + '</p>' : '') +
      '</div>';
  }

  function buildStageCard(num, title, subtitle, content) {
    return '<div class="stage-card">' +
      '<div class="stage-num">' + num + '</div>' +
      '<div class="stage-title">' + title + '</div>' +
      '<div class="stage-subtitle">' + subtitle + '</div>' +
      '<p class="stage-desc">' + esc(content) + '</p>' +
      '</div>';
  }

  function buildPanel(track) {
    var c = colorFg(track.tag_color);
    var labelHtml = track.track_label
      ? '<div class="section-tag" style="' + colorStyle(track.tag_color) + '">' + esc(track.track_label) + '</div>'
      : '';
    var suffixHtml = track.title_suffix
      ? ' <span style="font-size:0.6em;color:' + c + ';font-family:var(--font-mono)">' + esc(track.title_suffix) + '</span>'
      : '';
    var descHtml = track.track_description
      ? '<p class="section-sub" style="margin-bottom:48px">' + esc(track.track_description) + '</p>'
      : '';
    var capstoneHtml = track.capstone_brief
      ? '<div class="capstone"><div class="capstone-icon">' + esc(track.icon_accent || '📘') + '</div>' +
        '<div><div class="capstone-tag">Product Capstone Showcase</div>' +
        '<p>' + esc(track.capstone_brief) + '</p></div></div>'
      : '';
    return labelHtml +
      '<h2 class="section-title" style="margin-bottom:8px">' + esc(track.title) + suffixHtml + '</h2>' +
      descHtml +
      '<div class="stages-grid">' +
        buildStageCard('Stage 01 · Weeks 1–6',   'The Advancement Engine',              'Deep-Dive &amp; Architecture',              track.stage1_content) +
        buildStageCard('Stage 02 · Weeks 7–12',  'The Implementation &amp; Product Lab', 'Real-Time Deployment &amp; Pipelines',      track.stage2_content) +
        buildStageCard('Stage 03 · Weeks 13–18', 'The Career Survival &amp; Adaptability Arena', 'Production Outages &amp; Ticket Simulations', track.stage3_content) +
      '</div>' +
      capstoneHtml;
  }

  /* ── Main renderer ───────────────────────────────────────────────── */
  function render(tracks) {
    var container = document.getElementById('tracks-container');
    if (!container) return;

    var dataAI     = tracks.filter(function (t) { return isDataAI(t.track_label); });
    var enterprise = tracks.filter(function (t) { return !isDataAI(t.track_label); });
    var html       = '';

    /* Overview grid — Data & AI */
    if (dataAI.length) {
      html += '<div class="tracks-vertical-header reveal">' +
        '<span class="tracks-vertical-header-label vert-label-data">🟢 Data &amp; AI Verticals</span><hr /></div>';
      html += '<div class="tracks-overview-grid" style="margin-bottom:40px">';
      dataAI.forEach(function (t, i) { html += buildOverviewCard(t, i); });
      html += '</div>';
    }

    /* Overview grid — Enterprise & DevOps */
    if (enterprise.length) {
      html += '<div class="tracks-vertical-header reveal">' +
        '<span class="tracks-vertical-header-label vert-label-enterprise">💻 Enterprise Application &amp; DevOps Verticals</span><hr /></div>';
      html += '<div class="tracks-overview-grid" style="margin-bottom:56px">';
      enterprise.forEach(function (t, i) { html += buildOverviewCard(t, i); });
      html += '</div>';
    }

    /* Filter toggle buttons */
    html += '<div class="track-toggle reveal">';
    if (dataAI.length) {
      html += '<div class="track-toggle-group"><span class="track-toggle-label">🟢 Data &amp; AI</span>';
      dataAI.forEach(function (t) {
        html += '<button class="track-btn" data-track="' + esc(t.track_key) + '">' + esc(shortLabel(t.track_key)) + '</button>';
      });
      html += '</div>';
    }
    if (dataAI.length && enterprise.length) html += '<div class="track-toggle-sep"></div>';
    if (enterprise.length) {
      html += '<div class="track-toggle-group"><span class="track-toggle-label">💻 Enterprise &amp; DevOps</span>';
      enterprise.forEach(function (t) {
        html += '<button class="track-btn" data-track="' + esc(t.track_key) + '">' + esc(shortLabel(t.track_key)) + '</button>';
      });
      html += '</div>';
    }
    html += '</div>';

    /* Track detail panels */
    tracks.forEach(function (t) {
      html += '<div class="track-panel" id="track-' + esc(t.track_key) + '">' + buildPanel(t) + '</div>';
    });

    container.innerHTML = html;

    /* Activate first track by default */
    var firstBtn   = container.querySelector('.track-btn');
    var firstPanel = container.querySelector('.track-panel');
    if (firstBtn)   firstBtn.classList.add('active');
    if (firstPanel) firstPanel.classList.add('active');

    /* Toggle event wiring */
    container.querySelectorAll('.track-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        container.querySelectorAll('.track-btn').forEach(function (b)   { b.classList.remove('active'); });
        container.querySelectorAll('.track-panel').forEach(function (p) { p.classList.remove('active'); });
        btn.classList.add('active');
        var panel = document.getElementById('track-' + btn.getAttribute('data-track'));
        if (panel) panel.classList.add('active');
      });
    });

    /* Overview card → jump to panel */
    container.querySelectorAll('[data-jump]').forEach(function (card) {
      card.addEventListener('click', function () {
        var key = card.getAttribute('data-jump');
        var btn = container.querySelector('.track-btn[data-track="' + key + '"]');
        if (btn) {
          btn.click();
          var toggle = container.querySelector('.track-toggle');
          if (toggle) toggle.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    /* Update count displays in page header + CTA */
    var n    = tracks.length;
    var hero = document.getElementById('tracks-count-hero');
    var cta  = document.getElementById('tracks-count-cta');
    if (hero) hero.textContent = n;
    if (cta)  cta.textContent  = n;

    /* Also populate apply.html track dropdown if present on page */
    var trackSelect = document.getElementById('track');
    if (trackSelect && trackSelect.options.length <= 2) {
      tracks.forEach(function (t) {
        var opt    = document.createElement('option');
        opt.value  = t.title;
        opt.textContent = t.title;
        trackSelect.appendChild(opt);
      });
    }

    /* Trigger reveal scroll animations */
    if (typeof window.initReveal === 'function') window.initReveal();
  }

  /* ── Fetch & execute ─────────────────────────────────────────────── */
  fetch(API)
    .then(function (res) { return res.ok ? res.json() : Promise.reject(res.status); })
    .then(function (tracks) {
      if (!tracks || !tracks.length) throw new Error('empty');
      render(tracks);
    })
    .catch(function () {
      var loading = document.getElementById('tracks-loading');
      if (loading) loading.innerHTML =
        '<p style="font-family:var(--font-mono);font-size:0.85rem;color:var(--text-4)">' +
        'Unable to load tracks. Please refresh the page.</p>';
    });
})();
