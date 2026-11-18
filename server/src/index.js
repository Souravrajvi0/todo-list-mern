require('dotenv').config();
const createApp = require('./app');
const connectDB = require('./config/db');

const app = createApp();
const PORT = process.env.PORT || 5000;

const maybeSeed = async () => {
  if (process.env.SEED_ON_START !== 'true') return;
  const Task = require('./models/Task');
  const count = await Task.countDocuments();
  if (count > 0) return;
  const { getWeekStart } = require('./utils/week');
  const prefillData = require('./constants/prefillData.json');
  const weekStart = getWeekStart(new Date());
  const samples = (prefillData.sampleTasks || []).map((item) => {
    const hour = Number((item.startTime || '10:00').split(':')[0]) || 10;
    const d = new Date(weekStart);
    d.setDate(d.getDate() + (item.dayOffset ?? 0));
    d.setHours(hour, 0, 0, 0);
    return {
      title: item.title,
      description: item.description || '',
      date: d,
      startTime: item.startTime || '',
      endTime: item.endTime || '',
      priority: item.priority || 'Medium',
      status: item.status || 'In Progress',
    };
  });
  await Task.insertMany(samples);
  console.log(`Seeded ${samples.length} sample tasks from prefillData.json`);
};

const start = async () => {
  await connectDB();
  await maybeSeed();
  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
};

start().catch((err) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
