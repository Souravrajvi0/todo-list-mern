const Task = require('../models/Task');
const { startOfDay, endOfDay, getWeekStart, getWeekEnd } = require('../utils/week');

const createTask = async (req, res) => {
  try {
    const { title, description, date, startTime, endTime, priority, status } = req.body;

    if (!title || !date) {
      return res.status(400).json({ message: 'Title and date are required' });
    }

    const task = await Task.create({
      title,
      description: description || '',
      date: new Date(date),
      startTime: startTime || '',
      endTime: endTime || '',
      priority: priority || 'Medium',
      status: status || 'In Progress',
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const { date, weekStart, status } = req.query;
    const filter = {};

    if (date) {
      const d = new Date(date);
      filter.date = { $gte: startOfDay(d), $lte: endOfDay(d) };
    } else if (weekStart) {
      const start = getWeekStart(new Date(weekStart));
      const end = getWeekEnd(start);
      filter.date = { $gte: start, $lte: end };
    }

    if (status) {
      filter.status = status;
    }

    const tasks = await Task.find(filter).sort({ date: 1, startTime: 1, createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.date) updates.date = new Date(updates.date);

    const task = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted', id: task._id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const searchTasks = async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json([]);

    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const tasks = await Task.find({
      $or: [{ title: regex }, { description: regex }],
    }).sort({ date: 1, createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/** Weekly summary cards: open vs completed for a given week (Mon–Sun) */
const getWeeklyStats = async (req, res) => {
  try {
    const ref = req.query.weekStart ? new Date(req.query.weekStart) : new Date();
    const start = getWeekStart(ref);
    const end = getWeekEnd(start);

    const tasks = await Task.find({
      date: { $gte: start, $lte: end },
    });

    const completed = tasks.filter((t) => t.status === 'Completed').length;
    const open = tasks.filter((t) => t.status !== 'Completed').length;
    const total = tasks.length;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

    res.json({
      weekStart: start.toISOString(),
      weekEnd: end.toISOString(),
      completed,
      open,
      total,
      progress,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/** List recent weeks with open/completed counts (for expandable week cards) */
const getWeeksOverview = async (req, res) => {
  try {
    const weeksCount = Math.min(parseInt(req.query.weeks, 10) || 6, 12);
    const now = new Date();
    const currentStart = getWeekStart(now);
    const weeks = [];

    for (let i = 0; i < weeksCount; i++) {
      const start = new Date(currentStart);
      start.setDate(start.getDate() - i * 7);
      const end = getWeekEnd(start);

      const tasks = await Task.find({
        date: { $gte: start, $lte: end },
      }).sort({ date: 1, startTime: 1 });

      const completed = tasks.filter((t) => t.status === 'Completed').length;
      const open = tasks.length - completed;

      weeks.push({
        weekStart: start.toISOString(),
        weekEnd: end.toISOString(),
        label: formatWeekLabel(start, end),
        completed,
        open,
        total: tasks.length,
        progress: tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100),
        tasks,
      });
    }

    res.json(weeks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const formatWeekLabel = (start, end) => {
  const opts = { month: 'short', day: 'numeric' };
  return `${start.toLocaleDateString('en-US', opts)} – ${end.toLocaleDateString('en-US', opts)}`;
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  searchTasks,
  getWeeklyStats,
  getWeeksOverview,
};
