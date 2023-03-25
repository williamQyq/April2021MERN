import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignCallback } from 'jsonwebtoken';
import User from '#rootTS/lib/models/User.js';
import { auth } from '#rootTS/lib/middleware/auth.js'
import { JWT_SECRET } from '#root/config.js';
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
            bcrypt.compare(password, user.password)
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

                    console.log(`User sign in:`, user)
                })

        })
});

// @route:  GET api/auth/user
// @desc:   get authorized users data
// @access: private
router.get('/user', auth, (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ msg: "Unauthorized user." });
    }
    User.findById(req.user.id)
        .select('-password')
        .then(user => res.json(user));

});


router.get("/login/failed", (req: Request, res: Response) => {
    const errorMsg: IResponseErrorMessage = {
        msg: "unauthorized login "
    }

    res.status(401).json(errorMsg);
})

router.get("/logout", (req: Request, res: Response) => {
    // req.logout(_, done);
    res.redirect(CLIENT_URL)
})

router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

const CLIENT_URL = "http://localhost:3000/";

router.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: CLIENT_URL,
        failureRedirect: '/login/failed'
    }),

)


export default router;