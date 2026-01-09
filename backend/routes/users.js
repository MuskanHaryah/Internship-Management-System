const express = require('express');
const router = express.Router();
const { 
  getAllUsers, 
  getUser, 
  createUser,
  updateUser, 
  deleteUser,
  getInterns,
  getAdmins 
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// Protect all routes
router.use(protect);

router.get('/', authorize('admin'), getAllUsers);
router.post('/', authorize('admin'), createUser);
router.get('/interns', authorize('admin'), getInterns);
router.get('/admins', authorize('admin'), getAdmins);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;
