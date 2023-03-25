import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { gOAuth } from '#root/config.js';
import { PassportStatic } from 'passport';
import User from '#rootTS/lib/models/User.js';
import { IUserDoc } from '../models/interface';
import { Error } from 'mongoose';

export default function passportSetup(passport: PassportStatic) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: gOAuth.clientID,
                clientSecret: gOAuth.clientSecret,
                callbackURL: gOAuth.callbackURL
            },
            async function (accessToken, refreshToken, profile: Profile, done) {
                console.log("Trying to access google account ", profile)
                try {
                    let user = await User.findOne({ googleId: profile.id });
                    if (user) {
                        done(null, user);
                    } else {
                        //register new user
                        const email = profile._json.email!

                        const newUser: IUserDoc = new User({
                            email,
                            password: profile.id,
                            role: "member",
                            googleId: profile.id,
                            name: profile._json.given_name,
                            photo: profile._json.picture
                        })

                        user = await User.create(newUser);
                        console.log("created new user.")
                        done(null, user);

                    }
                } catch (err) {
                    console.error(err);
                }

            }
        )
    );

    // passport.use(
    //     new AppleStrategy(

    //     )
    // )

    passport.serializeUser((user, done) => {
        console.log(`passport serialize user: `, user)
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err: Error, user: IUserDoc) => {
            done(err, user);
        })
    })
}