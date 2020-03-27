const { Router } = require('express');
const Norm = require('../models/Norm');
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');

const router = Router();

const roleMiddle = (roles) => (req, res, next) => role(req, res, next, roles);

router.get('/', auth, async (req, res) => {
    try {
        const ranks = await Norm.find().populate('properties.property');
        res.json({ content: ranks });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
});

router.put('/:id', auth, roleMiddle(['admin', 'specialist']), async (req, res) => {
    try {
        const rank = await Norm.findByIdAndUpdate(req.params.id);
        res.json({ rank });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
});

module.exports = router;
