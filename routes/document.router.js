const { Router } = require('express');
const pdf = require('html-pdf');
const auth = require('../middleware/auth.middleware');
const pdfTemplate = require('../documnets');
const path = require('path');

const router = Router();

router.post("/", auth, async (req, res) => {
    console.log(req.body)
    pdf.create(pdfTemplate(req.body), {}).toFile('result.pdf', (err) => {
        if (err) {
            res.send(Promise.reject());
        }

        res.send(Promise.resolve());
    });
});

router.get('/download', (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'result.pdf'))
})

module.exports = router;