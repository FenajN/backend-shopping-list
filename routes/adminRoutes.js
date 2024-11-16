const express = require('express');
const router = express.Router();
const addUserIdMiddleware = require('../middlewares/addUserIdMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const adminController = require('../controllers/adminController');

router.get('/lists', authMiddleware('Admin'), adminController.getAllLists);

router.delete('/user/:id', authMiddleware('Admin'), adminController.deleteUser);

router.delete('/owner/:id', authMiddleware('Admin'), adminController.deleteOwner);

module.exports = router;
