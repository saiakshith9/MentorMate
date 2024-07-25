require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user.js");

const userRouter = require("./routes/userRouter.js");
const courseRouter = require("./routes/courseRouter.js");
const progressRouter = require("./routes/progressRouter.js");

const mongodbStore = MongoStore.create({
  mongoUrl: process.env.ATLAS_URL,
  crypto: {
    secret: process.env.SESSION_SECRET,
  },
  touchAfter: 24 * 60 * 60,
});

mongodbStore.on("error", () => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
  store: mongodbStore,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

async function main() {
  await mongoose.connect(process.env.ATLAS_URL);
}

main()
  .then((res) => {
    console.log("Successfully connected to Database\n");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
  res.send("App is working");
});

app.use("/auth", userRouter);
app.use("/course", courseRouter);
app.use("/progress", progressRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is listening at ${process.env.PORT}`);
});
