const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GithubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
},
    async function (accessToken, refreshToken, profile, done) {
        try {
            // Check if user already exists with this Google ID
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
                return done(null, user);
            }

            // Check if user exists with this email
            user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
                // Add Google OAuth info to existing user
                user.googleId = profile.id;
                user.googleToken = accessToken;
                await user.save();
                return done(null, user);
            }

            // Create new user
            const newUser = new User({
                name: profile.displayName || profile.emails[0].value.split('@')[0],
                email: profile.emails[0].value,
                googleId: profile.id,
                googleToken: accessToken,
                roles: ['User'],
                isActive: true
            });

            await newUser.save();
            return done(null, newUser);
        } catch (error) {
            return done(error, null);
        }
    }
));

// GitHub OAuth Strategy
passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/api/auth/github/callback"
},
    async function (accessToken, refreshToken, profile, done) {
        try {
            // Check if user already exists with this GitHub ID
            let user = await User.findOne({ githubId: profile.id });

            if (user) {
                return done(null, user);
            }

            // Check if user exists with this email
            const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
            if (email) {
                user = await User.findOne({ email: email });

                if (user) {
                    // Add GitHub OAuth info to existing user
                    user.githubId = profile.id;
                    user.githubToken = accessToken;
                    await user.save();
                    return done(null, user);
                }
            }

            // Create new user
            const newUser = new User({
                name: profile.displayName || profile.username || (email ? email.split('@')[0] : 'User'),
                email: email,
                githubId: profile.id,
                githubToken: accessToken,
                roles: ['User'],
                isActive: true
            });

            await newUser.save();
            return done(null, newUser);
        } catch (error) {
            return done(error, null);
        }
    }
));

// Serialize user for session
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async function (id, done) {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;