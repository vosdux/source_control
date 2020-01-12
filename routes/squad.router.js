const { Router } = require('express');
const Squad = require('../models/Squad');
const Station = require('../models/Station');
const People = require('../models/People');

const router = Router();

router.get('/', async (req, res) => {
    try {
        let squads = await Squad.find();
        res.json({squads})
    } catch (error) {
        res.status(500).json({ message: 'Что-то пошло не так ' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const squad = await Squad.findById(req.params.id);
        res.json({squad});
    } catch (error) {
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
});

router.get('/:squadId/:stationId', async (req, res) => {
    try {
        const station = await Station.findById(req.params.stationId);
        res.json({station});
    } catch (error) {
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
});

router.get('/:squadId/:stationId/:peopleId', async (req, res) => {
    try {
        const people = await People.findById(req.params.peopleId);
        res.json({people});
    } catch (error) {
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
});

module.exports = router;