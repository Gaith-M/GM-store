// passport modules
const passport = require("passport");
const JWT_Strategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const Facebook_strategy = require("passport-facebook").Strategy;
const Google_strategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");

// =================
// General Setup
// =================
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// ==================
// Configure JWT Strategy
// ==================
const jwt_strategy_opts = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  passReqToCallback: true,
};

passport.use(
  new JWT_Strategy(jwt_strategy_opts, async (req, jwt_payload, done) => {
    try {
      const user = await User.findOne({ email: jwt_payload.email });

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      done(err, false);
    }
  })
);

// ======================
// Facebook Strategy
// ======================
const FB_strategy_opts = {
  clientID: process.env.FB_ID,
  clientSecret: process.env.FB_SECRET,
  callbackURL: "/api/auth/facebook/callback",
  profileFields: ["id", "name", "email"],
};

passport.use(
  new Facebook_strategy(
    FB_strategy_opts,
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOne({ facebookID: profile.id });

        if (user) {
          done(null, user);
        } else {
          const { id, first_name, email } = profile._json;
          const new_user = new User({
            facebookID: id,
            firstName: first_name,
            email,
          });

          const user = await new_user.save();
          done(null, user);
        }
      } catch (err) {
        done(err, false);
      }
    }
  )
);

// =======================
// Google Strategy
// =======================
const google_strategy_opts = {
  clientID: process.env.Google_clientID,
  clientSecret: process.env.Google_clientSecret,
  callbackURL: "/api/auth/google/callback",
};

passport.use(
  new Google_strategy(
    google_strategy_opts,
    async (accessToken, refreshToken, profile, done) => {
      const { sub, email, given_name, family_name } = profile._json;
      try {
        const user = await User.findOne({ googleID: sub });

        if (user) return done(null, user);
        if (!user) {
          const new_user = new User({
            googleID: sub,
            email: email,
            firstName: given_name,
            lastName: family_name,
          });
          const user = await new_user.save();
          return done(null, user);
        }
      } catch (err) {
        done(err, false);
      }
    }
  )
);
