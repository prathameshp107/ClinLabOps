const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GithubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/api/auth/google/callback`
},
    async function (accessToken, refreshToken, profile, done) {
        try {
            // Check if user already exists with this Google ID
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
                return done(null, user);
            }

            // Get email from profile
            const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

            // If no email, we can't create a user
            if (!email) {
                return done(new Error('Email is required for registration'), null);
            }

            // Check if user exists with this email
            user = await User.findOne({ email: email });

            if (user) {
                // Add Google OAuth info to existing user
                user.googleId = profile.id;
                user.googleToken = accessToken;
                await user.save();
                return done(null, user);
            }

            // Create new user
            const newUser = new User({
                name: profile.displayName || email.split('@')[0],
                email: email,
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

            // Get email from profile
            let email = null;

            // First check if email is in the profile emails array
            if (profile.emails && profile.emails.length > 0) {
                email = profile.emails[0].value;
            }

            // If no email in profile, we need to fetch it from GitHub API
            if (!email) {
                // Use the access token to fetch the user's email
                const fetch = (await import('node-fetch')).default;
                try {
                    const emailResponse = await fetch('https://api.github.com/user/emails', {
                        headers: {
                            'Authorization': `token ${accessToken}`,
                            'User-Agent': 'LabTasker'
                        }
                    });

                    if (emailResponse.ok) {
                        const emails = await emailResponse.json();
                        // Find the primary email
                        const primaryEmail = emails.find(e => e.primary);
                        if (primaryEmail) {
                            email = primaryEmail.email;
                        } else if (emails.length > 0) {
                            // If no primary email, use the first one
                            email = emails[0].email;
                        }
                    }
                } catch (fetchError) {
                    console.error('Error fetching GitHub emails:', fetchError);
                }
            }

            // If still no email, we can't create a user
            if (!email) {
                return done(new Error('Email is required for registration. Please make sure your GitHub account has a public email address or enable email visibility.'), null);
            }

            // Check if user exists with this email
            user = await User.findOne({ email: email });

            if (user) {
                // Add GitHub OAuth info to existing user
                user.githubId = profile.id;
                user.githubToken = accessToken;
                await user.save();
                return done(null, user);
            }

            // Create new user
            const newUser = new User({
                name: profile.displayName || profile.username || email.split('@')[0],
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
