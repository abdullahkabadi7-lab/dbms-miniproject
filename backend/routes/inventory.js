const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

router.get('/', inventoryController.getInventory);
router.put('/:productId', inventoryController.updateInventory);

module.exports = router;
