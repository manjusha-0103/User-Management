const express = require("express")
const bodyParser = require('body-parser');
const connectDB = require("./config/db")
const cors = require('cors');
const multer = require('multer')
//const https = require('https');
const fs = require('fs');
//const rateLimit = require('express-rate-limit');


// const dotenv = require('dotenv')
// dotenv.config({});

//console.log(process.env.PORT)
const port =  5000;
const app = express();
app.use(cors());
// app.use(
//     rateLimit({
//       windowMs: 15 * 60 * 1000, // 15 minutes
//       max: 100, // limit each IP to 100 requests per windowMs
//     })
//   );

const userstorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./client/public/uploads");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  });
  
  const userupload = multer({ storage: userstorage })

  const adminstorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./admin/public/uploads");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  });
  
const adminupload = multer({ storage: adminstorage })


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.post("/api/uploaduserimage", userupload.single("file"), (req, res) => {
    const file = req.file;
    return res.status(200).json(file.filename);
});

app.post("/api/uploadadminimage", adminupload.single("file"), (req, res) => {
    const file = req.file;
    return res.status(200).json(file.filename);
  });

app.use('/api/users',require('./routes/useroutes'))
app.use('/api/admin',require('./routes/adminroutes'))
connectDB();


// Load SSL certificate and key
// const privateKey = fs.readFileSync('./cert/server.key', 'utf8');
// const certificate = fs.readFileSync('./cert/server.cert', 'utf8');
// const ca = fs.readFileSync('cert/manjusha.crt', 'utf8');
// const credentials = { key: privateKey, cert: certificate, ca:ca };
  
// const httpsServer = https.createServer(credentials, app)
// httpsServer.listen(port,()=> {console.log(`running on port ${port}`)});
app.listen(port, ()=>{
    console.log(`servere started on port ${port}`)
})











