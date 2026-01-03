const express = require('express');
const router = express.Router();
const {
  getAllFeedback,
  getFeedback,
  createFeedback,
  updateFeedback,
  deleteFeedback,
  getInternFeedback
} = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', getAllFeedback);
router.post('/', authorize('admin'), createFeedback);
router.get('/intern/:internId', getInternFeedback);
router.get('/:id', getFeedback);
router.put('/:id', authorize('admin'), updateFeedback);
router.delete('/:id', authorize('admin'), deleteFeedback);

module.exports = router;
