const { Router } = require('express');
const People = require('../models/People');
const auth = require('../middleware/auth.middleware');

const router = Router();

router.put('/:peopleId/add-property', auth, async (req, res) => {
    try {
        console.log(req.body.result)
        let promises = req.body.result.map(async (item) => {
            let propertyes = {
                property: item.property
            };

            if (item.date) {
                propertyes.date = item.date;
            }

            await People.updateOne({ _id: req.params.peopleId }, { $push: { propertyes } }, { new: true });
        })

        await Promise.all(promises);
        res.json({ message: 'Успех!' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
});

router.put('/:peopleId/discard/:id', auth, async (req, res) => {
    try {
        let people = await People.findOneAndUpdate({ _id: req.params.peopleId, propertyes: { $elemMatch: { _id: req.params.id } } }, { $set: { 'propertyes.$.discarded': true } }, { new: true })
            .populate('propertyes.property');

        res.json({ people });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
});

module.exports = router;
