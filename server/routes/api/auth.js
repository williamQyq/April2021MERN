const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const User = require('../../models/User'); //User Model
const auth = require('../../middleware/auth.js')

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
router.get('/user', auth, (req, res) =>{
    User.findById(req.user.id)
    .select('-password')
    .then(user => res.json(user));

});

module.exports = router;