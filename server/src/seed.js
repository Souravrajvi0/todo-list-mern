require('dotenv').config();
const connectDB = require('./config/db');
const Task = require('./models/Task');
const { getWeekStart } = require('./utils/week');
const prefillData = require('./constants/prefillData.json');

const buildSamples = () => {
  const weekStart = getWeekStart(new Date());
  return (prefillData.sampleTasks || []).map((item) => {
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
};

const seed = async () => {
  await connectDB();
  await Task.deleteMany({});

  const samples = buildSamples();
  await Task.insertMany(samples);
  console.log(`Seeded ${samples.length} tasks from constants/prefillData.json`);
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
