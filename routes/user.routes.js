const express = require('express');

const router = express.Router();
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');

// User Model
const User = require('../model/User');

// @route   POST api/user
// @desc    Register new user
// @access  Public
router.post('/', (req, res) => {
  const { name, email, password, status, avatar, warehouseId, role, phone } = req.body;
  let newAvartar = '';
  // Simple validation
  if (!name || !email || !password) {
    return res.json({
      success: false,
      error: 'Please enter all fields'
    });
  }

  // // Check for existing user
  User.findOne({ email }).then(user => {
    if (user)
      return res.json({
        success: false,
        error: 'User already exists'
      });

    if (!avatar) {
      newAvartar = gravatar.url(email, {
        s: '200',
        r: 'r',
        d: 'mm'
      });
    }

    const newUser = new User({
      name,
      email,
      password,
      status,
      avatar: avatar || newAvartar,
      warehouseId,
      role,
      phone
    });

    // Create salt & hash
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save().then(user => {
          jwt.sign({ user: user }, process.env.SECRET_OR_KEY, (err, token) => {
            res.json({
              success: true,
              message: 'new user created',
              token,
              user
            });
          });
        });
      });
    });
  });
});

router.get('/get', async (req, res) => {
  let name = req.query.name;
  const fillter = { name: { $regex: name, $options: 'i' } }
  const data = await User
    .find(name ? fillter : {})
    .populate('role', 'name -_id');
  res.status(200).json(data)
})

// get detail user
router.get('/detail/:id', async (req, res) => {
  let _id = req.params.id;
  const data = await User
    .find({ _id })
    .populate('role', 'name')
    .populate('warehouseId', 'name');
  res.status(200).json(...data)
})

router.put("/edit/:id", async (req, res) => {
  try {
    const { name, email, password, status, avatar, warehouseId, role, phone } = req.body;
    console.log(req.body);
    const updateData = await User.findOneAndUpdate({ _id: req.params.id }, {
      name,
      email,
      password,
      status,
      avatar: avatar,
      warehouseId,
      role,
      phone
    }, {
      returnOriginal: false
    })
    res.status(200).json(updateData)
  } catch (error) {
    console.log(error);
    res.status(403).json(error)
  }
})

router.delete("/delete/:id", async (req, res) => {
  const params = req.params;
  User.findOneAndDelete({ _id: params.id }, function (error) {
    if (error) {
      // handle error
      res.status(403).send(error);
    } else {
      // document successfully removed
      res.status(200).send('Xóa thành công!')
    }
  });
})



module.exports = router;
