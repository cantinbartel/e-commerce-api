const router = require('express').Router();
const Cart = require('../models/Cart');
const { checkToken, checkTokenAndAuthorization, checkTokenAndAdmin } = require('../middlewares/checkToken');

// CREATE
router.post('/', checkToken, async (req, res) => {
    const newCart = new Cart(req.body);

    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    } catch (err) {
        res.status(500).json(err);
    }
});

// UPDATE
router.put('/:id', checkTokenAndAuthorization, async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true});
        res.status(200).json(updatedCart);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE 
router.delete('/:id', checkTokenAndAuthorization, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json('Cart has been deleted...');
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET USER CART
router.get('/:userId', checkTokenAndAuthorization, async (req, res) => {
    try {
        const cart = await Cart.findOne({userId: req.params.userId});
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET ALL CARTS OF ALL USERS
router.get('/', checkTokenAndAdmin, async (req, res) => {
    try {
        const carts = Cart.find();
        res.status(200).json(carts);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;