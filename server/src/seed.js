require('dotenv').config();
const connectDB = require('./config/db');
const Task = require('./models/Task');
const { getWeekStart } = require('./utils/week');

const seed = async () => {
  await connectDB();
  await Task.deleteMany({});

  const weekStart = getWeekStart(new Date());
  const day = (offset, hour = 10) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + offset);
    d.setHours(hour, 0, 0, 0);
    return d;
  };

  const samples = [
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
    {
      title: 'Doing Homework',
      description: 'Math assignment chapter 4',
      date: day(4, 16),
      startTime: '16:00',
      endTime: '18:00',
      priority: 'High',
      status: 'In Progress',
    },
    {
      title: 'Finish report draft',
      description: 'Weekly status report',
      date: day(1, 10),
      startTime: '10:00',
      endTime: '12:00',
      priority: 'Medium',
      status: 'Completed',
    },
    {
      title: 'Gym session',
      description: '',
      date: day(3, 7),
      startTime: '07:00',
      endTime: '08:00',
      priority: 'Low',
      status: 'In Progress',
    },
  ];

  await Task.insertMany(samples);
  console.log(`Seeded ${samples.length} tasks`);
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
