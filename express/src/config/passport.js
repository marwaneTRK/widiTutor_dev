const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../model/User");

const GOOGLE_CALLBACK_URL =
  process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback";

const normalizeEmail = (email = "") => email.trim().toLowerCase();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleEmail = normalizeEmail(profile?.emails?.[0]?.value);
        if (!googleEmail) {
          return done(new Error("Google account has no email address"), null);
        }

        let user = await User.findOne({ email: googleEmail });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            lastName: "",
            email: googleEmail,
            googleId: profile.id,
            isVerified: true,
          });
        } else if (!user.googleId) {
          user.googleId = profile.id;
          user.isVerified = true;
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
