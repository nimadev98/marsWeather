const express = require("express");
const passport = require("../utils/passportConfig.utils");
const { genPass } = require("../utils/password.utils");
const usersModel = require("../models/users.model");
const router = express.Router();

router.post(
  "/signin",
  passport.authenticate("local", {
    successRedirect: "/",
    failureFlash: true,
    failureRedirect: "/",
  })
);
router.post("/signup", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  const phone = req.body.phone;
  const hashandsalt = genPass(password);
  const user = await usersModel.getUserByEmail(email);
  if (user) {
    const rErr = encodeURIComponent("Username Exist!");
    res.redirect("/?error=" + rErr);
  } else {
    await usersModel.registerUser(
      email,
      hashandsalt.hash,
      hashandsalt.salt,
      phone
    );
    res.redirect("/");
  }
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
