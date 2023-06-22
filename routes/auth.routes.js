/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const express = require('express');

const router = express.Router();
const bcrypt = require('bcryptjs');
// User Model
const jwt = require('jsonwebtoken');
const User = require('../model/User');

const auth = require('../middleware/auth');
const Role = require('../model/Role');
const Permission = require('../model/Permission');

// @route   POST api/auth
// @desc    Auth user
// @access  Public
// eslint-disable-next-line consistent-return
router.post('/', async (req, res) => {
  const { email, password } = req.body;
  //  Simple validation
  if (!email || !password) {
    return res.json({
      success: false,
      error: 'Please enter all fields'
    });
  }

  // Check for existing user
  const user = await User.findOne({ email }).populate('warehouseId', 'name')
  if (!user)
    return res.json({
      success: false,
      error: 'Lỗi đăng nhập bạn cần nhập đúng mật khẩu và email'
    });
  let dataPermis = []
  const RoleData = await Role.find({ _id: user.role })
  await Permission.find({
    _id: { $in: RoleData[0].permissions }
  }, 'name -_id', function (err, docs) {
    if (err) return;
    dataPermis = docs.map(item => item.name)
  });

  if (user.status) {
    // Validate password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (!isMatch)
        return res.json({
          success: false,
          error: 'Invalid credentials'
        });
      jwt.sign(
        {
          id: user._id,
          expiresIn: '7d',
          roles: dataPermis
        },
        process.env.SECRET_OR_KEY,
        (err, token) => {
          res.json({
            success: true,
            message: 'User logged in',
            token,
            user
          });
        }
      );
    });
  } else {
    return res.json({
      success: false,
      error: 'Tài khoản đã bị tạm dừng'
    });
  }
});

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'User has been authenticated',
      user: req.user
    });
  } catch (error) {
    res.json({ success: false, error });
  }
});

// @route   GET api/auth/logout
// @desc    logout
// @access  Private
router.post('/logout', auth, async (req, res) => {
  try {
    req.user.status = 'off';
    req.user.save();
    res.json({
      success: true,
      message: 'User has been  logout'
    });
  } catch (error) {
    res.json({ success: false, error });
  }
});

module.exports = router;
