import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import auth from '#middleware/auth.js'
import User from '#rootTS/lib/models/User.js'; //User Model
import { JWT_SECRET } from '#root/config.js';
const router = express.Router();


// @route POST api/users
// @desc Register new Users
// @access public
router.post('/register', auth, (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ msg: 'All fields required' });
    }

    User.findOne({ email })
        .then(user => {
            if (user) return res.status(400).json({ msg: 'User already exists' });

            const newUser = new User({
                email,
                password,
                role
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => {
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
            })

        });
});


export default router;