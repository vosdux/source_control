const { Router } = require('express');
const Norm = require('../models/Norm');
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');

const router = Router();

const roleMiddle = (roles) => (req, res, next) => role(req, res, next, roles);

router.get('/', auth, async (req, res) => {
    try {
        const norms = await Norm.find().populate('properties.property');
        res.json({ content: norms });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
});

router.put('/:id', auth, roleMiddle(['admin']), async (req, res) => {
    try {
        const norm = await Norm.findByIdAndUpdate(req.params.id, { $set: { properties: req.body.properties, owners: req.body.owners } });
        res.json({ norm });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
});

router.delete('/:id', auth, roleMiddle(['admin']), async (req, res) => {
    try {
        await Norm.findByIdAndRemove(req.params.id);
        res.json({ message: 'Успех!' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
});

router.post('/', auth, roleMiddle(['admin']), async (req, res) => {
    try {
        const norm = await Norm.create({name: req.body.name});
        res.json({ norm });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
});

module.exports = router;
