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
  const weekStart = getWeekStart(new Date());
  const day = (offset, hour = 10) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + offset);
    d.setHours(hour, 0, 0, 0);
    return d;
  };
  await Task.insertMany([
    {
      title: 'Finishing Wireframe',
      description: 'Complete the mobile wireframes for review',
      date: day(2, 9),
      startTime: '09:00',
      endTime: '11:00',
      priority: 'High',
      status: 'In Progress',
    },
    {
      title: 'Meeting with team',
      description: 'Sprint planning sync',
      date: day(2, 14),
      startTime: '14:00',
      endTime: '15:00',
      priority: 'Medium',
      status: 'In Progress',
    },
    {
      title: 'Buy a cat food',
      description: 'Grocery run',
      date: day(2, 18),
      startTime: '18:00',
      endTime: '18:30',
      priority: 'Low',
      status: 'Completed',
    },
  ]);
  console.log('Seeded sample tasks');
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
