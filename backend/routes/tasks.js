const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  submitTask,
  getMyTasks
} = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/my-tasks', getMyTasks);
router.get('/', getTasks);
router.post('/', authorize('admin'), createTask);
router.get('/:id', getTask);
router.put('/:id', authorize('admin'), updateTask);
router.delete('/:id', authorize('admin'), deleteTask);
router.put('/:id/submit', submitTask);

module.exports = router;
