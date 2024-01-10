const express = require('express');
const {protect} = require("../middleware/authMiddleware")
const {registerUser, 
    loginUser, 
    resetPassword,
    updateUser,
    deleteAccount,
    updateProfile,getUser
} = require("../controller/userController")

const router = express.Router()

router.get('/',protect,getUser);
router.post('/register', registerUser);
router.post('/login',loginUser);
router.put('/update',protect,updateUser)
router.put('/reset-pass',protect,resetPassword)
router.put('/update-profile',protect,updateProfile),
router.delete('/delete-account',protect,deleteAccount)

module.exports = router