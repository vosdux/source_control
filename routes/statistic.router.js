const { Router } = require('express');
const Squad = require('../models/Squad');
const Station = require('../models/Station');
const People = require('../models/People');
const Property = require('../models/Property');
const Norm = require('../models/Norm');
const Rank = require('../models/Rank');
const multer = require('multer');
const path = require('path');

const router = Router();

router.get('/station/:id', async (req, res) => {
    try {
        const peoples = await People.find({ station: req.params.id}, {rank: 1, propertyes: 1}).populate('rank').populate('properties.property').exec();
        let okCounter = 0;
        peoples.forEach(async item => {
            let norm = await Norm.findById(item.rank.norm);
            let normArr = [];
            norm.properties.forEach(prop => {
                for (let i; i < prop.count; i++) {
                    normArr.push(prop.property)
                }
            });
            item.propertyes.forEach(elem => {
                let index = normArr.indexOf(elem._id);
                if (index) {
                    normArr.splice(index, 1);
                }
            });
            if(norm.length > 0) {
                okCounter++;
            }
        });

        // peoples.forEach(item => {
        //     item.propertyes.forEach(property => {

        //     })
        // })
        res.json({ peoples: peoples.length, okPeoples: okCounter });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
});

module.exports = router;
