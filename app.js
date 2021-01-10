const express = require('express');
const path = require('path');
const mysql = require("mysql");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');
const session = require('express-session');




dotenv.config({path : './.env'})
const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});
const publicDirectory = path.join(__dirname , './public'); //css veya js dosyalarımın konnumunu gösteriyorum
app.use(express.static(publicDirectory)); // dosyamı servera kullanması için veriyorum
// console.log(__dirname);

//parse url-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({extended : false}));

//parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use(cookieParser());

app.use(session({ 
    secret: '123456cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))

app.set('view engine', 'ejs');

db.connect((error) => {
    if (error) {
        console.log(error)
    } else {
        console.log("MYSQL Connected...")
    }
})

// app.get("/", (req, res) => {
//     // res.send("<h1>Homepage</h1>");
//     res.render("index");
// });
// app.get("/register", (req, res) => {
//     // res.send("<h1>Homepage</h1>");
//     res.render("register");
// });

//define routes

app.use('/', require('./routes/pages'));
app.use('/auth' ,require('./routes/auth'));
app.use('/adminPanel',require('./routes/adminPanel'));
app.use('/ownerPanel',require('./routes/ownerPanel'));
app.use('/filterEvent',require('./routes/filterEvent'));
app.use((req,res) => {
    if(req.statusCode == null || req.statusCode == 404){
        res.redirect('/notFound');
    }
});


app.listen(3000, () => {
    console.log("server started at port 3000 ");
});