//Packages
const express = require('express')
const app = express()
const PORT = 3000;
const mongoose = require("mongoose");
const bodyParser = require('body-parser')
const session = require("express-session");
const chalk = require('chalk');
const { v4: uuidv4 } = require("uuid");
app.use(express.static(__dirname + '/public'));

//MongoDB
//mongodb+srv://admin:v1i1d1u4l@ejs-template.eh6bicf.mongodb.net/?retryWrites=true&w=majority&appName=EJS-Template
const MongoDBURI = 'mongodb+srv://admin:v1i1d1u4l@ejs-template.eh6bicf.mongodb.net/?retryWrites=true&w=majority&appName=EJS-Template'
const MongoStore = require("connect-mongo")(session);
mongoose.connect(MongoDBURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
const Database = mongoose.connection;
Database.on("error", console.error.bind(console, chalk.bgRedBright.bold(' [MongoDB] Failed To Connect To Database : \n')));
Database.once("open", () => { console.log(chalk.bgGreenBright.bold(' [MongoDB] Successfuly Connected To Database '))});

//Express
app.use(
  session({
    secret: "LHDIDH$#%@$^#$^oq$#@%FSDFDSF@$ihvVSFIVHISHI41$#@^#%&#$$@#$JBVVLJSV",
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: Database,
    }),
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000 * 1000 * 1000
    }
  })
);
app.listen(`${PORT}`, () => {
  console.clear();
  console.log(chalk.bgGreenBright.bold(' [Express] WebApp Successfully Booted '));
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(session({
  secret: uuidv4(), 
  resave: false,
  saveUninitialized: true
}));
app.use(express.json({limit: '200000mb'}));
app.use(express.urlencoded({limit: '200000mb'}));

//Routes
const index = require('./routes/index.js')
const admin = require('./routes/admin.js')
const API = require('./routes/api.js')
const upload = require('./routes/upload.js')
app.use('/', index)
app.use('/admin', admin)
app.use('/Api', API)
app.use('/Upload', upload)
app.use((req, res, next) => {
    res.render('404.ejs')
})

const { QuickDB } = require("quick.db");
const db = new QuickDB()
db.set("uptime", 1);
async function uptime() {
  await db.add("uptime", 1);
  setTimeout(uptime, 1000);
}
setTimeout(uptime, 1000);