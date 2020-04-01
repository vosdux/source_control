const { Router } = require('express');
const Rank = require('../models/Rank');
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');

const router = Router();

const roleMiddle = (roles) => (req, res, next) => role(req, res, next, roles);

router.get('/', auth, roleMiddle(['admin', 'specialist']), async (req, res) => {
    try {
        const ranks = await Rank.find().sort({rankId: 1})
        res.json({ content: ranks });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
});

module.exports = router;
