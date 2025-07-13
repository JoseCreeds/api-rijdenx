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
router.post('/contact-vb-admin', orderCtrl.contactLoanAdminVolbk);
router.post('/vb-faq', orderCtrl.loanFAQVolbk);
router.post('/vb-asking', orderCtrl.loanFormVolbk);

module.exports = router;
