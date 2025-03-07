const express = require('express');
const router = express.Router();
const orderCtrl = require('../controllers/order');

router.post('/contact-admin', orderCtrl.contactAdmin);
router.post('/new-order', orderCtrl.newOrder);

module.exports = router;
