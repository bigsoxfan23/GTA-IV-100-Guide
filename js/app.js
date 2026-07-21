import { loadTimelineData } from './data-loader.js';

/* -----------------------------
   App State
----------------------------- */

const KEY = 'gtaiv-companion-v2';

let DATA = [];

function loadSavedState() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch (error) {
    console.error('Saved progress could not be read.', error);
    return {};
  }
}

let state = loadSavedState();
let hideDone = false;
let allCollapsed = false;


/* -----------------------------
   Helpers
----------------------------- */

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function item(raw) {
  if (Array.isArray(raw)) {
    return {
      name: raw[0],
      type: '',
      tag: raw[1] || '',
      tone: raw[2] || '',
      timelineId: ''
    };
  }

  if (raw && typeof raw === 'object') {
    return {
      name: raw.name || '',
      type: raw.type || '',
      tag: raw.tag || '',
      tone: raw.tone || '',
      timelineId: raw.timelineId || ''
    };
  }

  return {
    name: String(raw || ''),
    type: '',
    tag: '',
    tone: '',
    timelineId: ''
  };
}

function id(sec, group, i, name, timelineId = '') {
  if (timelineId) {
    return timelineId;
  }

  return `${sec}|${group}|${i}|${String(name).slice(0, 90)}`;
}

function pct(a, b) {
  return b ? Math.round((a / b) * 100) : 0;
}


/* -----------------------------
   Render
----------------------------- */

function renderTabs() {
  const tabs = $('#tabs');

  tabs.innerHTML = DATA
    .map(s => `<a class="tab" href="#${s.id}">${s.tab}</a>`)
    .join('');
}

function render() {
  const app = $('#app');
  app.innerHTML = '';

  DATA.forEach(sec => {
    const tasks = sec.groups.flatMap(g =>
      g.items.map((raw, i) => ({
        group: g.name,
        i,
        ...item(raw)
      }))
    );

    const done = tasks.filter(t =>
      state[id(sec.id, t.group, t.i, t.name, t.timelineId)]
    ).length;

    const el = document.createElement('section');
    el.className = 'section';
    el.id = sec.id;

    el.innerHTML = `
      <button class="sectionHeader" data-toggle="${sec.id}">
        <div>
          <h3>${sec.title}</h3>
          <p>${sec.desc}</p>
        </div>

        <div>
          <div class="sectionPct">${pct(done, tasks.length)}%</div>
          <div class="chev">⌄</div>
        </div>
      </button>

      <div class="body">
        ${sec.note ? `<div class="note"><b>Note:</b> ${sec.note}</div>` : ''}
      </div>
    `;

    const body = el.querySelector('.body');

    sec.groups.forEach(g => {
      const group = document.createElement('div');
      group.className = 'group';

      const gTasks = g.items.map((raw, i) => ({
        i,
        ...item(raw)
      }));

      const gd = gTasks.filter(t =>
        state[id(sec.id, g.name, t.i, t.name, t.timelineId)]
      ).length;

      group.innerHTML = `
        <div class="groupTitle">
          <span>${g.name}</span>
          <span>${gd}/${g.items.length}</span>
        </div>
      `;

      g.items.forEach((raw, i) => {
        const it = item(raw);
        const tid = id(sec.id, g.name, i, it.name, it.timelineId);
        const checked = !!state[tid];

        const task = document.createElement('label');
        task.className = `task ${checked ? 'done' : ''}`;
        task.dataset.text =
          `${it.name} ${it.tag} ${it.type} ${g.name} ${sec.title}`.toLowerCase();

        task.innerHTML = `
          <input
            type="checkbox"
            ${checked ? 'checked' : ''}
            data-id="${encodeURIComponent(tid)}"
          >

          <div>
            <div class="name">${it.name}</div>
           <div class="detail">${it.type || g.name}</div>
          </div>

          ${it.tag ? `<span class="badge ${it.tone}">${it.tag}</span>` : ''}
        `;

        group.appendChild(task);
      });

      body.appendChild(group);
    });

    app.appendChild(el);
  });

  bind();
  update();
  filter();
}


/* -----------------------------
   Events
----------------------------- */

function bind() {
  $$('input[type=checkbox][data-id]').forEach(cb => {
    cb.onchange = e => {
      const k = decodeURIComponent(e.target.dataset.id);

      if (e.target.checked) {
        state[k] = 1;
      } else {
        delete state[k];
      }

      localStorage.setItem(KEY, JSON.stringify(state));

      e.target.closest('.task').classList.toggle('done', e.target.checked);

      update();
      filter(false);
      toast('Saved');
    };
  });

  $$('.sectionHeader').forEach(b => {
    b.onclick = () => b.closest('.section').classList.toggle('collapsed');
  });
}


