const express = require('express');
const router = express.Router();
const { getSuppliers, getSupplierById, getMySupplier, updateMySupplier } = require('../controllers/supplierController');
const authMiddleware = require('../middleware/auth');

router.get('/', getSuppliers);
router.get('/my', authMiddleware, getMySupplier);
router.put('/my', authMiddleware, updateMySupplier);
router.get('/:id', getSupplierById);

module.exports = router;
