/* Global CMS sync — updates dynamic track count on any page it is included on.
   Runs silently; static HTML remains intact if the API is unreachable. */
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
          /* If the counter already animated, update the displayed number directly */
          if (metricVal.textContent && parseInt(metricVal.textContent, 10) === current) {
            metricVal.textContent = count;
          }
        }
      }

      /* ── Homepage metric description text ── */
      var metricDesc = document.getElementById('cms-tracks-metric-desc');
      if (metricDesc) {
        metricDesc.textContent = count + ' specialised tracks across Data, AI, Cloud, SAP, ServiceNow, Python, Java & Power Platform';
      }

      /* ── tracks.html hero + CTA counts (also patched here as fallback) ── */
      var hero = document.getElementById('tracks-count-hero');
      var cta  = document.getElementById('tracks-count-cta');
      if (hero) hero.textContent = count;
      if (cta)  cta.textContent  = count;
    })
    .catch(function () { /* silent fail */ });
})();
