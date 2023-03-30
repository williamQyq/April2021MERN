import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignCallback } from 'jsonwebtoken';
import User from '#rootTS/lib/models/User.js';
import { auth, ensureAuth } from '#rootTS/lib/middleware/auth.js'
import { JWT_SECRET, ORIGIN } from '#root/config.js';
import { IUserDoc } from '#root/lib/models/interface';
import passport from 'passport';
import { IResponseErrorMessage } from './interface';
const router = express.Router();


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
    if (!req.user) {
        return res.status(401).json({ msg: "Unable to get authorized user." });
    }
    res.json(req.user);
    // User.findById(req.user.id)
    //     .select('-password')
    //     .then(user => res.json(user));

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
        res.status(203).json(err).redirect(ORIGIN as string);
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