const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { checkToken, checkTokenAndAuthorization, checkTokenAndAdmin } = require('../middlewares/checkToken');

// UPDATE
router.put('/:id', checkTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    try {
        // add password verification
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        res.status(200).json(updatedUser);
        } catch (err) {
            res.status(500).json(err);
    }
});

// DELETE
router.delete('/:id', checkTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json('User has been deleted...');
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET USER
router.get('/find/:id', checkTokenAndAdmin, async (req, res) => {
    // '/:id'
    try {
        const user = await User.findById(req.params.id);
        const { password, ...otherProps } = user._doc;
        res.status(200).json(otherProps);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET ALL USERS
router.get('/', checkTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
        const users = query 
            ? await User.find().sort({ _id: -1 }).limit(5) 
            : await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET USER STATS
router.get('/stats', checkTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            { $project: { month: { $month: "$createdAt" } } },
            { $group: {
                _id: "$month",
                total: { $sum: 1 }
            } }
        ]);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;