const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');


router.get('/lists', authMiddleware('Member'), userController.getUserLists);

router.delete('/remove/:id', authMiddleware('Member'), userController.removeSelfFromList);

router.get("/search", authMiddleware(), userController.searchUsers);

module.exports = router;
