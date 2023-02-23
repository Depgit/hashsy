const express = require('express');
const router = express.Router();
const db = require('../singletons/db')
const uuid = require('../thirdParty/uuid')
const { encrypt, decrypt } = require('../thirdParty/bcrypt')
const logger = require('logger-line-number')
const verifyToken = require('../middlewares/verifyToken');
const jwt = require('jsonwebtoken');
const SecretKey = require('../config.json').SecretKey

let file = "[services/user.js]"
let DB_NAME = 'users'

async function checkUserExist(user) {
  let [response, err] = await db.get(DB_NAME, 'email', user.email)
  if (!response && !err) {
    return false;
  }
  return true
}

// CREATE a new user
router.post('/user/signup', async (req, res) => {
  try {
    const user = { ...req.body, id: uuid() }
    if (!user.email || !user.password || !user.name) {
      throw new Error('all field is require')
    }
    user.password = encrypt(user.password)
    let checkUser = await checkUserExist(user)
    if (checkUser) {
      throw new Error('user already exist ')
    }
    const token = jwt.sign(user, SecretKey.JWT_KEY);
    res.cookie('uToken', token);
    res.setHeader('Authorization', `Bearer ${token}`);
    let [response, err] = await db.create(DB_NAME, user);
    if (err) {
      throw new Error(err)
    }
    return res.status(200).json({
      status: 200,
      Response: response.key
    })
  } catch (err) {
    logger.log(file, user)
    return res.status(400).json({
      status: 400,
      Error: err.toString()
    })
  }
});

// login a user
router.post('/user/login', async (req, res) => {
  try {
    let user = req.body
    if (!user.email || !user.password) {
      throw new Error('all field is require')
    }
    let [response, err] = await db.get(DB_NAME, 'email', user.email)
    if (err || !response) {
      throw new Error(`either err ${err} occur or user not exist`)
    }
    const userDetails = Object.values(response)[0]
    if (!decrypt(user.password, userDetails.password)) {
      throw new Error('password is wrong')
    }
    const token = jwt.sign(userDetails, SecretKey.JWT_KEY);
    res.cookie('uToken', token);
    res.setHeader('Authorization', `Bearer ${token}`);
    return res.status(200).json({
      status: 200,
      Response: Object.keys(response)[0]
    })
  } catch (err) {
    logger.log(file, err)
    return res.status(400).json({
      status: 400,
      Response: err.toString()
    })
  }
});

// UPDATE a user by ID
router.put('/users/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.body;
    const [result, err] = await db.update(`${DB_NAME}/${id}`, user);
    if (result === null || err) {
      throw new Error('User not found or db error')
    }
    return res.status(200).json({
      status: 200,
      Response: 'Updated successfully'
    })
  } catch (err) {
    logger.log(file, err)
    return res.status(400).json({
      status: 400,
      Response: err.toString()
    })
  }
});

// Logout user
router.get('/user/logout', verifyToken, async (req, res) => {
  try {
    res.clearCookie('uToken');
    return res.status(200).json({
      status: 200,
      Response: 'User logged out successfully'
    })
  } catch (err) {
    logger.log(file, err)
    return res.status(400).json({
      status: 400,
      Response: err.toString()
    })
  }
});


module.exports = router;
