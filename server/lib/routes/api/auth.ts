import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignCallback } from 'jsonwebtoken';
import passport from 'passport';
import config from 'config';
import User from '#models/User';
import { IUserDoc } from '#models/interface';
import { ensureAuth } from '#middleware/auth'
import { IResponseErrorMessage } from './interface';

const router = express.Router();
const JWT_SECRET = config.get('JWT_SECRET') as string;
const ORIGIN: string = process.env.NODE_ENV === "production" ?
    config.get<string>("origin.prod")
    : config.get<string>("origin.dev");

// @route:  POST api/auth
// @access: public
// @desc:   authorize users login
router.post('/', (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'All fields required' });
    }

    User.findOne({ email })
        .then((user: IUserDoc | null) => {
            if (!user) return res.status(400).json({ msg: 'Unauthorized access denied' });

            //validate password
            bcrypt.compare(password, user.password!)
                .then(isMatch => {
                    if (!isMatch) return res.status(400).json({ msg: 'Unauthorized credentials' });

                    const signCallback: SignCallback = (error: Error | null, token: string | undefined) => {
                        if (error) throw error;
                        res.json({
                            token,
                            user: {
                                id: user._id,
                                email: user.email,
                                role: user.role
                            }
                        })
                    }
                    jwt.sign(
                        { id: user._id },
                        JWT_SECRET,
                        { expiresIn: 3600 },
                        signCallback
                    )

                    console.log(`Legacy user sign in:`, user)
                })

        })
});

// @route:  GET api/auth/user
// @desc:   get authorized users data
// @access: private
router.get('/user', ensureAuth, (req: Request, res: Response) => {
    console.log('api/auth/user: auth')
    res.json(req.user);
});



router.get("/login/failed", (req: Request, res: Response) => {
    const errorMsg: IResponseErrorMessage = {
        msg: "unauthorized login "
    }

    res.status(401).json(errorMsg);
})

router.get("/logout", (req: Request, res: Response) => {
    try {
        req.logout((err: any) => {
            if (err) {
                const errorMsg: IResponseErrorMessage = {
                    msg: "Logout Failed",
                    reason: err
                }
                throw errorMsg;
            }
        });
        res.redirect(ORIGIN as string);
    } catch (err) {
        res.status(203).json(err);
    }
})

router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: ORIGIN + '/login/success',
        failureRedirect: '/login/failed',
    }),
)


export default router;