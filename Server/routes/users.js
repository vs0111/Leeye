const router = require('express').Router();
const authController = require('../controllers/authController');
const usersController = require('../controllers/usersController');



//  User
router.put('/:id',authController.verifyToken,usersController.updateUserPut);
router.get('/user/:id',usersController.getUser);
router.put('/profile/:id',usersController.updateUserPut);
router.patch('/profile-pic/:id',usersController.updateProfilePic);


// router.get('/search-users',authController.verifyToken,usersController.searchUsers);


module.exports =  router;