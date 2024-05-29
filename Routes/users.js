const express = require('express');
const { userRegister, userLogin, allUsers, deleteUser, editUser, findUser } = require('../Controllers/users');

const router = express.Router();


router.post('/register',userRegister);

router.post('/login',userLogin);

router.get('/getallusers',allUsers);

router.put('/deleteuser',deleteUser);

router.put('/edituser/:userID',editUser);

router.post('/finduser',findUser)


module.exports={userRouter : router}