if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require("express");
let mongoose = require("mongoose");
let path = require("path");
let app = express();
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
let ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./Models/userModel.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;

// ---------------------- DATABASE CONNECTION ----------------------
main().then(() => {
    console.log("Connected to db");
})
.catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}

// ---------------------- VIEW ENGINE SETUP ----------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsmate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// ---------------------- SESSION STORE ----------------------
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

// ---------------------- PASSPORT SETUP ----------------------
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ---------------------- GLOBAL MIDDLEWARE (IMPORTANT) ----------------------
app.use((req, res, next) => {
    res.locals.curruser = req.user || null;       // <<< FIXED HERE
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// ---------------------- ROUTES ----------------------
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// ---------------------- ERROR HANDLING ----------------------
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
    let { Statuscode = 500, message = "Something went wrong" } = err;
    res.status(Statuscode).render("error.ejs", { err });
});

// ---------------------- START SERVER ----------------------
app.listen(8080, () => {
    console.log("App is listening on port 8080");
});
