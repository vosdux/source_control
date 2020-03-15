const { Router } = require('express');
const Rank = require('../models/Rank');
const auth = require('../middleware/auth.middleware');

const router = Router();

router.get('/', auth, async (req, res) => {
        try {
            const ranks = await Rank.find()
            res.json({ ranks });

        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Что-то пошло не так' });
        }
    });

module.exports = router;
