/**
 * Netlify Functions API — same contract as server/ (Express + MongoDB).
 * Uses an in-process store so the SPA works on Netlify without a separate host.
 * For persistent MongoDB, run `server/` on Render/Railway with MONGODB_URI (Atlas).
 */

const { randomUUID } = require('crypto');

const startOfDay = (d) => {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
};

const endOfDay = (d) => {
  const date = new Date(d);
  date.setHours(23, 59, 59, 999);
  return date;
};

const getWeekStart = (date = new Date()) => {
  const d = startOfDay(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
};

const getWeekEnd = (date = new Date()) => {
  const start = getWeekStart(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return endOfDay(end);
};

const formatWeekLabel = (start, end) => {
  const opts = { month: 'short', day: 'numeric' };
  return `${start.toLocaleDateString('en-US', opts)} – ${end.toLocaleDateString('en-US', opts)}`;
};

const store = () => {
  if (!globalThis.__todoStore) {
    globalThis.__todoStore = { tasks: [], seeded: false };
  }
  return globalThis.__todoStore;
};

const seedIfNeeded = () => {
  const s = store();
  if (s.seeded && s.tasks.length) return;
  // Prefill seed tasks from shared constants JSON
  const prefillData = require('./prefillData.json');
  const weekStart = getWeekStart(new Date());
  const now = new Date().toISOString();
  s.tasks = (prefillData.sampleTasks || []).map((item) => {
    const hour = Number((item.startTime || '10:00').split(':')[0]) || 10;
    const d = new Date(weekStart);
    d.setDate(d.getDate() + (item.dayOffset ?? 0));
    d.setHours(hour, 0, 0, 0);
    return {
      _id: randomUUID(),
      title: item.title,
      description: item.description || '',
      date: d.toISOString(),
      startTime: item.startTime || '',
      endTime: item.endTime || '',
      priority: item.priority || 'Medium',
      status: item.status || 'In Progress',
      createdAt: now,
      updatedAt: now,
    };
  });
  s.seeded = true;
};

const json = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  },
  body: JSON.stringify(body),
});

const parseBody = (event) => {
  if (!event.body) return {};
  try {
    return JSON.parse(event.isBase64Encoded
      ? Buffer.from(event.body, 'base64').toString('utf8')
      : event.body);
  } catch {
    return {};
  }
};

const pathOf = (event) => {
  const raw = event.path || '';
  // "/.netlify/functions/api/tasks" or "/api/tasks"
  return raw
    .replace(/^\/\.netlify\/functions\/api/, '')
    .replace(/^\/api/, '') || '/';
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return json(204, {});
  }

  seedIfNeeded();
  const method = event.httpMethod;
  const path = pathOf(event);
  const qs = event.queryStringParameters || {};
  const tasks = store().tasks;

  if (method === 'GET' && (path === '/' || path === '/health' || path === '')) {
    if (path === '/health' || path === '') {
      // health is /api/health → path /health after strip; empty may be /api
    }
  }

  if (method === 'GET' && path === '/health') {
    return json(200, { status: 'ok', service: 'todo-list-api' });
  }

  // GET /tasks/search
  if (method === 'GET' && path === '/tasks/search') {
    const q = (qs.q || '').trim();
    if (!q) return json(200, []);
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const results = tasks.filter((t) => rx.test(t.title) || rx.test(t.description || ''));
    return json(200, results);
  }

  // GET /tasks/stats/week
  if (method === 'GET' && path === '/tasks/stats/week') {
    const ref = qs.weekStart ? new Date(qs.weekStart) : new Date();
    const start = getWeekStart(ref);
    const end = getWeekEnd(start);
    const weekTasks = tasks.filter((t) => {
      const d = new Date(t.date);
      return d >= start && d <= end;
    });
    const completed = weekTasks.filter((t) => t.status === 'Completed').length;
    const open = weekTasks.length - completed;
    return json(200, {
      weekStart: start.toISOString(),
      weekEnd: end.toISOString(),
      completed,
      open,
      total: weekTasks.length,
      progress: weekTasks.length === 0 ? 0 : Math.round((completed / weekTasks.length) * 100),
      tasks: weekTasks,
    });
  }

  // GET /tasks/stats/weeks
  if (method === 'GET' && path === '/tasks/stats/weeks') {
    const weeksCount = Math.min(parseInt(qs.weeks, 10) || 6, 12);
    const currentStart = getWeekStart(new Date());
    const weeks = [];
    for (let i = 0; i < weeksCount; i++) {
      const start = new Date(currentStart);
      start.setDate(start.getDate() - i * 7);
      const end = getWeekEnd(start);
      const weekTasks = tasks.filter((t) => {
        const d = new Date(t.date);
        return d >= start && d <= end;
      });
      const completed = weekTasks.filter((t) => t.status === 'Completed').length;
      weeks.push({
        weekStart: start.toISOString(),
        weekEnd: end.toISOString(),
        label: formatWeekLabel(start, end),
        completed,
        open: weekTasks.length - completed,
        total: weekTasks.length,
        progress: weekTasks.length === 0 ? 0 : Math.round((completed / weekTasks.length) * 100),
        tasks: weekTasks,
      });
    }
    return json(200, weeks);
  }

  // GET /tasks
  if (method === 'GET' && path === '/tasks') {
    let list = [...tasks];
    if (qs.date) {
      const d = new Date(qs.date);
      const a = startOfDay(d);
      const b = endOfDay(d);
      list = list.filter((t) => {
        const x = new Date(t.date);
        return x >= a && x <= b;
      });
    } else if (qs.weekStart) {
      const start = getWeekStart(new Date(qs.weekStart));
      const end = getWeekEnd(start);
      list = list.filter((t) => {
        const x = new Date(t.date);
        return x >= start && x <= end;
      });
    }
    if (qs.status) list = list.filter((t) => t.status === qs.status);
    list.sort((a, b) => new Date(a.date) - new Date(b.date));
    return json(200, list);
  }

  // POST /tasks
  if (method === 'POST' && path === '/tasks') {
    const body = parseBody(event);
    if (!body.title || !body.date) {
      return json(400, { message: 'Title and date are required' });
    }
    const now = new Date().toISOString();
    const task = {
      _id: randomUUID(),
      title: String(body.title).trim(),
      description: body.description || '',
      date: new Date(body.date).toISOString(),
      startTime: body.startTime || '',
      endTime: body.endTime || '',
      priority: body.priority || 'Medium',
      status: body.status || 'In Progress',
      createdAt: now,
      updatedAt: now,
    };
    tasks.push(task);
    return json(201, task);
  }

  // /tasks/:id
  const idMatch = path.match(/^\/tasks\/([^/]+)$/);
  if (idMatch) {
    const id = idMatch[1];
    const idx = tasks.findIndex((t) => t._id === id);

    if (method === 'GET') {
      if (idx < 0) return json(404, { message: 'Task not found' });
      return json(200, tasks[idx]);
    }

    if (method === 'PUT') {
      if (idx < 0) return json(404, { message: 'Task not found' });
      const body = parseBody(event);
      const prev = tasks[idx];
      const updated = {
        ...prev,
        ...body,
        _id: prev._id,
        date: body.date ? new Date(body.date).toISOString() : prev.date,
        updatedAt: new Date().toISOString(),
      };
      tasks[idx] = updated;
      return json(200, updated);
    }

    if (method === 'DELETE') {
      if (idx < 0) return json(404, { message: 'Task not found' });
      const [removed] = tasks.splice(idx, 1);
      return json(200, { message: 'Task deleted', id: removed._id });
    }
  }

  return json(404, { message: `Not found: ${method} ${path}` });
};
