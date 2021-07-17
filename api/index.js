const express = require("express");
const cors = require("cors");
var path = require("path");
const passport = require("passport");
var session = require("express-session");
var SequelizeStore = require("connect-session-sequelize")(session.Store);
var db = require("./models/database");
require("./controllers/AuthController");
require("dotenv").config();

const test = require("./routes/test");
const auth = require("./routes/auth");
const reports = require("./routes/Reports");

const app = express();
// app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// tell express to use sessions and our own store
var dbStore = new SequelizeStore({
  db: db.sequelize,
  modelKey: "sessions",
});
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: dbStore,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
// sync store table at start-up
dbStore.sync();

app.use(express.static(path.join(__dirname, "public")));

app.use(passport.initialize());
app.use(passport.session());

//API ENDPOINTS
app.use("/test", test);
app.use("/", auth);
app.use("/report", reports);

//test route
app.get("/", (req, res) => res.send("Example Home page!"));

const port = process.env.PORT || 3002;
app.listen(port, () => console.log(`App listening on port ${port}`));
