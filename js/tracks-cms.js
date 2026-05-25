/* Dynamic CMS overlay — syncs track panels with the admin Control Plane.
   Patches existing static panels AND renders new tracks added via Control Plane.
   Silent fallback to static HTML if the API is unreachable. */
(function () {
  var CMS_URL = 'https://admin.neuarcaiacademy.com/api/public/tracks';

  /* ── HTML helpers ──────────────────────────────────────────────────── */
  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function buildPanel(track) {
    return [
      '<h2 class="section-title" style="margin-bottom:8px">', esc(track.title), '</h2>',
      '<div class="stages-grid">',
        '<div class="stage-card">',
          '<div class="stage-num">Stage 01 · Weeks 1–6</div>',
          '<div class="stage-title">The Advancement Engine</div>',
          '<div class="stage-subtitle">Deep-Dive &amp; Architecture</div>',
          '<p class="stage-desc">', esc(track.stage1_content), '</p>',
        '</div>',
        '<div class="stage-card">',
          '<div class="stage-num">Stage 02 · Weeks 7–12</div>',
          '<div class="stage-title">The Implementation &amp; Product Lab</div>',
          '<div class="stage-subtitle">Real-Time Deployment &amp; Pipelines</div>',
          '<p class="stage-desc">', esc(track.stage2_content), '</p>',
        '</div>',
        '<div class="stage-card">',
          '<div class="stage-num">Stage 03 · Weeks 13–18</div>',
          '<div class="stage-title">The Career Survival &amp; Adaptability Arena</div>',
          '<div class="stage-subtitle">Production Outages &amp; Ticket Simulations</div>',
          '<p class="stage-desc">', esc(track.stage3_content), '</p>',
        '</div>',
      '</div>',
      '<div class="capstone">',
        '<div class="capstone-icon">', esc(track.icon_accent || '📘'), '</div>',
        '<div>',
          '<div class="capstone-tag">Product Capstone Showcase</div>',
          '<p>', esc(track.capstone_brief), '</p>',
        '</div>',
      '</div>',
    ].join('');
  }

  /* ── Patch existing panel with CMS data ────────────────────────────── */
  function patchPanel(panel, track) {
    var descs = panel.querySelectorAll('.stage-desc');
    if (track.stage1_content && descs[0]) descs[0].textContent = track.stage1_content;
    if (track.stage2_content && descs[1]) descs[1].textContent = track.stage2_content;
    if (track.stage3_content && descs[2]) descs[2].textContent = track.stage3_content;

    var capPara = panel.querySelector('.capstone > div > p');
    if (track.capstone_brief && capPara) capPara.textContent = track.capstone_brief;

    var iconEl = panel.querySelector('.capstone-icon');
    if (track.icon_accent && iconEl) iconEl.textContent = track.icon_accent;
  }

  /* ── Create new panel for a CMS-only track ─────────────────────────── */
  function createPanel(track) {
    var container = document.querySelector('#tracks-panels-container');
    if (!container) {
      // Fallback: find the section that holds existing panels
      var existing = document.querySelector('.track-panel');
      if (!existing || !existing.parentNode) return;
      container = existing.parentNode;
    }
    var div = document.createElement('div');
    div.className = 'track-panel';
    div.id = 'track-' + track.track_key;
    div.innerHTML = buildPanel(track);
    container.appendChild(div);
  }

  /* ── Ensure a toggle button exists for the track ───────────────────── */
  function ensureButton(track) {
    if (document.querySelector('.track-btn[data-track="' + track.track_key + '"]')) return;
    var groups = document.querySelectorAll('.track-toggle-group');
    if (!groups.length) return;
    var btn = document.createElement('button');
    btn.className = 'track-btn';
    btn.setAttribute('data-track', track.track_key);
    btn.textContent = track.title;
    groups[groups.length - 1].appendChild(btn);
  }

  /* ── Re-wire all toggle buttons (replaces static main.js listeners) ── */
  function reinitToggles() {
    document.querySelectorAll('.track-btn').forEach(function (oldBtn) {
      var fresh = oldBtn.cloneNode(true);
      oldBtn.parentNode.replaceChild(fresh, oldBtn);
      fresh.addEventListener('click', function () {
        document.querySelectorAll('.track-btn').forEach(function (b) { b.classList.remove('active'); });
        document.querySelectorAll('.track-panel').forEach(function (p) { p.classList.remove('active'); });
        fresh.classList.add('active');
        var panel = document.getElementById('track-' + fresh.getAttribute('data-track'));
        if (panel) panel.classList.add('active');
      });
    });
  }

  /* ── Main ───────────────────────────────────────────────────────────── */
  fetch(CMS_URL)
    .then(function (res) { return res.ok ? res.json() : Promise.reject(res.status); })
    .then(function (tracks) {
      if (!tracks || !tracks.length) return;

      tracks.forEach(function (track) {
        var panel = document.getElementById('track-' + track.track_key);
        if (panel) {
          patchPanel(panel, track);
        } else {
          createPanel(track);
          ensureButton(track);
        }
      });

      // Re-wire all toggles so new buttons + panels are included
      reinitToggles();
    })
    .catch(function () { /* silent fail — static HTML remains intact */ });
})();
