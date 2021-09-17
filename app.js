require("dotenv").config();
const path = require("path");
const cors = require("cors");
const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("./utils/passportConfig.utils");

const apiRoutes = require("./routers/api.routes");
const usersRoutes = require("./routers/login.router");
const usersModel = require("./models/users.model");
const { log } = require("console");
const app = express();

app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
app.use(cors());
app.use(express.json());
app.use(flash());
app.set("json spaces", 2);
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/mars", async (req, res, next) => {
  ////////////////Reset API Calls Daily//////////////////
  async function scheduleReset() {
    let reset = new Date();
    reset.setHours(24, 0, 0, 0);
    let t = reset.getTime() - Date.now();
    setTimeout(async function () {
      await usersModel.resetAll();
      scheduleReset();
    }, t);
  }
  scheduleReset();
  ////////////////////////////////////////////////////////
  const allUser = await usersModel.getToken();
  const allTokens = allUser.map((user) => user.apiKey);
  if (!req.query.token && !allTokens.includes(req.query.token)) {
    req.query.token = "free";
    const person = await usersModel.getPerson(req.ip);
    if (!person) {
      await usersModel.addPerson(req.ip);
      await usersModel.plusP(req.ip);
    } else {
      await usersModel.plusP(req.ip);
    }
    const guest = await usersModel.getPerson(req.ip);
    req.premium = false;
    req.count = guest.count;
  } else {
    await usersModel.plusU(req.query.token);
    const ourUser = await usersModel.getToken({ apiKey: req.query.token });
    req.premium = true;
    req.count = ourUser[0].count;
  }

  next();
});

//ROUTES
app.get("/", (req, res) => {
  let rErr = "";
  if (req.query.error === "Username Exist!") {
    rErr = req.query.error;
  }
  let logedin = false;
  let token = "free";
  const host = req.get("host");
  if (req.isAuthenticated()) {
    logedin = true;
    token = req.user.apiKey;
  }

  const fullAddr = `${req.protocol}://${host}/api/mars?token=${token}`;

  res.render("index", {
    error: req.flash("error"),
    rErr,
    fullAddr,
    logedin,
  });
});
app.use(apiRoutes);
app.use(usersRoutes);

module.exports = app;
