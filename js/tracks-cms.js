/* Dynamic CMS overlay — patches track panels with content from the admin Control Plane.
   Falls back to static HTML silently if the API is unreachable or a field is empty. */
(function () {
  var CMS_URL = 'https://admin.neuarcaiacademy.com/api/public/tracks';

  function applyTrack(track) {
    var panel = document.getElementById('track-' + track.track_key);
    if (!panel) return;

    var stages = panel.querySelectorAll('.stage-desc');
    if (track.stage1_content && stages[0]) stages[0].textContent = track.stage1_content;
    if (track.stage2_content && stages[1]) stages[1].textContent = track.stage2_content;
    if (track.stage3_content && stages[2]) stages[2].textContent = track.stage3_content;

    var capPara = panel.querySelector('.capstone > div > p');
    if (track.capstone_brief && capPara) capPara.textContent = track.capstone_brief;

    var iconEl = panel.querySelector('.capstone-icon');
    if (track.icon_accent && iconEl) iconEl.textContent = track.icon_accent;
  }

  fetch(CMS_URL)
    .then(function (res) { return res.ok ? res.json() : Promise.reject(); })
    .then(function (tracks) { tracks.forEach(applyTrack); })
    .catch(function () { /* silent fail — static HTML remains */ });
})();
