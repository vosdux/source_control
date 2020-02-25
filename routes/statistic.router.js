const { Router } = require('express');
const Squad = require('../models/Squad');
const Station = require('../models/Station');
const People = require('../models/People');
const Property = require('../models/Property');
const Norm = require('../models/Norm');
const Rank = require('../models/Rank');
const multer = require('multer');
const path = require('path');
const moment = require('moment')
const router = Router();

router.get('/station/:id', async (req, res) => {
    try {
        let peoples = await People.find({ station: req.params.id }, { rank: 1, propertyes: 1 }).populate('rank');
        peoples = JSON.parse(JSON.stringify(peoples));
        let okCounter = 0;
        let disadvanteges = [];
        let stat = [];
        const userPromises = peoples.map(async item => {
            let norm = await Norm.findById(item.rank.norm).populate('properties.property');
            norm = JSON.parse(JSON.stringify(norm));
            let normArr = [];
            norm.properties.forEach(prop => {
                for (let i = 0; i < prop.count; i++) {
                    normArr.push(prop.property)
                }
            });
            console.log(normArr)
            await item.propertyes.forEach(elem => {
                let index = normArr.findIndex(i => i._id === elem.property)
                if (index !== -1) {
                    let date = elem.date.split('T')[0];
                    let lifeTimeEnd = moment(date).add(normArr[index].lifeTime, 'years');
                    let now = moment();
                    let lifeTime = moment(lifeTimeEnd).isAfter(now);
                    console.log(lifeTime)
                    if (lifeTime) {
                        normArr.splice(index, 1);
                    }
                }
            });
            if (normArr.length === 0) {
                okCounter++;
            }
            disadvanteges.push(...normArr)
            return true;
        });
        await Promise.all(userPromises);
        disadvanteges.forEach((item, index) => {
            if (stat.some(el => el.title === item.name) === false) {
                let arr = disadvanteges.filter(elem => elem.name === item.name);
                console.log(arr);
                stat.push({
                    title: item.name,
                    count: arr.length
                });
            }
            
        })
        res.json({ peoples: peoples.length, okPeoples: okCounter, stat });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
});

module.exports = router;