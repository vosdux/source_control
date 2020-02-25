const { Router } = require('express');
const docx = require('docx');

const router = Router();

const { Document, Packer, Paragraph, TextRun, StreamPacker } = docx;

router.get("/", async (req, res) => {
    console.log('document-router')
    const doc = new Document();

    doc.addSection({
        properties: {},
        children: [
            new Paragraph({
                children: [
                    new TextRun("Hello World"),
                    new TextRun({
                        text: "Foo Bar",
                        bold: true,
                    }),
                    new TextRun({
                        text: "\tGithub is the best",
                        bold: true,
                    }),
                ],
            }),
        ],
    });

    const b64string = await Packer.toBase64String(doc);

    res.set('Content-Disposition', 'attachment; filename="filename.pdf"');
    res.set('Content-Type', 'application/pdf');

    res.end(b64string, 'base64');
})

module.exports = router;