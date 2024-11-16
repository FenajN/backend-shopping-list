const express = require('express');
const router = express.Router();
const addUserIdMiddleware = require('../middlewares/addUserIdMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const shoppingListController = require('../controllers/shoppingListController');

router.post('/', authMiddleware('Owner'), shoppingListController.createShoppingList);

router.get('/:id', authMiddleware('Member'), shoppingListController.getShoppingList);

router.put('/:id', authMiddleware('Owner'), shoppingListController.updateShoppingList);

router.delete('/:id', authMiddleware('Owner'), shoppingListController.deleteShoppingList);

router.put('/:id/items', authMiddleware('Owner'), shoppingListController.updateItems);

router.put('/:id/archive', authMiddleware('Owner'), shoppingListController.archiveList);

router.put('/:id/restore', authMiddleware('Owner'), shoppingListController.restoreList);

module.exports = router;
