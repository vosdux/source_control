const { Router } = require('express');
const PropertyStorage = require('../models/PropertyStorage');
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');

const router = Router();

const roleMiddle = (roles) => (req, res, next) => role(req, res, next, roles);

router.get('/', auth, roleMiddle(['storage', 'admin', 'specialist']), async (req, res) => {
    try {
        const propertyStorage = await PropertyStorage.find();
        res.json({ content: propertyStorage });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
});

router.put('/', auth, roleMiddle(['storage']), async (req, res) => {
    try {
        let propertyStorage = await PropertyStorage.findOne({ property: req.body.id });
        propertyStorage = JSON.parse(JSON.stringify(propertyStorage));
        if (!propertyStorage) {
            await PropertyStorage.create({
                property: req.body.id,
                data: [{
                    size: req.body.size,
                    count: req.body.count
                }]
            })
            res.json({ message: 'Успех' });
        } else {
            let index = propertyStorage.data.findIndex(elem => elem.size === req.body.size);
            if (index !== -1) {
                if (req.body.mode === 'add') {
                    propertyStorage.data[index].count += req.body.count;
                } else {
                    propertyStorage.data[index].count -= req.body.count;
                }
            } else {
                propertyStorage.data.push({
                    size: req.body.size,
                    count: req.body.count
                });
            }
            let newPr = await PropertyStorage.findOneAndUpdate({ property: req.body.id }, { $set: { data : propertyStorage.data } }, { new: true })
            
            res.json({ newPr, message: 'Успех' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
});

module.exports = router;