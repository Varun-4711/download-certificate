const express = require('express');
const bodyParser = require("body-parser");
const { PDFDocument, rgb } = require('pdf-lib');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');



const app = express();

// Specify the project's root directory
const ROOT_DIR = path.join(__dirname);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// const templatePath = path.join(__dirname, 'pdf-templates', 'certificate-template.pdf');

const templatePath = path.join(ROOT_DIR, 'pdf-templates', 'certificate-template.pdf');

const port = 3000;



app.get('/', (req, res) => {
  res.render("index");
});

app.post('/generate-pdf', async (req, res) => {

    const { name, uni, sport } = req.body;

    try {
        // Construct the path to the PDF template
        const templatePath = 'pdf-templates/certificate-template.pdf';
        
        // Read the PDF template from the file system
        const pdfData = await fs.readFileSync(templatePath);
        const pdfDoc = await PDFDocument.load(pdfData);
        const page = pdfDoc.getPages()[0];
    
        // Add text to specific places on the PDF
        page.drawText(name, { x: 100, y: 400, size: 12, color: rgb(0, 0, 0) });
        page.drawText(uni, { x: 100, y: 300, size: 12, color: rgb(0, 0, 0) });
        page.drawText(sport, { x: 100, y: 200, size: 12, color: rgb(0, 0, 0) });
    
        const pdfBytes = await pdfDoc.save();
    
        // res.setHeader('Content-Type', 'application/pdf');
        // res.setHeader('Content-Disposition', 'inline; filename="certificate.pdf"');
        // res.send(pdfBytes);

        const pdfFileName = 'certificate.pdf';
        const pdfFilePath = path.join(__dirname, 'generated-pdfs', pdfFileName);

         await fs.writeFileSync(pdfFilePath, pdfBytes);
         res.download(pdfFilePath, pdfFileName);



      } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Failed to generate the PDF');
      }
    });

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});





// const fs = require('fs');

// const filePath = 'D:\download-certificate-form\pdf-templates\certificate-template.pdf'; // Replace with the actual path to your file

// // Use fs.access to check file permissions
// fs.access(filePath, fs.constants.R_OK | fs.constants.W_OK, (err) => {
//   if (err) {
//     console.error(`File permissions issue: ${err.code}`);
//   } else {
//     console.log('File has read and write permissions.');
//   }
// });



// const express = require('express');
// const { PDFDocument, rgb } = require('pdf-lib');
// const ejs = require('ejs');
// const fs = require('fs').promises;
// const multer = require('multer');
// const path = require('path');

// const app = express();
// const port = 4000;

// // Configure Multer to save uploaded PDFs to the 'uploads/' directory
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage });

// app.set('view engine', 'ejs');
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.urlencoded({ extended: true }));

// app.get('/', (req, res) => {
//   res.render('index');
// });

// app.post('/generate-pdf', upload.single('pdfFile'), async (req, res) => {
//   const { name, uni, sport } = req.body;

//   try {
//     // Construct the path to the PDF template
//     const templatePath = path.join(__dirname, 'pdf-templates', 'certificate-template.pdf');
    
//     console.log('PDF template path:', templatePath);

//     // Read the PDF template from the file system
//     const pdfData = await fs.readFile(templatePath);

//     console.log('PDF template read successfully.');

//     const pdfDoc = await PDFDocument.load(pdfData);
//     console.log(pdfDoc);
//     console.log("hehehehehehehehehehehehe");
//     const page = pdfDoc.getPages()[0];
//     console.log(page);
//     console.log("hehehehehehehehehehehehe");

    

//     // Add text to specific places on the PDF
//     page.drawText(name, { x: 100, y: 400, size: 12, color: rgb(0, 0, 0) });
//     page.drawText(uni, { x: 100, y: 300, size: 12, color: rgb(0, 0, 0) });
//     page.drawText(sport, { x: 100, y: 200, size: 12, color: rgb(0, 0, 0) });

//     const pdfBytes = await pdfDoc.save();
//     console.log(pdfBytes);
//     console.log("hehehehehehehehehehehehe");


//     // res.setHeader('Content-Type', 'application/pdf');
//     // res.setHeader('Content-Disposition', 'inline; filename="certificate.pdf"');
//     // res.send(pdfBytes);

//     const pdfFileName = 'certificate.pdf';
// const pdfFilePath = path.join(__dirname, 'generated-pdfs', pdfFileName);

// await fs.writeFile(pdfFilePath, pdfBytes);
// res.download(pdfFilePath, pdfFileName);


//     console.log('PDF generated successfully.');
//   } catch (error) {
//     console.error('Error generating PDF:', error);
//     res.status(500).send('Failed to generate the PDF');
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });


