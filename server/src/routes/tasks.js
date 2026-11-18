const express = require('express');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  searchTasks,
  getWeeklyStats,
  getWeeksOverview,
} = require('../controllers/taskController');

const router = express.Router();

router.get('/search', searchTasks);
router.get('/stats/week', getWeeklyStats);
router.get('/stats/weeks', getWeeksOverview);
router.route('/').get(getTasks).post(createTask);
router.route('/:id').get(getTaskById).put(updateTask).delete(deleteTask);

module.exports = router;