/* -----------------------------
   Updates
----------------------------- */

function update() {
  const boxes = $$('input[type=checkbox][data-id]');
  const done = boxes.filter(b => b.checked).length;

  $('#bigPct').textContent = pct(done, boxes.length) + '%';
  $('#topMeter').style.width = pct(done, boxes.length) + '%';
  $('#statDone').textContent = done;
  $('#statLeft').textContent = boxes.length - done;

  const story = $$('#phase1 input, #phase2 input, #phase3 input, #phase4 input, #phase5 input');
  $('#statStory').textContent = pct(story.filter(b => b.checked).length, story.length) + '%';

  const side = $$('#side input, #collectibles input, #friends input');
  $('#statSide').textContent = pct(side.filter(b => b.checked).length, side.length) + '%';

  $$('.section').forEach(sec => {
    const boxes = [...sec.querySelectorAll('input[type=checkbox][data-id]')];
    const d = boxes.filter(b => b.checked).length;

    const sp = sec.querySelector('.sectionPct');

    if (sp) {
      sp.textContent = pct(d, boxes.length) + '%';
    }

    sec.querySelectorAll('.group').forEach(g => {
      const b = [...g.querySelectorAll('input[type=checkbox]')];
      const d = b.filter(x => x.checked).length;
      const gt = g.querySelector('.groupTitle span:last-child');

      if (gt) {
        gt.textContent = `${d}/${b.length}`;
      }
    });
  });
}

function filter() {
  const q = $('#search').value.trim().toLowerCase();

  $$('.task').forEach(t => {
    const hide =
      (!!q && !t.dataset.text.includes(q)) ||
      (hideDone && t.classList.contains('done'));

    t.classList.toggle('hidden', hide);
  });

  $$('.section').forEach(s => {
    s.classList.toggle(
      'hidden',
      !!q && !s.querySelector('.task:not(.hidden)')
    );
  });
}

function toast(msg) {
  const t = $('#toast');

  t.textContent = msg;
  t.style.display = 'block';

  clearTimeout(window.__toast);

  window.__toast = setTimeout(() => {
    t.style.display = 'none';
  }, 1100);
}


/* -----------------------------
   Controls
----------------------------- */

$('#search').oninput = filter;

$('#hideDone').onclick = () => {
  hideDone = !hideDone;
  $('#hideDone').textContent = hideDone ? 'Show Completed' : 'Hide Completed';
  filter();
};

$('#collapseAll').onclick = () => {
  allCollapsed = !allCollapsed;

  $$('.section').forEach(s => {
    s.classList.toggle('collapsed', allCollapsed);
  });

  $('#collapseAll').textContent = allCollapsed ? 'Expand' : 'Collapse';
};

$('#resetBtn').onclick = () => {
  if (confirm('Reset every checkbox?')) {
    state = {};
    localStorage.removeItem(KEY);
    render();
    toast('Reset');
  }
};

$('#exportBtn').onclick = () => {
  const blob = new Blob([
    JSON.stringify({
      app: 'GTA IV Companion',
      version: 2,
      exportedAt: new Date().toISOString(),
      state
    }, null, 2)
  ], {
    type: 'application/json'
  });

  const a = document.createElement('a');

  a.href = URL.createObjectURL(blob);
  a.download = 'gta-iv-companion-save.json';
  a.click();

  URL.revokeObjectURL(a.href);
};

$('#importFile').onchange = e => {
  const f = e.target.files[0];

  if (!f) return;

  const r = new FileReader();

  r.onload = () => {
    try {
      const obj = JSON.parse(r.result);

      state = obj.state || obj;

      localStorage.setItem(KEY, JSON.stringify(state));
      render();
      toast('Imported');
    } catch {
      alert('Could not import that save file.');
    }
  };

  r.readAsText(f);
};

$('#toTop').onclick = () => {
  scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

$('#nextTask').onclick = () => {
  const next = $$('.task:not(.hidden) input[type=checkbox]')
    .find(b => !b.checked);

  if (next) {
    next.closest('.task').scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }
};


/* -----------------------------
   Init
----------------------------- */

async function init() {
  try {
    DATA = await loadTimelineData();

    renderTabs();
    render();
  } catch (error) {
    console.error('App initialization failed.', error);
  }
}

init();