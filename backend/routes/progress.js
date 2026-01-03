const express = require('express');
const router = express.Router();
const {
  getProgress,
  createProgress,
  updateProgress,
  getTaskProgress,
  getInternProgress
} = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getProgress);
router.post('/', createProgress);
router.put('/:id', updateProgress);
router.get('/task/:taskId', getTaskProgress);
router.get('/intern/:internId', getInternProgress);

module.exports = router;
