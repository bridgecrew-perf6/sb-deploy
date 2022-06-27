const User = require('../models/UserModel');

const userController = {};

userController.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return next({
        log: 'User provided username and/or password is not valid.',
        status: 401,
        message: { err: 'User provided username and/or password is not valid.' },
      });
    const response = await User.find({ username, password });
    if (!response.length)
      return next({
        log: 'Username not found',
        status: 401,
        message: { err: 'Error in the userController.login middleware' },
      });
    console.log(response);
    return next();
  } catch (err) {
    console.error(err);
    return next({
      log: 'Error occured in userController.login middleware.',
      status: 401,
      message: { err: err.msg },
    });
  }
};

userController.signup = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const nameCheck = await User.find({ username });
    if (nameCheck.length > 0)
      return next({
        log: 'Error signing up.',
        status: 401,
        message: { err: 'Error signing up' },
      });
    const response = await User.create({ username, password });
    console.log(response);
    return next();
  } catch (err) {
    console.error(err);
    return next({
      log: 'Error occured in userController.signup middleware.',
      status: 400,
      message: { err: err.msg },
    });
  }
};

module.exports = userController;
