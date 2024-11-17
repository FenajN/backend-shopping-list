const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const shoppingListController = require('../controllers/shoppingListController');

router.get('/', authMiddleware(), shoppingListController.getAllShoppingLists);

router.post('/', authMiddleware(), shoppingListController.createShoppingList);

router.get('/:id', authMiddleware(['Member', 'Owner']), shoppingListController.getShoppingList);

router.put('/:id', authMiddleware('Owner'), shoppingListController.updateShoppingList);

router.delete('/:id', authMiddleware('Owner'), shoppingListController.deleteShoppingList);

router.put('/:id/items', authMiddleware('Owner'), shoppingListController.updateItems);

router.put('/:id/archive', authMiddleware('Owner'), shoppingListController.archiveList);

router.put('/:id/restore', authMiddleware('Owner'), shoppingListController.restoreList);

router.delete('/:id/members', authMiddleware(['Owner', 'Member']), shoppingListController.removeMember);

router.post('/:id/members', authMiddleware('Owner'), shoppingListController.addMember);

router.delete("/:id/items/:itemId", authMiddleware(''), shoppingListController.removeItem);

module.exports = router;

