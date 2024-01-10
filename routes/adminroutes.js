const express = require('express');
const {protect} = require("../middleware/authMiddleware")
const {registerUser, 
    loginUser, 
    resetPassword,
    updateUser,
    deleteAccount,
    updateProfile,
    getUser,getAllusers,
    updateOne,
    upadateOneprofile,
    deleteOne,
    getoneUser
} = require("../controller/adminController")

const router = express.Router()

router.get('/',protect,getAllusers);
router.post('/register', registerUser);
router.post('/login',loginUser);
router.put('/update',protect,updateUser);
router.put('/reset-pass',protect,resetPassword)
router.put('/update-profile',protect,updateProfile);
router.delete('/delete-account',protect,deleteAccount);
router.get('/admin-profile',protect,getUser);
router.get('/:id', protect,getoneUser)
router.put('/update-one/:id', protect, updateOne);
router.put('/update-one-profile/:id',protect,upadateOneprofile)
router.delete('/deleteone/:id',protect,deleteOne)

module.exports = router