const { json } = require("body-parser");
const User = require("../models/user");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

exports.signin = (req, res) => {
  const { email, password } = req.body;

  //Check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }
  console.log(email);
  User.findOne({email}, (err, userjson) => {
    console.log(err);
    console.log(userjson);
    if (err || userjson===null) {
      return res.status(400).json({
        error: "The email provided doesn't exist",
      });
    }

    if (!userjson.authenticate(password)) {
      return res.status(400).json({
        error: "Password does not match",
      });
    }

    const token = jwt.sign({ _id: userjson._id }, process.env.SECRET);
    //put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    //send response to frontend
    const { _id, name, email, role } = userjson;
    return res.json({ token, user: { _id, name, email, role } });
  });
};

exports.signup = (req, res) => {
  //Check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  //Create User
  const user = new User(req.body);
  user.save((err, userjson) => {
    if (err) {
      return res.status(400).json({
        err: "Bad request",
      });
    }
    if (json) {
      res.json({
        name: userjson.name,
        email: userjson.email,
        id: userjson._id,
      });
    }
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signed out",
  });
};

//Token authorization route controller
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});

exports.authenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "You are not admin. ACCESS DENIED",
    });
  }
  next();
};
