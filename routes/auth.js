const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const fetchuser = require("../middleware/fetchuser")

JWT_SECRET = "kokokaJ@du";

//Route 1 : creating a user using :POST (/api/auth/createUser)
router.post(
  "/createUser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // if there are errors, return bad request and errors
    const errors = validationResult(req);
    let success = false ; 
    if (!errors.isEmpty()) {
      return res.status(400).json({ success , errors: errors.array() });
    }
    //check whether the user with this email exists
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({success, error: "Sorry a user with this email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true ; 
      res.json({success, authToken });
    } 
    catch (error) {
      console.error(error.message);
      res.status(500).send("some error occured");
    }
  }
);

//Route 2: authenticating the user with credentials :POST (/api/auth/login)
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "password cannot be blank").exists(),
  ],
  async (req, res) => {
    // if there are errors, return bad request and errors
    let success = false ; 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    //check if email and password matches
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false ;
        return res
          .status(400)
          .json({success, error: "Please Log-in with correct email" });
      }
      let PasswordCompare = await bcrypt.compare(password, user.password);
      if (!PasswordCompare) {
        success = false;
        return res.status(400).json({success,  error: "Please enter correct password" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true
      res.json({success,  authToken });
    } 
    catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);
//Route 3: getting data of loggedin user :POST (/api/auth/getUser)
router.post(
    "/getUser", fetchuser ,  async (req, res) => {
      
      try {
        const userId = req.user.id ;
        const user = await User.findById(userId).select("-password")
        res.send(user);
      } 
      catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
      }
    }
  );

module.exports = router;
