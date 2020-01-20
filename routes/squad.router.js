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

router.post('/', async (req, res) => {
    try {
        let name = req.body.name;
        await Squad.create({name});
        let squads = await Squad.find();
        res.json({squads})
    } catch (error) {
        res.status(500).json({ message: 'Что-то пошло не так ' });
    }
})

router.get('/:id', async (req, res) => {
    try {
        console.log('station')
        const stations = await Station.find({ squad: req.params.id });
        res.json({stations});
    } catch (error) {
        console.log(error.message)
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