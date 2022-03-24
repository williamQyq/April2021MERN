import express from 'express';
import bcrypt from 'bcryptjs';
import config from 'config';
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';
import auth from '../../middleware/auth.js'
const router = express.Router();


// @route POST api/auth
// @desc authorize users
// @access private
router.post('/', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'All fields required' });
    }

    User.findOne({ email })
        .then(user => {
            if (!user) return res.status(400).json({ msg: 'Unauthorized access denied' });

            //validate password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (!isMatch) return res.status(400).json({ msg: 'Unauthorized credentials' });

                    jwt.sign(
                        { id: user.id },
                        config.get('jwtSecret'),
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

        });
});

// @route GET api/auth/user
// @desc get users data
// @access private
router.get('/user', auth, (req, res) => {
    User.findById(req.user.id)
        .select('-password')
        .then(user => res.json(user));

});

export default router;