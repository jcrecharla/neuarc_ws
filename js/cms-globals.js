/* Global CMS sync — updates dynamic track counts and track dropdowns on
   any page that includes this script.
   Runs silently; static fallback is preserved if the API is unreachable. */
(function () {
  var CMS_URL = 'https://admin.neuarcaiacademy.com/api/public/tracks';

  fetch(CMS_URL)
    .then(function (res) { return res.ok ? res.json() : Promise.reject(res.status); })
    .then(function (tracks) {
      if (!tracks || !tracks.length) return;
      var count = tracks.length;

      /* ── Homepage animated metric tile ── */
      var metricVal = document.getElementById('cms-tracks-metric');
      if (metricVal) {
        var current = parseInt(metricVal.dataset.target, 10);
        if (current !== count) {
          metricVal.dataset.target = count;
          if (metricVal.textContent && parseInt(metricVal.textContent, 10) === current) {
            metricVal.textContent = count;
          }
        }
      }

      /* ── Homepage metric description text ── */
      var metricDesc = document.getElementById('cms-tracks-metric-desc');
      if (metricDesc) {
        metricDesc.textContent = count + ' specialised tracks across Data, AI, Cloud, SAP, ServiceNow, Python, Java, Power Platform & Infrastructure';
      }

      /* ── tracks.html / any page hero + CTA counts ── */
      var hero = document.getElementById('tracks-count-hero');
      var cta  = document.getElementById('tracks-count-cta');
      if (hero) hero.textContent = count;
      if (cta)  cta.textContent  = count;

      /* ── Track of Interest dropdown (apply.html, learner signup, etc.) ──
         Populate any <select id="track"> that has 2 or fewer static options
         (i.e. just the placeholder ± "Undecided"). */
      var sel = document.getElementById('track');
      if (sel && sel.options.length <= 2) {
        tracks.forEach(function (t) {
          var opt       = document.createElement('option');
          opt.value     = t.title;
          opt.textContent = t.title;
          /* Insert before the last option if it is the "Undecided" catch-all */
          var last = sel.options[sel.options.length - 1];
          if (last && last.value && last.value.indexOf('Undecided') >= 0) {
            sel.insertBefore(opt, last);
          } else {
            sel.appendChild(opt);
          }
        });
      }
    })
    .catch(function () { /* silent fail — static HTML intact */ });
})();
