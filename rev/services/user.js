const express = require('express');
const router = express.Router();
const userModel = require('../models/user');
const db = require('../singletons/db')
const { userLogger } = require('../singletons/logger')
const uuid = require('../thirdParty/uuid')
const { encrypt , decrypt } = require('../thirdParty/bcrypt')
const {info,error} = require('../thirdParty/log')

let file = "[services/user.js]"

async function checkUserExist(user){
  let [response,err] = await db.get('users','email',user.email)
  if(!response && !err){
    return false;
  }
  return true
}

// CREATE a new user
router.post('/user/signup', async (req, res) => {
  try {
    const user = {...req.body,id: uuid()}
    if(!user.email || !user.password || !user.name) {
      throw new Error('all field is require')
    }
    user.password = encrypt(user.password)
    info(file,user)
    let checkUser = await checkUserExist(user)
    if(checkUser){
      throw new Error('user already exist ')
    }
    let [response,err] = await db.create('users', user);
    if(err){
      throw new Error(err)
    }
    return res.status(200).json({
      status: 200,
      Response : response.key
    })
  } catch (err) {
    error(file,err)
    return res.status(400).json({
      status: 400,
      Error : err.toString()
    })
  }
});

// login a user
router.post('/user/login', async (req, res) => {
  try {
    let user  = req.body
    if(!user.email || !user.password) {
      throw new Error('all field is require')
    }
    let [response,err] = await db.get('users','email',user.email)
    if(err){
      throw new Error(err)
    }
    const userDetails = Object.values(response)[0]
    if(!decrypt(user.password,userDetails.password)){
      throw new Error('password is wrong')
    }
    return res.status(200).json({
      status: 200,
      Response : Object.keys(response)[0]
    })
  } catch (err) {
    error(file,err)
    return res.status(400).json({
      status: 400,
      Response : err.toString()
    })
  }
});

// UPDATE a user by ID
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.body;
    const [result,err] = await db.update(`users/${id}`, user);
    if (result === null || err) {
      throw new Error('User not found or db error')
    }
    return res.status(200).json({
      status: 200,
      Response : 'Updated successfully'
    })
  } catch (err) {
    error(file,err)
    return res.status(400).json({
      status: 400,
      Response : err.toString()
    })
  }
});

module.exports = router;
