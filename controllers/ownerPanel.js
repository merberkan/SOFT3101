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
        EventVipPrice:EventVipPrice,
        EventPhotoBackground: EventPhotoBackground,
        EventPhotoUrl: EventPhotoUrl,
        PerformerName: PerformerName,
        EventCategory: EventCategory,
        EventCapacity: EventCapacity,
        EventVipCapacity:EventVipCapacity,
        EventAddress: EventAddress,
        EventCity: EventCity,
        owner_email:req.session.emailAddress,
    }, (err,results) => {
        if(err){
        console.log(err);
        }else{
            console.log(EventName)
        return res.redirect("/ownerPanel");
        }
    }
    )
    } catch (error) {
    console.log(error);
    }
};  

// router.get("/ownerPanel/update", (req, res) => {
//     const path = req.params.eventno;
//     const {EventName, EventDate, EventPlace, EventPrice, EventPhotoBackground,
//       EventPhotoUrl, PerformerName, EventCategory, EventCapacity,EventAddress, EventCity} = req.body;
  
//       db.query("UPDATE Snoll.Events SET EventName = ?, EventDate = ?, EventPlace = ?, EventPrice = ?, EventPhotoBackground = ?, EventPhotoUrl = ?, PerformerName = ?, EventCategory = ?, EventCapacity = ?, EventAddress = ?, EventCity = ?",
//       [EventName,EventDate, EventPlace, EventPrice, EventPhotoBackground,EventPhotoUrl, PerformerName, EventCategory, EventCapacity,EventAddress, EventCity],
//       (err, result) => {
//         if (err){
//           console.log(err);
//         }
//         res.redirect("/");
//       })
//   });

exports.update = (req, res) => {
    const eventno = req.params.eventno;
    const {EventName, EventDate, EventPlace, EventPrice,EventVipPrice, EventPhotoBackground,
            EventPhotoUrl, PerformerName, EventCategory, EventCapacity,EventVipCapacity,EventAddress, EventCity} = req.body;
            const etkinlik=[];

        db.query("UPDATE Snoll.Events SET EventName = ?, EventDate = ?, EventPlace = ?, EventPrice = ?,EventVipPrice=?, EventPhotoBackground = ?, EventPhotoUrl = ?, PerformerName = ?, EventCategory = ?, EventCapacity = ?,EventVipCapacity=?, EventAddress = ?, EventCity = ? WHERE EventNo = ?",
        [EventName,EventDate, EventPlace, EventPrice,EventVipPrice, EventPhotoBackground,EventPhotoUrl, PerformerName, EventCategory, EventCapacity,EventVipCapacity,EventAddress, EventCity, eventno],
        (err) => {
            if(err){
                console.log(err);
            };
            if (req.session.userRole == "admin") {
                res.redirect("/adminMain");
            };
            if (req.session.userRole == "owner") {
                res.redirect("/ownerMain");
            }; 
            db.query("SELECT * FROM Events Where EventNo = ?", [eventno], (err, result) => {
                const events = [];
                if (err) {
                  console.log(err);
                }
                if (result.length > 0) {
                  for (var i = 0; i < result.length; i++) {
                    var a = {
                      EventName: result[0].EventName,
                      EventAddress:result[0].EventAddress,
                      EventPlace:result[0].EventPlace,
                      EventPrice: result[0].EventPrice,
                      EventDate: result[0].EventDate,
                    };
                    events.push(a);
                  }
                  console.log(events);
                }
                db.query(
                  "SELECT * FROM ticket Where event_name = ?",
                  [events[0].EventName],
                  (err, result3) => {
                    const tickets = [];
                    if (err) {
                      console.log(err);
                      res.redirect("/notFound");
                    }
                    if (result3.length > 0) {
                      for (var i = 0; i < result3.length; i++) {
                        var b = {
                          EventName: result3[i].event_name,
                          user_email: result3[i].user_email,
                          ticketPrice: result3[i].ticketPrice,
                        };
                        tickets.push(b);
                      }
                      console.log("---------------------------------------");
                      console.log(tickets);
                      console.log("---------------------------------------");
                      for (i = 0; i < tickets.length; i++) {
                        var transporter = nodemailer.createTransport({
                          service: "gmail",
                          auth: {
                            user: "snolldestek@gmail.com",
                            pass: "snoll123",
                          },
                          tls: {
                            rejectUnauthorized: false,
                          },
                        });
            
                        var mailOptions = {
                          from: "snolldestek@gmail.com",
                          to: tickets[i].user_email,
                          subject: "Etkinlik Değişikliği",
                          text:"Merhabalar,bilet satın aldığınız bir etkinliğin bilgileri güncellenmiştir yeni bilgiler şu şekildedir.  " +
                          " Etkinlik adı  :" +
                          events[0].EventName +
                          "  Etkinlik adresi : " +
                          events[0].EventAddress +
                          "  Etkinlik tarihi :  " +
                          events[0].EventDate,
                        };
            
                        transporter.sendMail(mailOptions, function (error, info) {
                          if (error) {
                            console.log(error);
                          } else {
                            console.log("Email sent: " + info.response);
                          }
                        });
                      }
                    }
                  }
                ); 
            
        }
        )
    });
};