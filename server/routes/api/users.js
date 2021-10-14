const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

//Item Model
const User = require('../../models/User');

// @route GET api/users
router.post('/', (req, res) => {
    const {email, password, role} = req.body;
    
    if(!email || !password || !role) {
        return res.status(400).json({msg: 'All fields required'});
    }

    User.findOne({email})
        .then(user => {
            if(user) return res.status(400).json({msg: 'User already exists'});

            const newUser = new User({
                email,
                password,
                role
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash)=>{
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => {
                            res.json({
                                user: {
                                    id: user.id,
                                    email: user.email,
                                    role: user.role
                                }
                            })
                        })
                })
            })

        });
});


module.exports = router;