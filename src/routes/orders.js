const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getIncomingOrders, updateOrderStatus, getStats } = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, createOrder);
router.get('/my', authMiddleware, getMyOrders);
router.get('/incoming', authMiddleware, getIncomingOrders);
router.get('/stats', authMiddleware, getStats);
router.put('/:id/status', authMiddleware, updateOrderStatus);

module.exports = router;
