const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
var express = require("express");
var router = express.Router();
var nodemailer = require("nodemailer");
mysql.createConnection({ multipleStatements: true });

const db = mysql.createConnection({
host: process.env.DATABASE_HOST,
user: process.env.DATABASE_USER,
password: process.env.DATABASE_PASSWORD,
database: process.env.DATABASE
});

exports.event = (req,res) => {
    try {
    const {EventName,EventCategory,EventCity,EventDate} = req.body;
    var Events = [];
    console.log(EventName)
    console.log(EventCategory)
    db.query('SELECT * FROM Snoll.events WHERE Snoll.events.EventName = ? OR Snoll.events.EventCategory = ? OR Snoll.events.EventCity = ? OR Snoll.events.EventDate = ?',[EventName,EventCategory,EventCity,EventDate],
    (err,results) => {
        if(err){
        console.log(err);
        }else{
            for(var i =0; i<results.length; i++){
                var a = {
                    EventName: results[i].EventName,
                    EventPhotoUrl: results[i].EventPhotoUrl,
                    EventCategory: results[i].EventCategory,
                    EventCity: results[i].EventCity,
                    EventDate: results[i].EventDate
                }
                Events.push(a);
            }
            res.render("filterEvent",{
                Events,
                email: req.session.emailAddress,
                loginn: req.session.loggedinUser
            });
        }
    }
    )
    } catch (error) {
    console.log(error);
    }
};