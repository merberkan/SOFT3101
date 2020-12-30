const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;
        const loggedinUser = Boolean;
        const emailAddress = email;
        if (!email || !password) {
            return res.status(400).render('login', {
                message: 'please provide an email or password '
            })
        }
        db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
            console.log(results);
            if (!results || !(await bcrypt.compare(password, results[0].password))) {
                req.session.message = "email or password incorrect";
                res.render('login', {
                    message: req.session.message
                })
            } else {
                const id = results[0].id;
                const token = jwt.sign({
                    id: id
                }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });
                console.log("the token is :" + token);
                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }
                res.cookie('jwt', token, cookieOptions);
                // console.log(email);
                req.session.loggedinUser = true;
                
                // req.session.notloggedinUser = false;
                req.session.emailAddress = email;
                // sessionStorage.setItem(email,emailAddress);
                // console.log(emailAddress);
            //     return res.status(200).redirect('dashboard', {
            //         email : emailAddress
            //     });
            res.redirect('/');
            }
        })
    } catch (error) {
        console.log(error);
    }
}
exports.register = (req, res) => {
    console.log(req.body);
    // const name = req.body.name;
    // const email = req.body.email;
    // const password = req.body.password;
    // const passwordConfirm = req.body.passwordConfirm;
    // Aşağıdaki satır yukarıda yazdığımın aynısı kısa hali
    const {
        name,
        lastname,
        email,
        password,
        passwordConfirm
    } = req.body;
    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.log(error);
        }
        if (results.length > 0) {
            res.render('register', {
                message: 'That Email is already in use'
            })
        } else if (password !== passwordConfirm) {
            res.render('register', {
                message: 'Passwords do not match'
            });
        }
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);
        // res.send("testing");
        db.query('INSERT INTO users SET ? ', {
            role : "regUser",
            password: hashedPassword,
            email: email,
            firstname: name,
            lastname: lastname,
            
        }, (err, results) => {
            if (error) {
                console.log(error)
            } else {
                console.log(results);
                return res.render('register', {
                    message: 'User registered'
                });
            }
        })
    });
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: 'snolldestek@gmail.com',
        pass: 'snoll123'
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    
    var mailOptions = {
        from: 'snolldestek@gmail.com',
        to: email,
        subject: 'Tebrikler',
        text: 'Tebrikler başarılı bir şekilde sitemize kayıt oldunuz! Email adresiniz : '+email+'  Şifreniz : '+password
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log(error);
        } else {
        console.log('Email sent: ' + info.response);
        }
    });
    // res.send("Form submitted")
}