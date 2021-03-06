const { Router } = require('express');
const Archive = require('../models/Archive');
const Norm = require('../models/Norm');
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');

const router = Router();

const roleMiddle = (roles) => (req, res, next) => role(req, res, next, roles);

router.get('/', auth, roleMiddle(['admin', 'specialist']), async (req, res) => {
    try {
        let findObj = {};
        if (req.query.search) {
            findObj = { $text: { $search: req.query.search } };
        }
        const totalElements = await Archive.find().count();
        const archive = await Archive.find(findObj, { name: 1, secondName: 1, midleName: 1, rank: 1, position: 1 })
            .sort({ secondName: 1 })
            .populate('rank')
            .skip((req.query.size * req.query.page))
            .limit(+req.query.size)
            .exec();
        res.json({ archive, totalElements });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
});

router.get('/:peopleId', auth, roleMiddle(['admin', 'specialist']), async (req, res) => {
    try {
        const people = await Archive.findById(req.params.peopleId).populate('rank').populate('propertyes.property').exec();
        const norm = await Norm.findOne({ owners: { "$in": people.rank._id } }).populate('properties.property')
        res.json({ people, norm });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
});

module.exports = router;
