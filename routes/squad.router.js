const { Router } = require('express');
const Squad = require('../models/Squad');
const Station = require('../models/Station');
const People = require('../models/People');
const multer = require('multer');
const fs = require('fs')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

const upload = multer({ storage: storage })

const router = Router();

router.get('/', async (req, res) => {
    try {
        let squads = await Squad.find();
        res.json({ squads })
    } catch (error) {
        res.status(500).json({ message: 'Что-то пошло не так ' });
    }
});

router.post('/', async (req, res) => {
    try {
        let name = req.body.name;
        await Squad.create({ name });
        let squads = await Squad.find();
        res.json({ squads })
    } catch (error) {
        res.status(500).json({ message: 'Что-то пошло не так ' });
    }
});

router.put('/:squadId', async (req, res) => {
    try {
        await Squad.findByIdAndUpdate(req.params.squadId, { $set: { name: req.body.name } });
        let squads = await Squad.find();
        res.json({ squads })
    } catch (error) {
        res.status(500).json({ message: 'Что-то пошло не так ' });
    }
});

router.delete('/:squadId', async (req, res) => {
    try {
        await Squad.findByIdAndRemove(req.params.squadId);
        let squads = await Squad.find();
        res.json({ squads })
    } catch (error) {
        res.status(500).json({ message: 'Что-то пошло не так ' });
    }
});

router.get('/:squadId', async (req, res) => {
    try {
        console.log('station')
        const stations = await Station.find({ squad: req.params.squadId });
        res.json({ stations });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
});

router.post('/:squadId', async (req, res) => {
    try {
        await Station.create(req.body);
        let stations = await Station.find({ squad: req.body.squad });
        res.json({ stations });
    } catch (error) {
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
});

router.delete('/:squadId/:stationId', async (req, res) => {
    try {
        await Station.findByIdAndRemove(req.params.stationId);
        let stations = await Station.find({ squad: req.params.squadId });
        res.json({ stations })
    } catch (error) {
        res.status(500).json({ message: 'Что-то пошло не так ' });
    }
});

router.put('/:squadId/:stationId', async (req, res) => {
    try {
        await Station.findByIdAndUpdate(req.params.stationId, { $set: req.body });
        let stations = await Station.find({ squad: req.params.squadId });
        res.json({ stations })
    } catch (error) {
        res.status(500).json({ message: 'Что-то пошло не так ' });
    }
});

router.get('/:squadId/:stationId', async (req, res) => {
    try {
        const peoples = await People.findById(req.params.stationId);
        res.json({ peoples });
    } catch (error) {
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
});

router.get('/:squadId/:stationId/:peopleId', async (req, res) => {
    try {
        const people = await People.findById(req.params.peopleId);
        res.json({ people });
    } catch (error) {
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
});

router.post('/:squadId/:stationId/', (req, res) => {


    console.log(req.file);

})

module.exports = router;
