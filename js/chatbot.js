/* ══════════════════════════════════════════════════════════════
   NeuArc Engineering Advisor — Intelligent Intake Chatbot
   State-machine driven, fully client-side, no external SDK
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────────
     CONFIG
     NOTE: buddy.adviser@neuarcaiacademy.com must be activated
     via the confirmation link formsubmit.co sends on first POST.
  ───────────────────────────────────────────────────────────── */
  var INTAKE_EMAIL = 'buddy.adviser@neuarcaiacademy.com';

  /* ─────────────────────────────────────────────────────────────
     TRACK CATALOGUE  (16 tracks)
  ───────────────────────────────────────────────────────────── */
  var TRACKS = [
    { id: 'data-engineering',        label: 'Advanced Data Engineering'    },
    { id: 'data-science',            label: 'Data Science'                 },
    { id: 'machine-learning',        label: 'Machine Learning'             },
    { id: 'artificial-intelligence', label: 'Artificial Intelligence'      },
    { id: 'snowflake',               label: 'Snowflake Developer'          },
    { id: 'azure-data',              label: 'Azure Data Engineer'          },
    { id: 'aws-data',                label: 'AWS Data Engineer'            },
    { id: 'gcp-data',                label: 'GCP Data Engineer'            },
    { id: 'cloud-devops',            label: 'Cloud-Native DevOps'          },
    { id: 'ai-web-apps',             label: 'AI-Assisted Web Apps'         },
    { id: 'sap-abap',                label: 'SAP ABAP on HANA'             },
    { id: 'sap-cpi',                 label: 'SAP CPI / BTP Integration'    },
    { id: 'servicenow',              label: 'ServiceNow Application Engineer'},
    { id: 'python',                  label: 'Enterprise Python Developer'  },
    { id: 'java',                    label: 'Enterprise Java Developer'    },
    { id: 'power-platform',          label: 'Power Platform Developer'     },
  ];

  /* ─────────────────────────────────────────────────────────────
     PRE-REQUISITE MATRIX
  ───────────────────────────────────────────────────────────── */
  var PREREQS = {
    'data-engineering':        'Intermediate SQL (joins, aggregates), core Python mechanics — loops, functions, lists — and strong foundational programming logic.',
    'data-science':            'Intermediate SQL (joins, aggregates), core Python mechanics — loops, functions, lists — and strong foundational programming logic.',
    'machine-learning':        'Intermediate SQL (joins, aggregates), core Python mechanics — loops, functions, lists — and strong foundational programming logic.',
    'artificial-intelligence': 'Intermediate SQL (joins, aggregates), core Python mechanics — loops, functions, lists — and strong foundational programming logic.',
    'snowflake':               'Intermediate SQL (joins, aggregates), core Python mechanics — loops, functions, lists — and strong foundational programming logic.',
    'azure-data':              'Intermediate SQL (joins, aggregates), core Python mechanics — loops, functions, lists — and strong foundational programming logic.',
    'aws-data':                'Intermediate SQL (joins, aggregates), core Python mechanics — loops, functions, lists — and strong foundational programming logic.',
    'gcp-data':                'Intermediate SQL (joins, aggregates), core Python mechanics — loops, functions, lists — and strong foundational programming logic.',
    'ai-web-apps':             'Intermediate SQL (joins, aggregates), core Python mechanics — loops, functions, lists — and strong foundational programming logic.',
    'python':                  'Basic Python syntax proficiency, OOP concepts (classes, inheritance), and relational database basics.',
    'java':                    'Core Java fundamentals (Classes, Methods, Interfaces), OOP principles, and Maven or Gradle familiarity.',
    'sap-abap':                'Enterprise ERP workflow fundamentals, basic database knowledge, and procedural programming logic.',
    'sap-cpi':                 'Enterprise ERP workflow fundamentals, basic database knowledge, and procedural programming logic.',
    'servicenow':              'Basic JavaScript (variables, functions, arrays) and familiarity with ITIL or enterprise ticket workflow systems.',
    'power-platform':          'Basic relational data structures, Excel-like formula logic, and baseline enterprise workflow concepts.',
    'cloud-devops':            'Basic Linux command line, networking fundamentals (IP, ports, protocols), and foundational scripting logic.',
  };

  /* ─────────────────────────────────────────────────────────────
     FAQ / INTERRUPTION DATABASE
  ───────────────────────────────────────────────────────────── */
  var FAQ_DB = [
    {
      patterns: ['edge framework', 'edge method', 'what is edge', 'how does edge', 'edge loop', 'about edge'],
      reply: 'The EDGE Framework is NeuArc\'s four-phase production delivery loop: <strong>Execute</strong> (real artefact delivery), <strong>Deploy</strong> (live cloud infrastructure), <strong>Guide</strong> (mentor-led architectural review), <strong>Evaluate</strong> (performance-benchmarked iteration). It replaces lecture-based learning with production-grade output cycles entirely.'
    },
    {
      patterns: ['price', 'pricing', 'cost', 'fee', 'how much', 'afford', 'payment plan', 'emi', 'installment'],
      reply: 'Programme fees vary by track and cohort. The full structure and financing options are shared by our admissions team after your technical evaluation is complete. Let\'s finish your profile first.'
    },
    {
      patterns: ['how long', 'duration', 'how many weeks', 'how many months', 'timeline', 'next batch', 'when does it start', 'when start'],
      reply: 'Track durations range from 12 to 20 weeks depending on specialisation. Your cohort schedule is confirmed post-evaluation.'
    },
    {
      patterns: ['online', 'offline', 'remote', 'hybrid', 'in person', 'classroom', 'location', 'where is'],
      reply: 'NeuArc operates fully remotely — all sessions, mentoring, and deliveries run via the LMS and live video platform.'
    },
    {
      patterns: ['certificate', 'certification', 'credential', 'diploma'],
      reply: 'Graduates receive a verified NeuArc completion certificate linked to their production portfolio. Industry feedback shows this carries more interview weight than standalone certification credentials.'
    },
    {
      patterns: ['placement', 'job guarantee', 'hiring', 'placement support', 'career support', 'get a job'],
      reply: 'The Career Suite — included in every track — covers technical interview prep, system design mocks, resume engineering, and an active hiring referral network. Outcomes scale directly with portfolio quality and engagement.'
    },
    {
      patterns: ['refund', 'cancel', 'withdraw', 'money back'],
      reply: 'Refund and cancellation terms are detailed in the enrolment agreement shared post-evaluation. For direct queries: info@neuarcaiacademy.com.'
    },
    {
      patterns: ['what is neuarc', 'about neuarc', 'who are you', 'tell me about neuarc', 'what do you do'],
      reply: 'NeuArc AI Academy trains working developers into production-grade engineers across Data, AI, Cloud, and Enterprise stacks — using real project delivery loops, not synthetic exercises. Every track is led by senior practitioners.'
    },
  ];

  /* ─────────────────────────────────────────────────────────────
     RESUME PROMPTS (after FAQ interruption)
  ───────────────────────────────────────────────────────────── */
  var RESUME = {
    q1_name:       'Back to your profile — what\'s your full name?',
    q1_email:      'What\'s your email address?',
    q2_role:       'What\'s your current role or designation?',
    q3_education:  'Your highest educational qualification?',
    q4_graduation: 'And your year of graduation?',
    q5_experience: 'How many years of professional experience do you have?',
    q6_stack:      'What does your current tech stack look like?',
    q7_intent:     'What\'s your primary objective for this programme?',
    q8_lead:       'How did you come across NeuArc?',
    q8_referral:   'The referral contact details?',
    q9_track:      'Which engineering track are you targeting?',
    q10_prereqs:   'Back to the baseline check — are you comfortable proceeding past introductory syntax into this architecture?',
  };

  /* ─────────────────────────────────────────────────────────────
     STATE
  ───────────────────────────────────────────────────────────── */
  var state = {
    step:    'boot',
    data:    {},
    started: false,
    botBusy: false,
  };

  var $msgs, $input, $send, $panel, $toggle, $typing;

  /* ─────────────────────────────────────────────────────────────
     SVG ICONS
  ───────────────────────────────────────────────────────────── */
  function icon(name) {
    var map = {
      brain:
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          '<path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>' +
          '<path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>' +
        '</svg>',
      close:
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">' +
          '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' +
        '</svg>',
      send:
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>' +
        '</svg>',
      chat:
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' +
        '</svg>',
    };
    return map[name] || '';
  }

  /* ─────────────────────────────────────────────────────────────
     BUILD WIDGET DOM  (fully JS-injected, zero HTML required)
  ───────────────────────────────────────────────────────────── */
  function buildWidget() {
    var root = document.createElement('div');
    root.className = 'adv-widget';
    root.id = 'advWidget';
    root.innerHTML =
      '<div class="adv-panel" id="advPanel" role="dialog" aria-label="NeuArc Engineering Advisor">' +
        '<div class="adv-header">' +
          '<div class="adv-header-left">' +
            '<div class="adv-avatar">' + icon('brain') + '</div>' +
            '<div>' +
              '<p class="adv-name">Engineering Advisor</p>' +
              '<p class="adv-status"><span class="adv-online-dot"></span>NeuArc AI Academy</p>' +
            '</div>' +
          '</div>' +
          '<button class="adv-close-btn" id="advClose" aria-label="Close advisor">' + icon('close') + '</button>' +
        '</div>' +
        '<div class="adv-messages" id="advMessages" role="log" aria-live="polite">' +
          '<div class="adv-typing-wrap" id="advTyping" style="display:none">' +
            '<span></span><span></span><span></span>' +
          '</div>' +
        '</div>' +
        '<div class="adv-footer">' +
          '<input class="adv-input" id="advInput" type="text" placeholder="Type your response…" autocomplete="off" aria-label="Your message" />' +
          '<button class="adv-send-btn" id="advSend" aria-label="Send">' + icon('send') + '</button>' +
        '</div>' +
      '</div>' +
      '<button class="adv-toggle" id="advToggle" aria-label="Chat with AI Advisor" aria-expanded="false">' +
        '<span class="adv-toggle-icon">' + icon('chat') + '</span>' +
        '<span class="adv-toggle-label">AI Advisor</span>' +
        '<span class="adv-toggle-badge" id="advBadge"></span>' +
      '</button>';

    document.body.appendChild(root);

    $msgs   = document.getElementById('advMessages');
    $input  = document.getElementById('advInput');
    $send   = document.getElementById('advSend');
    $panel  = document.getElementById('advPanel');
    $toggle = document.getElementById('advToggle');
    $typing = document.getElementById('advTyping');

    document.getElementById('advToggle').addEventListener('click', togglePanel);
    document.getElementById('advClose').addEventListener('click', closePanel);
    $send.addEventListener('click', onSubmit);
    $input.addEventListener('keydown', function (e) { if (e.key === 'Enter') onSubmit(); });

    /* pulse badge after 3 s to draw first-time attention */
    setTimeout(function () {
      var badge = document.getElementById('advBadge');
      if (badge && !state.started) badge.classList.add('pulse');
    }, 3000);
  }

  /* ─────────────────────────────────────────────────────────────
     PANEL TOGGLE
  ───────────────────────────────────────────────────────────── */
  function togglePanel() {
    var open = $panel.classList.toggle('open');
    $toggle.classList.toggle('active', open);
    $toggle.setAttribute('aria-expanded', open ? 'true' : 'false');

    var badge = document.getElementById('advBadge');
    if (badge) badge.classList.remove('pulse');

    if (open && !state.started) {
      state.started = true;
      advance('greeting');
    }
    if (open) setTimeout(function () { $input.focus(); }, 300);
  }

  function closePanel() {
    $panel.classList.remove('open');
    $toggle.classList.remove('active');
    $toggle.setAttribute('aria-expanded', 'false');
  }

  /* ─────────────────────────────────────────────────────────────
     MESSAGE RENDERING
  ───────────────────────────────────────────────────────────── */
  function appendMsg(role, html, chips) {
    var wrap   = document.createElement('div');
    var bubble = document.createElement('div');

    wrap.className   = 'adv-msg adv-msg-' + role;
    bubble.className = 'adv-bubble';
    bubble.innerHTML = html;
    wrap.appendChild(bubble);

    if (chips && chips.length) {
      var chipsEl = document.createElement('div');
      chipsEl.className = 'adv-chips';
      chips.forEach(function (chip) {
        var btn = document.createElement('button');
        btn.className   = 'adv-chip';
        btn.textContent = chip.label || chip;
        btn.addEventListener('click', function () {
          if (state.botBusy) return;
          chipsEl.querySelectorAll('.adv-chip').forEach(function (b) {
            b.disabled = true;
            b.classList.add('used');
          });
          var display = chip.label || chip;
          var value   = chip.value !== undefined ? chip.value : display;
          appendMsg('user', esc(display));
          route(value);
        });
        chipsEl.appendChild(btn);
      });
      wrap.appendChild(chipsEl);
    }

    $msgs.insertBefore(wrap, $typing);
    scrollBottom();
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function scrollBottom() {
    $msgs.scrollTop = $msgs.scrollHeight;
  }

  /* ─────────────────────────────────────────────────────────────
     BOT SPEAK  (simulated typing delay)
  ───────────────────────────────────────────────────────────── */
  function botSay(html, chips, fixedDelay) {
    return new Promise(function (resolve) {
      var words = html.replace(/<[^>]+>/g, '').trim().split(/\s+/).length;
      var delay = fixedDelay !== undefined
        ? fixedDelay
        : Math.min(Math.max(words * 52, 650), 2000);

      state.botBusy = true;
      $typing.style.display = 'flex';
      scrollBottom();

      setTimeout(function () {
        $typing.style.display = 'none';
        appendMsg('bot', html, chips);
        state.botBusy = false;
        resolve();
      }, delay);
    });
  }

  /* ─────────────────────────────────────────────────────────────
     USER SUBMIT
  ───────────────────────────────────────────────────────────── */
  function onSubmit() {
    var raw = $input.value.trim();
    if (!raw || state.botBusy) return;
    $input.value = '';
    appendMsg('user', esc(raw));
    route(raw);
  }

  /* ─────────────────────────────────────────────────────────────
     FAQ INTERRUPT CHECK
  ───────────────────────────────────────────────────────────── */
  function checkFAQ(lc) {
    for (var i = 0; i < FAQ_DB.length; i++) {
      var entry = FAQ_DB[i];
      for (var j = 0; j < entry.patterns.length; j++) {
        if (lc.indexOf(entry.patterns[j]) !== -1) return entry.reply;
      }
    }
    return null;
  }

  /* ─────────────────────────────────────────────────────────────
     STATE MACHINE ROUTER
  ───────────────────────────────────────────────────────────── */
  function route(value) {
    var lc   = value.toLowerCase().trim();
    var step = state.step;

    /* FAQ interrupt — allowed from any data-collection step */
    var dataColl = ['q1_name','q1_email','q2_role','q3_education','q4_graduation',
                    'q5_experience','q6_stack','q7_intent','q8_lead','q8_referral',
                    'q9_track','q10_prereqs'];
    if (dataColl.indexOf(step) !== -1) {
      var faqHit = checkFAQ(lc);
      if (faqHit) {
        var savedStep = step;
        botSay(faqHit).then(function () {
          setTimeout(function () {
            var prompt = RESUME[savedStep];
            if (prompt) botSay(prompt);
          }, 400);
        });
        return;
      }
    }

    /* ── Step handlers ── */
    if (step === 'q1_name') {
      if (value.trim().length < 2) {
        botSay('Please enter your full name to continue.'); return;
      }
      state.data.name = toTitle(value.trim());
      advance('q1_email');

    } else if (step === 'q1_email') {
      if (!isEmail(value.trim())) {
        botSay('That doesn\'t appear to be a valid address. Please re-enter your email.'); return;
      }
      state.data.email = value.trim().toLowerCase();
      advance('q2_role');

    } else if (step === 'q2_role') {
      state.data.role = value.trim();
      advance('q3_education');

    } else if (step === 'q3_education') {
      state.data.education = value.trim();
      advance('q4_graduation');

    } else if (step === 'q4_graduation') {
      var yr = parseInt(value.replace(/\D/g, ''), 10);
      if (!yr || yr < 1970 || yr > new Date().getFullYear() + 5) {
        botSay('Please enter a valid graduation year (e.g., 2020).'); return;
      }
      state.data.graduation = yr;
      advance('q5_experience');

    } else if (step === 'q5_experience') {
      state.data.experience = value.trim();
      advance('q6_stack');

    } else if (step === 'q6_stack') {
      state.data.stack = value.trim();
      advance('q7_intent');

    } else if (step === 'q7_intent') {
      state.data.intent = value.trim();
      advance('q8_lead');

    } else if (step === 'q8_lead') {
      state.data.leadSource = lc.indexOf('referr') !== -1 ? 'Referral' : 'Direct';
      if (state.data.leadSource === 'Referral') {
        advance('q8_referral');
      } else {
        state.data.referral = 'N/A';
        advance('q9_track');
      }

    } else if (step === 'q8_referral') {
      state.data.referral = value.trim();
      advance('q9_track');

    } else if (step === 'q9_track') {
      var found = null;
      for (var t = 0; t < TRACKS.length; t++) {
        if (TRACKS[t].label.toLowerCase() === lc || TRACKS[t].id === value) {
          found = TRACKS[t]; break;
        }
      }
      if (!found) { botSay('Please select one of the tracks listed above.'); return; }
      state.data.track   = found.label;
      state.data.trackId = found.id;
      advance('q10_prereqs');

    } else if (step === 'q10_prereqs') {
      var confirmed = lc === 'yes' ||
                      lc.indexOf("i'm ready") !== -1 ||
                      lc.indexOf('yes, i') !== -1 ||
                      lc.indexOf('confirmed') !== -1 ||
                      lc.indexOf('comfortable') !== -1;
      if (confirmed) {
        state.data.prereqAck = 'Confirmed';
        advance('complete');
      } else {
        state.step = 'q10_soft';
        botSay(
          'Noted. The programme builds directly on that baseline — ' +
          'candidates who skip it spend early sprints on syntax instead of architecture, which limits output quality.<br><br>' +
          'You can still register your interest and our team will advise on a readiness path. Shall I proceed with logging your profile?',
          [
            { label: 'Yes, log my profile',  value: '__log__'  },
            { label: 'I\'ll prepare first',  value: '__prep__' },
          ]
        );
      }

    } else if (step === 'q10_soft') {
      if (value === '__log__') {
        state.data.prereqAck = 'Partially Confirmed — Readiness advisory required';
        advance('complete');
      } else {
        state.step = 'done';
        botSay(
          'Understood. When you\'re ready, come back and we\'ll complete your registration in minutes.<br><br>' +
          'You can also reach the team directly at <a href="mailto:info@neuarcaiacademy.com" style="color:var(--g);font-weight:600;">info@neuarcaiacademy.com</a>.'
        );
        lockInput();
      }
    }
  }

  /* ─────────────────────────────────────────────────────────────
     ADVANCE  —  set next step & send bot prompt
  ───────────────────────────────────────────────────────────── */
  function advance(step) {
    state.step = step;

    if (step === 'greeting') {
      state.step = 'q1_name';
      botSay(
        'Welcome to <strong>NeuArc AI Academy</strong>. I\'m your Engineering Advisor.<br><br>' +
        'I\'ll map your background to the right engineering track, validate your technical baseline, and get your profile registered — this takes about 4–5 minutes.<br><br>' +
        'To start: what\'s your <strong>full name</strong>?',
        null, 1600
      );

    } else if (step === 'q1_email') {
      botSay(
        'Good to connect, <strong>' + esc(state.data.name) + '</strong>. ' +
        'What\'s your <strong>email address</strong>? I\'ll send your intake confirmation there.'
      );

    } else if (step === 'q2_role') {
      botSay('What\'s your current <strong>role or designation</strong>?');

    } else if (step === 'q3_education') {
      botSay(
        'Your highest <strong>educational qualification</strong>?' +
        '<span class="adv-hint"> e.g. B.E. Computer Science, MCA, B.Sc. IT</span>'
      );

    } else if (step === 'q4_graduation') {
      botSay('And your <strong>year of graduation</strong>?');

    } else if (step === 'q5_experience') {
      botSay(
        'How many <strong>years of professional experience</strong> do you have?',
        [
          { label: '0–1 year (Fresher)', value: '0–1 years (Fresher)' },
          { label: '1–3 years',          value: '1–3 years'           },
          { label: '3–5 years',          value: '3–5 years'           },
          { label: '5+ years',               value: '5+ years'                },
        ]
      );

    } else if (step === 'q6_stack') {
      botSay(
        'What does your <strong>current tech stack</strong> look like?' +
        '<span class="adv-hint"> Languages, frameworks, databases, cloud tools — list what you work with day-to-day.</span>'
      );

    } else if (step === 'q7_intent') {
      botSay(
        'What\'s your <strong>primary objective</strong> for this programme?',
        [
          { label: 'Role Training',      value: 'Role Training'      },
          { label: 'Interview Training', value: 'Interview Training' },
          { label: 'Both',               value: 'Both'               },
        ]
      );

    } else if (step === 'q8_lead') {
      botSay(
        'How did you come across <strong>NeuArc</strong>?',
        [
          { label: 'Direct — search or social', value: 'Direct'   },
          { label: 'Referral',                       value: 'Referral' },
        ]
      );

    } else if (step === 'q8_referral') {
      botSay('Could you share the <strong>name or contact details</strong> of the person who referred you?');

    } else if (step === 'q9_track') {
      botSay(
        'Which <strong>engineering track</strong> are you targeting?',
        TRACKS.map(function (t) { return { label: t.label, value: t.label }; })
      );

    } else if (step === 'q10_prereqs') {
      var pre = PREREQS[state.data.trackId] || '';
      botSay(
        'The <strong>' + esc(state.data.track) + '</strong> programme operates past introductory syntax by design.<br><br>' +
        '<strong>Required baseline:</strong> <em class="adv-prereq">' + pre + '</em><br><br>' +
        'Confirming you\'re comfortable working at this level — ready to move directly into architecture?',
        [
          { label: 'Yes, I’m ready',           value: 'yes'  },
          { label: 'Not fully / need to check',    value: 'no'   },
        ]
      );

    } else if (step === 'complete') {
      botSay(
        'Thank you. Your engineering profile has been logged and your technical file has been generated. ' +
        'An email confirmation has been sent to <strong>' + esc(state.data.email) + '</strong>.<br><br>' +
        'Your next step is to complete the <strong>10-minute technical evaluation</strong> to lock in your baseline registration. ' +
        'Our team will reach out within 24 hours with your evaluation link.',
        null, 2400
      );
      triggerEmail();
      lockInput();
    }
  }

  /* ─────────────────────────────────────────────────────────────
     EMAIL TRIGGER  —  FormSubmit.co AJAX
     Sends to INTAKE_EMAIL; CC candidate via _cc field.
     _autoresponse sends a confirmation back to the candidate.
  ───────────────────────────────────────────────────────────── */
  function triggerEmail() {
    var d = state.data;
    var payload = {
      _subject:
        '[NeuArc AI Academy] Technical Profile Logged — ' + d.name,
      _cc:          d.email,
      _template:    'table',
      _captcha:     'false',
      _autoresponse:
        'Hi ' + d.name + ', your NeuArc AI Academy engineering profile has been logged. ' +
        'Our team will send your 10-minute technical evaluation link within 24 hours. — NeuArc AI Academy Team',

      /* ── Dossier fields ── */
      '01_Full_Name':          d.name,
      '02_Email':              d.email,
      '03_Education':          d.education + ' (' + d.graduation + ')',
      '04_Designation':        d.role,
      '05_Experience':         d.experience,
      '06_Tech_Stack':         d.stack,
      '07_Target_Track':       d.track,
      '08_Intent_Scope':       d.intent,
      '09_Lead_Source':        d.leadSource || 'Direct',
      '10_Referral':           d.referral   || 'N/A',
      '11_Prereq_Acknowledged': d.prereqAck || 'Confirmed',
    };

    fetch('https://formsubmit.co/ajax/' + INTAKE_EMAIL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body:    JSON.stringify(payload),
    }).catch(function () { /* silent fail — advisor has already shown completion message */ });
  }

  /* ─────────────────────────────────────────────────────────────
     HELPERS
  ───────────────────────────────────────────────────────────── */
  function lockInput() {
    $input.disabled     = true;
    $send.disabled      = true;
    $input.placeholder  = 'Session complete.';
  }

  function isEmail(s) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
  }

  function toTitle(s) {
    return s.replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  /* ─────────────────────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────────────────────── */
  function init() { buildWidget(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
