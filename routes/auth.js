const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
    // const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json(err);
    }    
});

// Login
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) return res.status(404).json({ message: 'Password incorrect' });
        if (await bcrypt.compare(req.body.password, user.password)) {
            const accessToken = jwt.sign({
                id: user._id,
                isAdmin: user.isAdmin
            }, 
            process.env.JWT_KEY,
            { expiresIn: '1d' }
        );
            const { password, ...otherProps } = user._doc;
            return res.status(200).json({ message: 'user logged in', user: { ...otherProps, accessToken } });
            // accessToken independant of user
        } else {
            return res.status(401).json({ message: 'password incorrect' })
        };
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;