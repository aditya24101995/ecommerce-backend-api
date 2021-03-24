const express = require("express");
const router = express.Router();
const { signup, signin, signout } = require("../controllers/auth");
const { check, validationResult } = require("express-validator");

router.post(
  "/signin",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password is required of minimum 3 characters").isLength({min:3})
  ],
  signin
);

//Signup
router.post(
  "/signup",
  [
    check("name", "Name should have atleast 3 characters").isLength({ min: 3 }),
    check("email", "Email is required").isEmail(),
    check("password", "Password should have atleast 3 characters").isLength({
      min: 3,
    }),
  ],
  signup
);

//Signout
router.get("/signout", signout);

//Authorization


module.exports = router;
