const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
var express = require("express");
var router = express.Router();
var nodemailer = require("nodemailer");
mysql.createConnection({ multipleStatements: true });

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "Snoll",
    socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock",
    port: "8889" 
});

exports.event = (req,res) => {
    try {
    const { EventNo, EventName, EventDate, EventPlace, EventPrice,EventVipPrice, EventPhotoBackground,
    EventPhotoUrl, PerformerName, EventCategory, EventCapacity,EventVipCapacity,EventAddress, EventCity,owner_email} = req.body;
    db.query('INSERT INTO Events SET ?',
    {
        EventNo: EventNo,
        EventName: EventName,
        EventDate: EventDate,
        EventPlace: EventPlace,
        EventPrice: EventPrice,
        EventVipPrice: EventVipPrice,
        EventPhotoBackground: EventPhotoBackground,
        EventPhotoUrl: EventPhotoUrl,
        PerformerName: PerformerName,
        EventCategory: EventCategory,
        EventCapacity: EventCapacity,
        EventVipCapacity: EventVipCapacity,
        EventAddress: EventAddress,
        EventCity: EventCity,
        owner_email:req.session.emailAddress,
    }, (err,results) => {
        if(err){
        console.log(err);
        }else{
            console.log(EventName)
        return res.redirect("/EventPanel");
        }
    }
    )
    } catch (error) {
    console.log(error);
    }
};    
exports.city = (req,res) => {
    console.log(req.body);
    try {
    const {CityName, HistoryPlaces, BeautyPlaces, ArtPlaces, EatPlace, CitySummary, CityPhoto} = req.body;
    db.query('INSERT INTO city SET ?',
    {
        CityName: CityName,
        HistoryPlaces: HistoryPlaces,
        BeautyPlaces: BeautyPlaces,
        ArtPlaces: ArtPlaces,
        EatPlace: EatPlace,
        CitySummary: CitySummary,
        CityPhoto: CityPhoto
    }, (err,results) => {
        if(err){
        console.log(err);
        }else{
        return res.redirect("/CityPanel");
        }
    }
    )
    } catch (error) {
    console.log(error);
    }

};