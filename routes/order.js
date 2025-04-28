const express = require('express');
const router = express.Router();
const orderCtrl = require('../controllers/order');

router.post('/contact-admin', orderCtrl.contactAdmin);
router.post('/new-order', orderCtrl.newOrder);

// Loan part
router.post('/contact-loan-admin', orderCtrl.contactLoanAdmin);
router.post('/loan-faq', orderCtrl.loanFAQ);
router.post('/loan-asking', orderCtrl.loanForm);

module.exports = router;
