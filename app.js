// const express = require('express');
// const bodyParser = require("body-parser");
// const { PDFDocument, rgb } = require('pdf-lib');
// const path = require('path');
// const ejs = require('ejs');
// const fs = require('fs');



// const app = express();

// // Specify the project's root directory
// const ROOT_DIR = path.join(__dirname);

// app.set('view engine', 'ejs');
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.static("public"));

// // const templatePath = path.join(__dirname, 'pdf-templates', 'certificate-template.pdf');

// const templatePath = path.join(ROOT_DIR, 'pdf-templates', 'certificate-template.pdf');

// const port = 3000;



// app.get('/', (req, res) => {
//   res.render("index");
// });

// app.post('/generate-pdf', async (req, res) => {

//     const { name, uni, sport } = req.body;

//     try {
//         // Construct the path to the PDF template
//         const templatePath = 'pdf-templates/certificate-template.pdf';
        
//         // Read the PDF template from the file system
//         const pdfData = await fs.readFileSync(templatePath);
//         const pdfDoc = await PDFDocument.load(pdfData);
//         const page = pdfDoc.getPages()[0];
    
//         // Add text to specific places on the PDF
//         page.drawText(name, { x: 100, y: 400, size: 12, color: rgb(0, 0, 0) });
//         page.drawText(uni, { x: 100, y: 300, size: 12, color: rgb(0, 0, 0) });
//         page.drawText(sport, { x: 100, y: 200, size: 12, color: rgb(0, 0, 0) });
    
//         const pdfBytes = await pdfDoc.save();
    
//         // res.setHeader('Content-Type', 'application/pdf');
//         // res.setHeader('Content-Disposition', 'inline; filename="certificate.pdf"');
//         // res.send(pdfBytes);

//         const pdfFileName = 'certificate.pdf';
//         const pdfFilePath = path.join(__dirname, 'generated-pdfs', pdfFileName);

//          await fs.writeFileSync(pdfFilePath, pdfBytes);
//          res.download(pdfFilePath, pdfFileName);



//       } catch (error) {
//         console.error('Error generating PDF:', error);
//         res.status(500).send('Failed to generate the PDF');
//       }
//     });

// app.listen(port, () => {
//   console.log(`Server is running on ${port}`);
// });



require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const bodyParser = require('body-parser');
const { PDFDocument, rgb } = require('pdf-lib');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');
const session = require('express-session'); // Import express-session

const app = express();

const ROOT_DIR = path.join(__dirname);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Path to the PDF template
const templatePath = path.join(ROOT_DIR, 'pdf-templates', 'certificate-template.pdf');

const port = 3000;

// Use express-session middleware
app.use(session({
  secret: process.env.SESSION_SECRET, // Use the environment variable for the session secret
  resave: false,
  saveUninitialized: true,
}));

// Middleware to check authentication
const authenticate = (req, res, next) => {
  if (req.session.authenticated) {
    return next(); // User is authenticated
  } else {
    return res.redirect('/login'); // Redirect unauthenticated users to login
  }
};

// Login route
app.get('/login', (req, res) => {
  res.render("login");
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === process.env.AUTH_USERNAME && password === process.env.AUTH_PASSWORD) {
    req.session.authenticated = true; // Set a session variable to indicate authentication
    res.redirect('/'); // Redirect authenticated users to the index page
  } else {
    res.redirect('/login'); // Redirect back to login page on failed login
  }
});

// Secure route (index.ejs)
app.get('/', authenticate, (req, res) => {
  res.render("index");
});

// Generate PDF route
app.post('/generate-pdf', authenticate, async (req, res) => {
  // The code for generating PDF remains the same

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

  // ...

  // Add this route only accessible to authenticated users
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});





