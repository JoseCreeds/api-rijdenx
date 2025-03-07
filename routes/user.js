const express = require('express');
const router = express.Router();

// authMiddlewares
const auth = require('../middleware/auth');
const admin = require('../middleware/isAdmin');
const userCtrl = require('../controllers/user');

// //user controllers
// const {
//     loginUser,
//     signupUser,
//     getUserProfile,
//     updateUserProfile,
//     getUsers,
//     deleteUser,
// } = require("../controllers/userController");

//public routes
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/verify/:uniqueString', userCtrl.verifyEmail);
// router.get('/verify/:uniqueString', userCtrl.verifyEmail);
router.get('/', auth, userCtrl.getUsers); //To verify if user loged in

// protectedRoutes
router.get('/profile', auth, userCtrl.getUserProfile);
router.put('/profile', auth, userCtrl.updateUserProfile);

// admin only routes
router.get('/users', auth, admin, userCtrl.getUsers);
router.post('/user/:id', auth, admin, userCtrl.creditUserAccount); //crdit user account
// router.delete('/:userId', auth, admin, userCtrl.deleteUser);
router.delete('/:userId', auth, admin, userCtrl.deleteUser);
// to delete all users
router.delete('/', auth, admin, userCtrl.deleteAllUsers);

module.exports = router;
