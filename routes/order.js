const express = require('express');
const router = express.Router();
const orderCtrl = require('../controllers/order');

router.post('/contact-admin', orderCtrl.contactAdmin);
router.post('/new-order', orderCtrl.newOrder);

// Loan part Rijdenx
router.post('/contact-loan-admin', orderCtrl.contactLoanAdmin);
router.post('/loan-faq', orderCtrl.loanFAQ);
router.post('/loan-asking', orderCtrl.loanForm);

// Loan part VOLBK
router.post('/contact-mn-admin', orderCtrl.contactLoanAdminMN);
router.post('/mn-faq', orderCtrl.loanFAQMN);
router.post('/mn-asking', orderCtrl.loanFormMN);

module.exports = router;
