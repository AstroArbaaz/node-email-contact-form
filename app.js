require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

//view engine setup:
/*app.engine('handlebars', );*/
app.set('view engine', 'ejs');

//static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

//Body Parser Middleware:
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.render('index');
});

app.post('/send-email', function (req, res) {

  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
      <li>Name: ${req.body.name}</li>
      <li>surname: ${req.body.surname}</li>
      <li>Email: ${req.body.email}</li>
      <li>Need: ${req.body.need}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.user,
        pass: process.env.pass
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  let mailOptions = {
      from: '"Node-Email Contact" <arbaaz.django.blog@gmail.com>',
      to: process.env.to,
      subject: req.body.need, // Subject line
      text: req.body.body, // plain text body
      html: output // html body
  };

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
              res.render('index');
          });
});

app.listen(3000, function(){
  console.log('server is up and running on port:3000');
});
