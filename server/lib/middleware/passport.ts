import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { PassportStatic } from 'passport';
import User from '#root/lib/models/User';
import { IUserDoc } from '../models/interface';
import mongoose from 'mongoose';
import config from 'config';
export default function passportSetup(passport: PassportStatic) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: config.get('passport.google.callbackURL'),
                passReqToCallback: true
            },
            async (req, accessToken, refreshToken, profile: Profile, done) => {
                // console.log("***Trying to access google account:***\n ", profile)
                try {

                    let user = await User.findOne({ googleId: profile.id });
                    if (user) {
                        done(null, user);
                    } else {
                        //register new user

                        const newUser: IUserDoc = new User({
                            email: null,
                            password: null,
                            role: "member",
                            googleId: profile.id,
                            name: profile._json.given_name,
                            photo: profile._json.picture
                        })

                        user = await User.create(newUser);
                        console.log("created new user.")
                        done(null, user);

                    }
                } catch (err: any) {
                    console.error(err);
                    done(err, undefined);
                }
            }
        )
    );

    // passport.use(
    //     new AppleStrategy(
    //         //Apple oAuth strategy ...
    //     )
    // )

    passport.serializeUser((user, done) => {
        console.log(`passport serialize user: `, user)
        done(null, user.googleId);
    });

    passport.deserializeUser((id, done) => {
        console.log(`passport deserialize user id: `, id)
        User.findOne({ googleId: id }, (err: mongoose.Error, user: IUserDoc) => {
            done(err, user);
        })
    })
}