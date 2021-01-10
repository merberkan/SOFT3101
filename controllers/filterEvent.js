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
    const {EventName,EventCategory,EventCity,EventDate,EventPhotoUrl} = req.body;
    var Events = [];
    if(EventName != '' && EventCategory == '' && EventCity == '' && EventDate == ''){
    db.query('SELECT * FROM Snoll.events WHERE Snoll.events.EventName = ?  OR Snoll.events.EventPhotoUrl',[EventName,EventPhotoUrl],
    (err,results) => {
        if(err){
        console.log(err);
        }else{
            for(var i =0; i<results.length; i++){
                var a = {
                    EventName: results[i].EventName,
                    EventCategory: results[i].EventCategory,
                    EventCity: results[i].EventCity,
                    EventDate: results[i].EventDate,
                    EventPhotoUrl: results[i].EventPhotoUrl
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
    }else if(EventName == '' && EventCategory != '' && EventCity == '' && EventDate == ''){
    db.query('SELECT * FROM Snoll.events WHERE Snoll.events.EventCategory = ? OR Snoll.events.EventPhotoUrl',[EventCategory,EventPhotoUrl],
    (err,results) => {
        if(err){
        console.log(err);
        }else{
            for(var i =0; i<results.length; i++){
                var a = {
                    EventName: results[i].EventName,
                    EventCategory: results[i].EventCategory,
                    EventCity: results[i].EventCity,
                    EventDate: results[i].EventDate,
                    EventPhotoUrl: results[i].EventPhotoUrl
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
    }else if(EventName == '' && EventCategory == '' && EventCity != '' && EventDate == ''){
    db.query('SELECT * FROM Snoll.events WHERE Snoll.events.EventCity = ? OR Snoll.events.EventPhotoUrl',[EventCity,EventPhotoUrl],
    (err,results) => {
        if(err){
        console.log(err);
        }else{
            for(var i =0; i<results.length; i++){
                var a = {
                    EventName: results[i].EventName,
                    EventCategory: results[i].EventCategory,
                    EventCity: results[i].EventCity,
                    EventDate: results[i].EventDate,
                    EventPhotoUrl: results[i].EventPhotoUrl
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
    }else if(EventName == '' && EventCategory == '' && EventCity == '' && EventDate != ''){
    db.query('SELECT * FROM Snoll.events WHERE Snoll.events.EventDate = ?  OR Snoll.events.EventPhotoUrl',[EventDate,EventPhotoUrl],
    (err,results) => {
        if(err){
        console.log(err);
        }else{
            for(var i =0; i<results.length; i++){
                var a = {
                    EventName: results[i].EventName,
                    EventCategory: results[i].EventCategory,
                    EventCity: results[i].EventCity,
                    EventDate: results[i].EventDate,
                    EventPhotoUrl: results[i].EventPhotoUrl
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
    }else if(EventName != '' && EventCategory != '' && EventCity == '' && EventDate == ''){
    db.query('SELECT * FROM Snoll.events WHERE Snoll.events.EventName = ? AND Snoll.events.EventCategory = ? OR Snoll.events.EventPhotoUrl',[EventName,EventCategory,EventPhotoUrl],
    (err,results) => {
        if(err){
        console.log(err);
        }else{
            for(var i =0; i<results.length; i++){
                var a = {
                    EventName: results[i].EventName,
                    EventCategory: results[i].EventCategory,
                    EventCity: results[i].EventCity,
                    EventDate: results[i].EventDate,
                    EventPhotoUrl: results[i].EventPhotoUrl
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
    }else if(EventName != '' && EventCategory == '' && EventCity != '' && EventDate == ''){
    db.query('SELECT * FROM Snoll.events WHERE Snoll.events.EventName = ? AND Snoll.events.EventCity = ? OR Snoll.events.EventPhotoUrl',[EventName,EventCity,EventPhotoUrl],
    (err,results) => {
        if(err){
        console.log(err);
        }else{
            for(var i =0; i<results.length; i++){
                var a = {
                    EventName: results[i].EventName,
                    EventCategory: results[i].EventCategory,
                    EventCity: results[i].EventCity,
                    EventDate: results[i].EventDate,
                    EventPhotoUrl: results[i].EventPhotoUrl
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
    }else if(EventName != '' && EventCategory == '' && EventCity == '' && EventDate != ''){
    db.query('SELECT * FROM Snoll.events WHERE Snoll.events.EventName = ? AND Snoll.events.EventDate = ?  OR Snoll.events.EventPhotoUrl',[EventName,EventDate,EventPhotoUrl],
    (err,results) => {
        if(err){
        console.log(err);
        }else{
            for(var i =0; i<results.length; i++){
                var a = {
                    EventName: results[i].EventName,
                    EventCategory: results[i].EventCategory,
                    EventCity: results[i].EventCity,
                    EventDate: results[i].EventDate,
                    EventPhotoUrl: results[i].EventPhotoUrl
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
    }else if(EventName == '' && EventCategory != '' && EventCity != '' && EventDate == ''){
    db.query('SELECT * FROM Snoll.events WHERE Snoll.events.EventCategory = ? AND Snoll.events.EventCity = ? OR Snoll.events.EventPhotoUrl',[EventCategory,EventCity,EventPhotoUrl],
    (err,results) => {
        if(err){
        console.log(err);
        }else{
            for(var i =0; i<results.length; i++){
                var a = {
                    EventName: results[i].EventName,
                    EventCategory: results[i].EventCategory,
                    EventCity: results[i].EventCity,
                    EventDate: results[i].EventDate,
                    EventPhotoUrl: results[i].EventPhotoUrl
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
    }else if(EventName == '' && EventCategory != '' && EventCity == '' && EventDate != ''){
    db.query('SELECT * FROM Snoll.events WHERE Snoll.events.EventCategory = ? AND Snoll.events.EventDate = ?  OR Snoll.events.EventPhotoUrl',[EventCategory,EventDate,EventPhotoUrl],
    (err,results) => {
        if(err){
        console.log(err);
        }else{
            for(var i =0; i<results.length; i++){
                var a = {
                    EventName: results[i].EventName,
                    EventCategory: results[i].EventCategory,
                    EventCity: results[i].EventCity,
                    EventDate: results[i].EventDate,
                    EventPhotoUrl: results[i].EventPhotoUrl
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
    }else if(EventName == '' && EventCategory == '' && EventCity != '' && EventDate != ''){
    db.query('SELECT * FROM Snoll.events WHERE Snoll.events.EventCity = ? AND Snoll.events.EventDate = ?  OR Snoll.events.EventPhotoUrl',[EventCity,EventDate,EventPhotoUrl],
    (err,results) => {
        if(err){
        console.log(err);
        }else{
            for(var i =0; i<results.length; i++){
                var a = {
                    EventName: results[i].EventName,
                    EventCategory: results[i].EventCategory,
                    EventCity: results[i].EventCity,
                    EventDate: results[i].EventDate,
                    EventPhotoUrl: results[i].EventPhotoUrl
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
    }else if(EventName != '' && EventCategory != '' && EventCity != '' && EventDate == ''){
    db.query('SELECT * FROM Snoll.events WHERE Snoll.events.EventName = ? AND Snoll.events.EventCategory = ? AND Snoll.events.EventCity = ? OR Snoll.events.EventPhotoUrl',[EventName,EventCategory,EventCity,EventPhotoUrl],
    (err,results) => {
        if(err){
        console.log(err);
        }else{
            for(var i =0; i<results.length; i++){
                var a = {
                    EventName: results[i].EventName,
                    EventCategory: results[i].EventCategory,
                    EventCity: results[i].EventCity,
                    EventDate: results[i].EventDate,
                    EventPhotoUrl: results[i].EventPhotoUrl
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
    }else if(EventName != '' && EventCategory != '' && EventCity == '' && EventDate != ''){
    db.query('SELECT * FROM Snoll.events WHERE Snoll.events.EventName = ? AND Snoll.events.EventCategory = ? AND Snoll.events.EventDate = ?  OR Snoll.events.EventPhotoUrl',[EventName,EventCategory,EventDate,EventPhotoUrl],
    (err,results) => {
        if(err){
        console.log(err);
        }else{
            for(var i =0; i<results.length; i++){
                var a = {
                    EventName: results[i].EventName,
                    EventCategory: results[i].EventCategory,
                    EventCity: results[i].EventCity,
                    EventDate: results[i].EventDate,
                    EventPhotoUrl: results[i].EventPhotoUrl
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
    }else if(EventName != '' && EventCategory == '' && EventCity != '' && EventDate != ''){
    db.query('SELECT * FROM Snoll.events WHERE Snoll.events.EventName = ? AND Snoll.events.EventCity = ? AND Snoll.events.EventDate = ?  OR Snoll.events.EventPhotoUrl',[EventName,EventCity,EventDate,EventPhotoUrl],
    (err,results) => {
        if(err){
        console.log(err);
        }else{
            for(var i =0; i<results.length; i++){
                var a = {
                    EventName: results[i].EventName,
                    EventCategory: results[i].EventCategory,
                    EventCity: results[i].EventCity,
                    EventDate: results[i].EventDate,
                    EventPhotoUrl: results[i].EventPhotoUrl
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
    }else if(EventName == '' && EventCategory != '' && EventCity != '' && EventDate != ''){
    db.query('SELECT * FROM Snoll.events WHERE Snoll.events.EventCategory = ? AND Snoll.events.EventCity = ? AND Snoll.events.EventDate = ?  OR Snoll.events.EventPhotoUrl',[EventCategory,EventCity,EventDate,EventPhotoUrl],
    (err,results) => {
        if(err){
        console.log(err);
        }else{
            for(var i =0; i<results.length; i++){
                var a = {
                    EventName: results[i].EventName,
                    EventCategory: results[i].EventCategory,
                    EventCity: results[i].EventCity,
                    EventDate: results[i].EventDate,
                    EventPhotoUrl: results[i].EventPhotoUrl
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
    }else if(EventName != '' && EventCategory != '' && EventCity != '' && EventDate != '')
    db.query('SELECT * FROM Snoll.events WHERE Snoll.events.EventName = ? AND Snoll.events.EventCategory = ? AND Snoll.events.EventCity = ? AND Snoll.events.EventDate = ? OR Snoll.events.EventPhotoUrl',[EventName,EventCategory,EventCity,EventDate,EventPhotoUrl],
    (err,results) => {
        if(err){
        console.log(err);
        }else{
            for(var i =0; i<results.length; i++){
                var a = {
                    EventName: results[i].EventName,
                    EventCategory: results[i].EventCategory,
                    EventCity: results[i].EventCity,
                    EventDate: results[i].EventDate,
                    EventPhotoUrl: results[i].EventPhotoUrl
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
    }catch (error) {
    console.log(error);
    }
};