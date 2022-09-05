import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '#models/User.js';
import auth from '#middleware/auth.js'
import { JWT_SECRET } from '#root/config.js';
const router = express.Router();


// @route:  POST api/auth
// @access: public
// @desc:   authorize users login
router.post('/', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'All fields required' });
    }

    User.findOne({ email })
        .then(user => {
            console.log(`User sign in:`, user)
            if (!user) return res.status(400).json({ msg: 'Unauthorized access denied' });

            //validate password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (!isMatch) return res.status(400).json({ msg: 'Unauthorized credentials' });

                    jwt.sign(
                        { id: user.id },
                        JWT_SECRET,
                        // {expiresIn: 3600},
                        (err, token) => {
                            if (err) throw err;
                            res.json({
                                token,
                                user: {
                                    id: user.id,
                                    email: user.email,
                                    role: user.role
                                }
                            })
                        }
                    )
                })

        })
});

// @route:  GET api/auth/user
// @desc:   get authorized users data
// @access: private
router.get('/user', auth, (req, res) => {
    User.findById(req.user.id)
        .select('-password')
        .then(user => res.json(user));

});

export default router;