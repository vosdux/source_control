const { Router } = require('express');
const Squad = require('../models/Squad');
const Station = require('../models/Station');
const People = require('../models/People');
const Property = require('../models/Property');
const Norm = require('../models/Norm');
const Rank = require('../models/Rank');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
            const err = new Error('Неверный формат');
            err.code = 'EXTENSION';
            return cb(err);
        }
        cb(null, true);
    }
}).single('avatar')

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
        const peoples = await People.find({ station: req.params.stationId}, {name: 1, secondName: 1, midleName: 1});
        res.json({ peoples });
    } catch (error) {
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
});

router.get('/:squadId/:stationId/:peopleId', async (req, res) => {
    try {
        const people = await People.findById(req.params.peopleId).populate('rank');
        const norm = await Norm.find({ owners: { "$in": people.rank._id } }).populate('properties')
        res.json({ people, norm });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
});

router.put('/:squadId/:stationId/:peopleId', async (req, res) => {
    try {
        req.body.result.forEach(async (item) => {
            await People.updateOne( { _id: req.params.peopleId } , { $push: { propertyes: { property: item } } } );
        })
        const people = await People.findById(req.params.peopleId).populate('rank');
        res.json({ people });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
});

router.post('/:squadId/:stationId/', async (req, res) => {
    try {
        upload(req, res, err => {
            if (err.code === 'LIMIT_FILE_SIZE') {
                throw new Error('Картинка не более 2мб')
            }
            if (err.code === 'EXTENSION') {
                throw new Error('Только jpg или png')
            }
        });

        await People.create(req.body);
        const peoples = await People.find({ station: req.params.stationId});
        res.json({ peoples });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
})

module.exports = router;
