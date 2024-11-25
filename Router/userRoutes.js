const express = require('express');
const {registerController,loginController} = require('../Controllers/userControllers') ;

const Router= express.Router();
Router.post('/login',loginController);
Router.post('/register',registerController);

module.exports=Router;