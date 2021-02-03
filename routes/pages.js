const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const nodemailer = require("nodemailer");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("myTotalySecretKey");

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

router.get("/", (req, res) => {
  db.query("SELECT * FROM Snoll.Events", async (err, result) => {
    const Events = [];
    for (var i = 0; i < result.length; i++) {
      if (i == 6) {
        break;
      }
      var a = {
        EventName: result[i].EventName,
        EventPhotoUrl: result[i].EventPhotoUrl,
      };
      Events.push(a);
    }

    res.render("index", {
      Events,
      email: req.session.emailAddress,
      loginn: req.session.loggedinUser,
      adminn: req.session.adminUser,
      ownerr: req.session.ownerUser,
    });
  });
});
router.get("/register", (req, res) => {
  res.render("register", {
    email: req.session.emailAddress,
    loginn: req.session.loggedinUser,
    message: req.session.message,
  });
});
router.get("/ticketSuccess", (req, res) => {
  res.render("ticketSuccess", {
    email: req.session.emailAddress,
    loginn: req.session.loggedinUser,
  });
});
router.get("/login", (req, res) => {
  res.render("login", {
    loginn: req.session.loggedinUser,
    email: req.session.emailAddress,
    message: req.session.message,
  });
});
router.get("/forgetPassword", (req, res) => {
  res.render("forgetPassword", {
    loginn: req.session.loggedinUser,
    email: req.session.emailAddress,
    message: req.session.message,
  });
});
router.get("/addCartError", function (req, res, next) {
  console.log(req.session.emailAddress);
  res.render("addCartError", {
    email: req.session.emailAddress,
    loginn: req.session.loggedinUser,
  });
});
router.get("/logout", function (req, res) {
  req.session.destroy();
  res.redirect("/");
});

router.get("/contactus", (req, res) => {
  if (req.session.loggedinUser) {
    console.log(req.session.emailAddress);
  }
  res.render("contactus", {
    email: req.session.emailAddress,
    loginn: req.session.loggedinUser,
    adminn: req.session.adminUser,
    ownerr: req.session.ownerUser,
  });
});
router.get("/Useragreement", (req, res) => {
  res.render("Useragreement", {
    email: req.session.emailAddress,
    loginn: req.session.loggedinUser,
    adminn: req.session.adminUser,
    ownerr: req.session.ownerUser,
  });
});
router.get("/events", (req, res) => {
  db.query("SELECT * FROM Snoll.Events", async (err, result) => {
    const Events = [];
    if (err) {
      console.log(err);
    } else {
      for (var i = 0; i < result.length; i++) {
        var a = {
          EventName: result[i].EventName,
          EventPhotoUrl: result[i].EventPhotoUrl,
        };
        Events.push(a);
      }
      res.render("events", {
        Events,
        email: req.session.emailAddress,
        loginn: req.session.loggedinUser,
        adminn: req.session.adminUser,
        ownerr: req.session.ownerUser,
      });
    }
  });
});

router.get("/events/:name", (req, res) => {
  var path = req.params.name;
  var today = new Date();
  db.query(
    "SELECT * FROM Snoll.Events WHERE Snoll.Events.EventName= ? ",
    [path],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        if (result[0].EventCapacity == 0) {
          var messages = "Bu etkinlik için bilet kalmamıştır";
          var capacityControl = true;
        }
        var eventdate = new Date(result[0].EventDate);
        if (eventdate.getTime() - today.getTime() < 0) {
          console.log(eventdate.getTime() - today.getTime());
          var messages = "Bu etkinliğin süresi geçmiştir";
          var dateControl = true;
        }
        const Event = [
          {
            EventName: result[0].EventName,
            EventDate: result[0].EventDate,
            EventPrice: result[0].EventPrice,
            EventVipPrice: result[0].EventVipPrice,
            PerformerName: result[0].PerformerName,
            EventCategory: result[0].EventCategory,
            EventCapacity: result[0].EventCapacity,
            EventVipCapacity: result[0].EventVipCapacity,
            EventAddress: result[0].EventAddress,
            EventCity: result[0].EventCity,
            EventPlace: result[0].EventPlace,
            EventPhotoUrl: result[0].EventPhotoUrl,
            EventPhotoBackground: result[0].EventPhotoBackground,
            EventNo: result[0].EventNo,
          },
        ];
        console.log(Event);
        res.render("ticket", {
          Event,
          messages,
          capacityControl,
          dateControl,
          email: req.session.emailAddress,
          loginn: req.session.loggedinUser,
          adminn: req.session.adminUser,
          ownerr: req.session.ownerUser,
        });
      }
    }
  );
});

router.get("/payment/:id", (req, res) => {
  if (req.session.emailAddress) {
    var path = req.params.id;
    res.render("payment", {
      path: path,
      email: req.session.emailAddress,
      loginn: req.session.loggedinUser,
      adminn: req.session.adminUser,
      ownerr: req.session.ownerUser,
    });
  } else {
    res.redirect("/notFound");
  }
});

router.get("/paymentsuccessfull/:id", (req, res) => {
  var path = req.params.id;
  if (req.session.emailAddress) {
    db.query(
      "SELECT * FROM Events WHERE Events.EventNo =?",
      [path],
      async (err, result) => {
        if (err) {
          console.log(err);
        }

        if (result.length > 0) {
          var Event = [
            {
              EventNo: result[0].EventNo,
              EventName: result[0].EventName,
              EventC: result[0].EventCapacity,
              EventVipC: result[0].EventVipCapacity,
              EventPrice:result[0].EventPrice,
              EventVipPrice: result[0].EventVipPrice,
              EventAddress: result[0].EventAddress,
              EventDate: result[0].EventDate,
            },
          ];
          console.log("EVENT: " + Event[0].EventC);
          if (Event[0].EventC > 0) {
            db.query(
              "INSERT INTO Ticket SET ?",
              {
                user_email: req.session.emailAddress,
                event_name: Event[0].EventName,
                ticketType: req.session.secim,
              },
              (error, result2) => {
                if (error) {
                  console.log(error);
                }
              }
            );
            db.query(
              "DELETE FROM Cart WHERE EventNo = ? AND UserEmail = ?",
              [Event[0].EventNo, req.session.emailAddress],
              (err, result) => {
                if (err) {
                  console.log(err);
                }
              }
            );
            console.log("Abi burda ne yazıyor abi"+req.session.secim)
            console.log(typeof req.session.secim)
            if(req.session.secim=="normal"){
              var denememail = req.session.emailAddress;
              console.log("Normal çalıştı");
              db.query(
                "UPDATE ticket SET ticketPrice = ? where user_email = ?",[Event[0].EventPrice, req.session.emailAddress],
                (error, result2) => {
                  if (error) {
                    console.log(error);
                  }
                
            db.query(
              `UPDATE Events SET EventCapacity = ${
                Event[0].EventC - 1
              } where EventNo = ${Event[0].EventNo}`,
              (error, result) => {
                if (error) {
                  console.log(error);
                } else {
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
                    to: req.session.emailAddress,
                    subject: "Biletiniz",
                    text:
                      "Merhabalar,bilet alma işleminizi başarıyla gerçekleştirdiniz bilet bilgilerinizi burada bulabilirsiniz bizi seçtiğiniz için teşekkür ederiz ." +
                      " Etkinlik adı  :" +
                      Event[0].EventName +
                      "  Etkinlik adresi : " +
                      Event[0].EventAddress +
                      "  Etkinlik tarihi :  " +
                      Event[0].EventDate,
                  };
                  transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                      console.log(error);
                    } else {
                      console.log("Email sent: " + info.response);
                    }
                  });
                  res.redirect("/ticketSuccess");
                }
              }
            );
          }
          );
            }else if(req.session.secim == "vip"){
              var denememail =req.session.emailAddress;
              console.log("Vip çalıştı");
              db.query(
                "UPDATE ticket SET ticketPrice = ? where user_email = ?",[Event[0].EventVipPrice, req.session.emailAddress],
                (error, result2) => {
                  if (error) {
                    console.log(error);
                  }
                
              db.query(
                `UPDATE Events SET EventVipCapacity = ${
                  Event[0].EventVipC - 1
                } where EventNo = ${Event[0].EventNo}`,
                (error, result) => {
                  if (error) {
                    console.log(error);
                  } else {
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
                      to: req.session.emailAddress,
                      subject: "Biletiniz",
                      text:
                        "Merhabalar,bilet alma işleminizi başarıyla gerçekleştirdiniz bilet bilgilerinizi burada bulabilirsiniz bizi seçtiğiniz için teşekkür ederiz ." +
                        " Etkinlik adı  :" +
                        Event[0].EventName +
                        "  Etkinlik adresi : " +
                        Event[0].EventAddress +
                        "  Etkinlik tarihi :  " +
                        Event[0].EventDate,
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                      if (error) {
                        console.log(error);
                      } else {
                        console.log("Email sent: " + info.response);
                      }
                    });
                    res.redirect("/ticketSuccess");
                  }
                }
              );
            }
            );
            }
          } else {
            res.redirect("/noCapacity");
          }
        }
      }
    );
  } else {
    res.redirect("/notFound");
  }
});

router.get("/aboutus", (req, res) => {
  res.render("aboutus", {
    email: req.session.emailAddress,
    loginn: req.session.loggedinUser,
    adminn: req.session.adminUser,
    ownerr: req.session.ownerUser,
  });
});

router.get("/privacypolicy", (req, res) => {
  res.render("privacypolicy", {
    email: req.session.emailAddress,
    loginn: req.session.loggedinUser,
    adminn: req.session.adminUser,
    ownerr: req.session.ownerUser,
  });
});

router.get("/category", (req, res) => {
  db.query("SELECT * FROM Snoll.Events", async (err, result) => {
    const Events = [];
    for (var i = 0; i < result.length; i++) {
      if (i == 4) {
        break;
      }
      var a = {
        EventName: result[i].EventName,
        EventPhotoUrl: result[i].EventPhotoUrl,
      };
      Events.push(a);
    }
    res.render("category", {
      Events,
      email: req.session.emailAddress,
      loginn: req.session.loggedinUser,
      adminn: req.session.adminUser,
      ownerr: req.session.ownerUser,
    });
  });
});

router.get("/cityguide", (req, res) => {
  db.query("SELECT * FROM Snoll.City", async (err, result) => {
    const City = [];
    if (err) {
      console.log(err);
    } else {
      for (var i = 0; i < result.length; i++) {
        var a = {
          CityName: result[i].CityName,
          CityPhoto: result[i].CityPhoto,
        };
        City.push(a);
      }
      res.render("cityguide", {
        City,
        email: req.session.emailAddress,
        loginn: req.session.loggedinUser,
        adminn: req.session.adminUser,
        ownerr: req.session.ownerUser,
      });
      console.log(City);
    }
  });
});

router.get("/cancelticket/:id", (req, res) => {
  var path = req.params.id;
  db.query(
    "SELECT * FROM Ticket WHERE ticket_id = ?",
    [path],
    (err, result1) => {
      if (err) {
        console.log(err);
      }
      if (result1.length > 0) {
        var Ticket = [
          {
            event_name: result1[0].event_name,
            ticket_id: result1[0].ticket_id,
            ticketPrice: result1[0].ticketPrice,
            ticketType: result1[0].ticketType,
          },
        ];
        db.query(
          "SELECT * FROM Events WHERE Events.EventName = ?",
          [Ticket[0].event_name],
          (err, result2) => {
            if (err) {
              console.log(err);
            }

            if (result2.length > 0) {
              var Event = [
                {
                  EventNo: result2[0].EventNo,
                  EventName: result2[0].EventName,
                  EventC: result2[0].EventCapacity,
                  EventVipCapacity: result2[0].EventVipCapacity,
                },
              ];
              if(Ticket[0].ticketType == "normal"){
              db.query(
                `UPDATE Snoll.Events SET EventCapacity = ${
                  Event[0].EventC + 1
                } WHERE EventNo = ${Event[0].EventNo}`,
                (err, result3) => {
                  if (err) {
                    console.log(err);
                  }
                }
              );
              }else{
                db.query(
                  `UPDATE Snoll.Events SET EventVipCapacity = ${
                    Event[0].EventVipCapacity + 1
                  } WHERE EventNo = ${Event[0].EventNo}`,
                  (err, result3) => {
                    if (err) {
                      console.log(err);
                    }
                  }
                );
              }
            }
          }
        );
      }
      db.query(
        "DELETE FROM Ticket WHERE ticket_id = ?",
        [path],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.redirect("/profile");
          }
        }
      );
    }
  );
});

router.get("/cityguide/:name", (req, res) => {
  var path = req.params.name;
  db.query(
    "SELECT * FROM Snoll.city WHERE Snoll.city.CityName= ? ",
    [path],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        const City = [
          {
            CityName: result[0].CityName,
            HistoryPlaces: result[0].HistoryPlaces,
            BeautyPlaces: result[0].BeautyPlaces,
            ArtPlaces: result[0].ArtPlaces,
            EatPlace: result[0].EatPlace,
            CitySummary: result[0].CitySummary,
            CityPhoto: result[0].CityPhoto,
          },
        ];
        console.log(City);
        res.render("city", {
          City,
          email: req.session.emailAddress,
          loginn: req.session.loggedinUser,
          adminn: req.session.adminUser,
          ownerr: req.session.ownerUser,
        });
      }
    }
  );
});
router.get("/category/Tiyatro", (req, res) => {
  db.query(
    "SELECT * FROM snoll.events WHERE EventCategory='Tiyatro' ",
    async (err, result) => {
      const Tiyatro = [];
      for (var i = 0; i < result.length; i++) {
        var a = {
          EventName: result[i].EventName,
          EventPhotoUrl: result[i].EventPhotoUrl,
        };
        Tiyatro.push(a);
      }
      res.render("Tiyatro", {
        Tiyatro,
        email: req.session.emailAddress,
        loginn: req.session.loggedinUser,
        adminn: req.session.adminUser,
        ownerr: req.session.ownerUser,
      });
    }
  );
});
router.get("/category/Muzik", (req, res) => {
  db.query(
    "SELECT * FROM snoll.events WHERE EventCategory='Müzik' ",
    async (err, result) => {
      const Music = [];
      for (var i = 0; i < result.length; i++) {
        var a = {
          EventName: result[i].EventName,
          EventPhotoUrl: result[i].EventPhotoUrl,
        };
        Music.push(a);
      }
      res.render("Muzik", {
        Music,
        email: req.session.emailAddress,
        loginn: req.session.loggedinUser,
        adminn: req.session.adminUser,
        ownerr: req.session.ownerUser,
      });
    }
  );
});

router.get("/category/Teknoloji", (req, res) => {
  db.query(
    "SELECT * FROM snoll.events WHERE EventCategory='Teknoloji' ",
    async (err, result) => {
      const Teknoloji = [];
      for (var i = 0; i < result.length; i++) {
        var a = {
          EventName: result[i].EventName,
          EventPhotoUrl: result[i].EventPhotoUrl,
        };
        Teknoloji.push(a);
      }
      res.render("Teknoloji", {
        Teknoloji,
        email: req.session.emailAddress,
        loginn: req.session.loggedinUser,
        adminn: req.session.adminUser,
        ownerr: req.session.ownerUser,
      });
    }
  );
});
router.get("/category/Spor", (req, res) => {
  db.query(
    "SELECT * FROM snoll.events WHERE EventCategory='Spor' ",
    async (err, result) => {
      const Spor = [];
      for (var i = 0; i < result.length; i++) {
        var a = {
          EventName: result[i].EventName,
          EventPhotoUrl: result[i].EventPhotoUrl,
        };
        Spor.push(a);
      }
      res.render("Spor", {
        Spor,
        email: req.session.emailAddress,
        loginn: req.session.loggedinUser,
        adminn: req.session.adminUser,
        ownerr: req.session.ownerUser,
      });
    }
  );
});
router.get("/profile", async (req, res) => {
  if (req.session.emailAddress) {
    const Detail = [];
    db.query(
      "SELECT * FROM Users join Ticket ON Users.email = Ticket.user_email",
      [req.session.emailAddress],
      (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result.length > 0) {
          for (var i = 0; i < result.length; i++) {
            if (result[i].email == req.session.emailAddress) {
              var a = {
                ticket_id: result[i].ticket_id,
                event_name: result[i].event_name,
              };
              Detail.push(a);
            }
          }
        }
      }
    );
    db.query(
      "SELECT * FROM Users WHERE Users.email = ?",
      [req.session.emailAddress],
      (err, result) => {
        const User = [];
        if (err) {
          console.log(err);
        }
        if (result.length > 0) {
          for (var i = 0; i < result.length; i++) {
            var x = [
              {
                firstname: result[i].firstname,
                lastname: result[i].lastname,
                email: result[i].email,
                role: result[i].role,
              },
            ];
            User.push(x);
          }
          var length = User.length;
          for (var j = 0; j < length - 1; j++) {
            console.log(j, User.length);
            User.pop();
          }

          res.render("profile", {
            User,
            Detail,
            email: req.session.emailAddress,
            loginn: req.session.loggedinUser,
            adminn: req.session.adminUser,
            ownerr: req.session.ownerUser,
          });
        }
      }
    );
  } else {
    res.redirect("/notFound");
  }
});
router.get("/EventPanel", (req, res) => {
  var today = new Date();
  if (req.session.userRole == "admin") {
    db.query("SELECT * FROM Events", (err, result) => {
      const Events = [];
      const pEvents = [];
      if (err) {
        console.log(err);
      } else {
        for (var i = 0; i < result.length; i++) {
          var eventDate = new Date(result[i].EventDate);
          if (
            result[i].owner_email == req.session.emailAddress &&
            eventDate.getTime() - today.getTime() > 0
          ) {
            var x = {
              EventNo: result[i].EventNo,
              EventName: result[i].EventName,
              EventDate: result[i].EventDate,
              EventPlace: result[i].EventPlace,
              EventPrice: result[i].EventPrice,
              EventVipPrice: result[i].EventVipPrice,
              EventPhotoBackground: result[i].EventPhotoBackground,
              EventPhotoUrl: result[i].EventPhotoUrl,
              PerformerName: result[i].PerformerName,
              EventCategory: result[i].EventCategory,
              EventCapacity: result[i].EventCapacity,
              EventVipCapacity: result[i].EventVipCapacity,
              EventAddress: result[i].EventAddress,
              EventCity: result[i].EventCity,
              owner_email: result[i].owner_email,
            };
            pEvents.push(x);
          } else if (
            result[i].owner_email != req.session.emailAddress &&
            eventDate.getTime() - today.getTime() > 0
          ) {
            var x = {
              EventNo: result[i].EventNo,
              EventName: result[i].EventName,
              EventDate: result[i].EventDate,
              EventPlace: result[i].EventPlace,
              EventVipPrice: result[i].EventVipPrice,
              EventPrice: result[i].EventPrice,
              EventPhotoBackground: result[i].EventPhotoBackground,
              EventPhotoUrl: result[i].EventPhotoUrl,
              PerformerName: result[i].PerformerName,
              EventCategory: result[i].EventCategory,
              EventVipCapacity: result[i].EventVipCapacity,
              EventCapacity: result[i].EventCapacity,
              EventAddress: result[i].EventAddress,
              EventCity: result[i].EventCity,
              owner_email: result[i].owner_email,
            };
            pEvents.push(x);
          } else if (
            result[i].owner_email == req.session.emailAddress &&
            eventDate.getTime() - today.getTime() < 0
          ) {
            var x = {
              EventNo: result[i].EventNo,
              EventName: result[i].EventName,
              EventDate: result[i].EventDate,
              EventPlace: result[i].EventPlace,
              EventVipPrice: result[i].EventVipPrice,
              EventPrice: result[i].EventPrice,
              EventPhotoBackground: result[i].EventPhotoBackground,
              EventPhotoUrl: result[i].EventPhotoUrl,
              PerformerName: result[i].PerformerName,
              EventCategory: result[i].EventCategory,
              EventVipCapacity: result[i].EventVipCapacity,
              EventCapacity: result[i].EventCapacity,
              EventAddress: result[i].EventAddress,
              EventCity: result[i].EventCity,
              owner_email: result[i].owner_email,
            };
            Events.push(x);
          } else {
            var a = {
              EventNo: result[i].EventNo,
              EventName: result[i].EventName,
              EventDate: result[i].EventDate,
              EventPlace: result[i].EventPlace,
              EventVipPrice: result[i].EventVipPrice,
              EventPrice: result[i].EventPrice,
              EventPhotoBackground: result[i].EventPhotoBackground,
              EventPhotoUrl: result[i].EventPhotoUrl,
              PerformerName: result[i].PerformerName,
              EventCategory: result[i].EventCategory,
              EventVipCapacity: result[i].EventVipCapacity,
              EventCapacity: result[i].EventCapacity,
              EventAddress: result[i].EventAddress,
              EventCity: result[i].EventCity,
              owner_email: result[i].owner_email,
            };
            Events.push(a);
          }
        }
        console.log(pEvents.length);
        res.render("EventPanel", {
          Events,
          pEvents,
          loginn: req.session.loggedinUser,
          email: req.session.emailAddress,
        });
      }
      res.render("EventPanel", {
        Events,
        loginn: req.session.loggedinUser,
        email: req.session.emailAddress,
      });
    });
  } else {
    res.redirect("/notFound");
  }
});
router.get("/UserPanel", (req, res) => {
  if (req.session.userRole == "admin") {
    db.query("SELECT * FROM Snoll.Users", async (err, result) => {
      const Users = [];
      if (result.length > 0) {
        for (var i = 0; i < result.length; i++) {
          var a = {
            role: result[i].role,
            email: result[i].email,
            id: result[i].id,
          };
          Users.push(a);
        }
      }
      res.render("UserPanel", {
        Users,
        email: req.session.emailAddress,
        loginn: req.session.loggedinUser,
        adminn: req.session.adminUser,
        ownerr: req.session.ownerUser,
      });
    });
  } else {
    res.redirect("/notFound");
  }
});
router.get("/CityPanel", (req, res) => {
  if (req.session.userRole == "admin") {
    db.query("SELECT * FROM Snoll.City", async (err, result) => {
      const City = [];
      if (result.length > 0) {
        for (var i = 0; i < result.length; i++) {
          var a = {
            CityName: result[i].CityName,
            CityPhoto: result[i].CityPhoto,
          };
          City.push(a);
        }
      }
      res.render("CityPanel", {
        City,
        email: req.session.emailAddress,
        loginn: req.session.loggedinUser,
        adminn: req.session.adminUser,
        ownerr: req.session.ownerUser,
      });
    });
  } else {
    res.redirect("/notFound");
  }
});

// router.get("/adminPanel", (req, res) => {
//   if (req.session.userRole == "admin") {
//     db.query("SELECT * FROM Snoll.City", async (err, result) => {
//       const City = [];
//       if (err) {
//         console.log(err);
//       }
//       if (result.length > 0) {
//         for (var i = 0; i < result.length; i++) {
//           var a = {
//             CityName: result[i].CityName,
//           };
//           City.push(a);
//         }
//       }
//       db.query("SELECT * FROM Snoll.Events", async (err, result) => {
//         const Events = [];
//         if (err) {
//           console.log(err);
//         }
//         if (result.length > 0) {
//           for (var i = 0; i < result.length; i++) {
//             var a = {
//               EventName: result[i].EventName,
//               EventNo: result[i].EventNo,
//             };
//             Events.push(a);
//           }
//         }
//         db.query("SELECT * FROM Snoll.Users", async (err, result) => {
//           const Users = [];
//           if (err) {
//             console.log(err);
//           }
//           if (result.length > 0) {
//             for (var i = 0; i < result.length; i++) {
//               var a = {
//                 role: result[i].role,
//                 email: result[i].email,
//                 id: result[i].id,
//               };
//               Users.push(a);
//             }
//             res.render("adminPanel", {
//               email: req.session.emailAddress,
//               loginn: req.session.loggedinUser,
//               Users,
//               Events,
//               City,
//             });
//           }
//         });
//       });
//     });
//   } else {
//     res.redirect("/notFound");
//   }
// });

router.get("/eventdeleteasadmin/:id", (req, res) => {
  const path = req.params.id;

  db.query("SELECT * FROM Events Where EventNo = ?", [path], (err, result) => {
    const events = [];
    if (err) {
      console.log(err);
    }
    if (result.length > 0) {
      for (var i = 0; i < result.length; i++) {
        var a = {
          EventName: result[0].EventName,
          EventPrice: result[0].EventPrice,
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
              subject: "Etkinlik İptali",
              text:
                "Bilet satın almış olduğunuz bir etkinlik iptal olmuştur yapmış olduğunuz " +
                tickets[i].ticketPrice +
                "₺ lik ödeme" +
                " tarafınıza en kısa sürede iletilecektir.",
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
        db.query(
          "DELETE FROM Events Where EventNo = ?",
          [path],
          (err, result) => {
            if (err) {
              console.log(err);
            }
            res.redirect("/EventPanel");
          }
        );
      }
    );
  });
});

router.get("/eventdeleteasowner/:id", (req, res) => {
  const path = req.params.id;

  db.query("SELECT * FROM Events Where EventNo = ?", [path], (err, result) => {
    const events = [];
    if (err) {
      console.log(err);
    }
    if (result.length > 0) {
      for (var i = 0; i < result.length; i++) {
        var a = {
          EventName: result[0].EventName,
          EventPrice: result[0].EventPrice,
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
              subject: "Etkinlik İptali",
              text:
                "Bilet satın almış olduğunuz bir etkinlik iptal olmuştur yapmış olduğunuz " +
                tickets[i].ticketPrice +
                "₺ lik ödeme" +
                " tarafınıza en kısa sürede iletilecektir.",
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
        db.query(
          "DELETE FROM Events Where EventNo = ?",
          [path],
          (err, result) => {
            if (err) {
              console.log(err);
            }
            res.redirect("/ownerPanel");
          }
        );
      }
    );
  });
});

router.get("/citydelete/:name", (req, res) => {
  const path = req.params.name;
  db.query("DELETE FROM City Where CityName = ?", [path], (err, result) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/CityPanel");
  });
});

router.get("/userdelete/:mail", (req, res) => {
  const path = req.params.mail;
  db.query("DELETE FROM Users Where email = ?", [path], (err, result) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/UserPanel");
  });
});

router.get("/setAdmin/:mail", (req, res) => {
  const path = req.params.mail;
  db.query(
    "UPDATE  Users SET role = 'admin' Where email = ?",
    [path],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.redirect("/UserPanel");
    }
  );
});

router.get("/setOwner/:mail", (req, res) => {
  const path = req.params.mail;
  db.query(
    "UPDATE  Users SET role = 'owner' Where email = ?",
    [path],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.redirect("/UserPanel");
    }
  );
});

router.get("/setUser/:mail", (req, res) => {
  const path = req.params.mail;
  db.query(
    "UPDATE  Users SET role = 'regUser' Where email = ?",
    [path],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.redirect("/UserPanel");
    }
  );
});

router.get("/UpdateEvent/:eventno", (req, res) => {
  const path = req.params.eventno;
  db.query("SELECT * FROM Events Where EventNo = ?", [path], (err, result) => {
    const Event = [];
    if (err) {
      console.log(err);
    }
    if (result.length > 0) {
      var data = {
        EventNo: result[0].EventNo,
        EventName: result[0].EventName,
        EventDate: result[0].EventDate,
        EventPlace: result[0].EventPlace,
        EventPrice: result[0].EventPrice,
        EventVipPrice: result[0].EventVipPrice,
        EventPhotoBackground: result[0].EventPhotoBackground,
        EventPhotoUrl: result[0].EventPhotoUrl,
        PerformerName: result[0].PerformerName,
        EventCategory: result[0].EventCategory,
        EventCapacity: result[0].EventCapacity,
        EventVipCapacity: result[0].EventVipCapacity,
        EventAddress: result[0].EventAddress,
        EventCity: result[0].EventCity,
        owner_email: result[0].owner_email,
      };
      Event.push(data);
    }
    res.render("UpdateEvent", {
      Event,
      loginn: req.session.loggedinUser,
      email: req.session.emailAddress,
    });
  });
});

router.get("/ownerPanel", (req, res) => {
  var today = new Date();
  if (req.session.userRole == "owner") {
    db.query("SELECT * FROM Events", (err, result) => {
      const Events = [];
      const pEvents = [];
      const ownerEvents = [];
      const pownerEvents = [];
      if (err) {
        console.log(err);
      } else {
        for (var i = 0; i < result.length; i++) {
          var eventDate = new Date(result[i].EventDate);
          if (
            result[i].owner_email == req.session.emailAddress &&
            eventDate.getTime() - today.getTime() > 0
          ) {
            var x = {
              EventNo: result[i].EventNo,
              EventName: result[i].EventName,
              EventDate: result[i].EventDate,
              EventPlace: result[i].EventPlace,
              EventPrice: result[i].EventPrice,
              EventVipPrice: result[i].EventVipPrice,
              EventPhotoBackground: result[i].EventPhotoBackground,
              EventPhotoUrl: result[i].EventPhotoUrl,
              PerformerName: result[i].PerformerName,
              EventCategory: result[i].EventCategory,
              EventCapacity: result[i].EventCapacity,
              EventVipCapacity: result[i].EventVipCapacity,
              EventAddress: result[i].EventAddress,
              EventCity: result[i].EventCity,
              owner_email: result[i].owner_email,
            };
            ownerEvents.push(x);
          } else if (
            result[i].owner_email == req.session.emailAddress &&
            eventDate.getTime() - today.getTime() < 0
          ) {
            var x = {
              EventNo: result[i].EventNo,
              EventName: result[i].EventName,
              EventDate: result[i].EventDate,
              EventPlace: result[i].EventPlace,
              EventPrice: result[i].EventPrice,
              EventVipPrice: result[i].EventVipPrice,
              EventPhotoBackground: result[i].EventPhotoBackground,
              EventPhotoUrl: result[i].EventPhotoUrl,
              PerformerName: result[i].PerformerName,
              EventCategory: result[i].EventCategory,
              EventCapacity: result[i].EventCapacity,
              EventVipCapacity: result[i].EventVipCapacity,
              EventAddress: result[i].EventAddress,
              EventCity: result[i].EventCity,
              owner_email: result[i].owner_email,
            };
            pownerEvents.push(x);
          } else if (
            result[i].owner_email != req.session.emailAddress &&
            eventDate.getTime() - today.getTime() > 0
          ) {
            var x = {
              EventNo: result[i].EventNo,
              EventName: result[i].EventName,
              EventDate: result[i].EventDate,
              EventPlace: result[i].EventPlace,
              EventPrice: result[i].EventPrice,
              EventVipPrice: result[i].EventVipPrice,
              EventPhotoBackground: result[i].EventPhotoBackground,
              EventPhotoUrl: result[i].EventPhotoUrl,
              PerformerName: result[i].PerformerName,
              EventCategory: result[i].EventCategory,
              EventCapacity: result[i].EventCapacity,
              EventVipCapacity: result[i].EventVipCapacity,
              EventAddress: result[i].EventAddress,
              EventCity: result[i].EventCity,
              owner_email: result[i].owner_email,
            };
            pEvents.push(x);
          } else {
            var a = {
              EventNo: result[i].EventNo,
              EventName: result[i].EventName,
              EventDate: result[i].EventDate,
              EventPlace: result[i].EventPlace,
              EventPrice: result[i].EventPrice,
              EventVipPrice: result[i].EventVipPrice,
              EventPhotoBackground: result[i].EventPhotoBackground,
              EventPhotoUrl: result[i].EventPhotoUrl,
              PerformerName: result[i].PerformerName,
              EventCategory: result[i].EventCategory,
              EventCapacity: result[i].EventCapacity,
              EventVipCapacity: result[i].EventVipCapacity,
              EventAddress: result[i].EventAddress,
              EventCity: result[i].EventCity,
              owner_email: result[i].owner_email,
            };
            Events.push(a);
          }
        }
        res.render("ownerPanel", {
          Events,
          ownerEvents,
          pownerEvents,
          pEvents,
          loginn: req.session.loggedinUser,
          email: req.session.emailAddress,
          adminn: req.session.adminUser,
          ownerr: req.session.ownerUser,
        });
      }
    });
  } else {
    res.redirect("/notFound");
  }
});
router.get("/ownerMain", (req, res) => {
  if (req.session.userRole == "owner") {
    const Event = [];
    db.query(
      "SELECT * FROM Events Where owner_email=? ",
      [req.session.emailAddress],
      (err, result) => {
        if (err) {
          console.log(err);
        }
        console.log(result);
        if (result.length > 0) {
          for (var i = 0; i < result.length; i++) {
            var a = {
              EventNo: result[i].EventNo,
              EventName: result[i].EventName,
              EventDate: result[i].EventDate,
              EventPlace: result[i].EventPlace,
              EventPrice: result[i].EventPrice,
              EventVipPrice: result[i].EventVipPrice,
              EventPhotoBackground: result[i].EventPhotoBackground,
              EventPhotoUrl: result[i].EventPhotoUrl,
              PerformerName: result[i].PerformerName,
              EventCategory: result[i].EventCategory,
              EventCapacity: result[i].EventCapacity,
              EventVipCapacity: result[i].EventVipCapacity,
              EventAddress: result[i].EventAddress,
              EventCity: result[i].EventCity,
              owner_email: result[i].owner_email,
            };
            Event.push(a);
          }
        }
      }
    );
    db.query(
      "SELECT * FROM Users WHERE Users.email = ?",
      [req.session.emailAddress],
      (err, result) => {
        const User = [];
        if (err) {
          console.log(err);
        }
        if (result.length > 0) {
          for (var i = 0; i < result.length; i++) {
            var x = [
              {
                firstname: result[i].firstname,
                lastname: result[i].lastname,
                email: result[i].email,
                role: result[i].role,
              },
            ];
            User.push(x);
          }
          var length = User.length;
          for (var j = 0; j < length - 1; j++) {
            console.log(j, User.length);
            User.pop();
          }

          res.render("ownerMain", {
            User,
            Event,
            loginn: req.session.loggedinUser,
            email: req.session.emailAddress,
            name: req.session.name,
            lastname: req.session.lname,
            adminn: req.session.adminUser,
            ownerr: req.session.ownerUser,
          });
        }
      }
    );
  } else {
    res.redirect("/notFound");
  }
});
router.get("/adminMain", (req, res) => {
  if (req.session.userRole == "admin") {
    const Event = [];
    db.query(
      "SELECT * FROM Events ",
      [req.session.emailAddress],
      (err, result) => {
        if (err) {
          console.log(err);
        }
        console.log(result);
        if (result.length > 0) {
          for (var i = 0; i < result.length; i++) {
            var a = {
              EventNo: result[i].EventNo,
              EventName: result[i].EventName,
              EventDate: result[i].EventDate,
              EventPlace: result[i].EventPlace,
              EventPrice: result[i].EventPrice,
              EventVipPrice: result[i].EventVipPrice,
              EventPhotoBackground: result[i].EventPhotoBackground,
              EventPhotoUrl: result[i].EventPhotoUrl,
              PerformerName: result[i].PerformerName,
              EventCategory: result[i].EventCategory,
              EventCapacity: result[i].EventCapacity,
              EventVipCapacity: result[i].EventVipCapacity,
              EventAddress: result[i].EventAddress,
              EventCity: result[i].EventCity,
              owner_email: result[i].owner_email,
            };
            Event.push(a);
          }
        }
      }
    );
    db.query(
      "SELECT * FROM Users WHERE Users.email = ?",
      [req.session.emailAddress],
      (err, result) => {
        const User = [];
        if (err) {
          console.log(err);
        }
        if (result.length > 0) {
          for (var i = 0; i < result.length; i++) {
            var x = [
              {
                firstname: result[i].firstname,
                lastname: result[i].lastname,
                email: result[i].email,
                role: result[i].role,
              },
            ];
            User.push(x);
          }
          var length = User.length;
          for (var j = 0; j < length - 1; j++) {
            console.log(j, User.length);
            User.pop();
          }

          res.render("adminMain", {
            User,
            Event,
            loginn: req.session.loggedinUser,
            email: req.session.emailAddress,
            name: req.session.name,
            lastname: req.session.lname,
            adminn: req.session.adminUser,
            ownerr: req.session.ownerUser,
          });
        }
      }
    );
  } else {
    res.redirect("/notFound");
  }
});

router.get("/eventdeleteasowner/:id", (req, res) => {
  const path = req.params.id;
  db.query("DELETE FROM Events Where EventNo = ?", [path], (err, result) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/ownerPanel");
  });
});
router.get("/eventdeleteasadmin/:id", (req, res) => {
  const path = req.params.id;
  db.query("DELETE FROM Events Where EventNo = ?", [path], (err, result) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/EventPanel");
  });
});

router.get("/registerSuccess", (req, res) => {
  res.render("registerSuccess", {
    loginn: req.session.loggedinUser,
    email: req.session.emailAddress,
    name: req.session.name,
    lastname: req.session.lname,
  });
});
router.get("/contactusSuccess", (req, res) => {
  res.render("contactusSuccess", {
    loginn: req.session.loggedinUser,
    email: req.session.emailAddress,
    contactname: req.session.contactname,
  });
});

router.get("/noCapacity", (req, res) => {
  res.render("noCapacity", {
    loginn: req.session.loggedinUser,
    email: req.session.emailAddress,
  });
});
router.get("/notFound", (req, res) => {
  res.render("notFound", {
    email: req.session.emailAddress,
    loginn: req.session.loggedinUser,
  });
});
router.get("/myCart", async (req, res) => {
  const Detail = [];
  db.query(
    "SELECT * FROM cart WHERE UserEmail=?",
    [req.session.emailAddress],
    async (err, result) => {
      if (err) {
        console.log(err);
      } else {
        for (var i = 0; i < result.length; i++) {
          if (result[i].UserEmail == req.session.emailAddress) {
            console.log(result[i].UserEmail);
            var a = [
              {
                EventNo: result[i].EventNo,
                EventName: result[i].EventName,
                EventPrice: result[i].EventPrice,
              },
            ];
            Detail.push(a);
          }
        }
        console.log("---------");
        console.log(Detail);
        res.render("myCart", {
          Detail,
          email: req.session.emailAddress,
          loginn: req.session.loggedinUser,
          adminn: req.session.adminUser,
          ownerr: req.session.ownerUser,
        });
      }
    }
  );
});
router.get("/deletefromcart/:id", (req, res) => {
  const path = req.params.id;
  db.query(
    "DELETE FROM Cart WHERE EventNo = ? AND UserEmail = ?",
    [path, req.session.emailAddress],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.redirect("/myCart");
    }
  );
});
router.post("/addcart/:no", (req, res) => {
  var path = req.params.no;
  const { secim } = req.body;
  req.session.secim = secim;
  console.log("-----------------")
  console.log(req.session.secim);
  console.log("-------------------------------")
  if(secim == "vip"){
  db.query(
    "SELECT * FROM Snoll.Events WHERE Snoll.Events.EventNo= ? ",
    [path],
    (err, result2) => {
      if (err) {
        console.log(err);
      } else {
        if(result2[0].EventVipCapacity == 0){
          res.redirect("/categoryControl");
        }else{
          db.query(
            "SELECT * FROM Snoll.Events WHERE Snoll.Events.EventNo= ? ",
            [path],
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                const Event = [
                  {
                    EventName: result[0].EventName,
                    EventDate: result[0].EventDate,
                    EventPrice: result[0].EventPrice,
                    EventVipPrice : result[0].EventVipPrice,
                    PerformerName: result[0].PerformerName,
                    EventCategory: result[0].EventCategory,
                    EventCapacity: result[0].EventCapacity,
                    EventVipCapacity : result[0].EventVipCapacity,
                    EventAddress: result[0].EventAddress,
                    EventCity: result[0].EventCity,
                    EventPlace: result[0].EventPlace,
                    EventPhotoUrl: result[0].EventPhotoUrl,
                    EventPhotoBackground: result[0].EventPhotoBackground,
                    EventNo: result[0].EventNo,
                  },
                ];
                db.query(
                  "INSERT INTO Cart SET ?",
                  {
                    EventName: Event[0].EventName,
                    UserEmail: req.session.emailAddress,
                    EventPrice: Event[0].EventVipPrice,
                    EventNo: Event[0].EventNo,
                  },
                  (error, result2) => {
                    if (error) {
                      console.log(error);
                      res.redirect("/addCartError");
                    } else {
                      res.redirect("/myCart");
                    }
                  }
                );
              }
            }
          );
        }
      }
    }
  );
  }else{
    db.query(
      "SELECT * FROM Snoll.Events WHERE Snoll.Events.EventNo= ? ",
      [path],
      (err, result3) => {
        if (err) {
          console.log(err);
        } else {
          if(result3[0].EventCapacity == 0){
            res.redirect("/categoryControl");
          }else{
            db.query(
              "SELECT * FROM Snoll.Events WHERE Snoll.Events.EventNo= ? ",
              [path],
              (err, result) => {
                if (err) {
                  console.log(err);
                } else {
                  const Event = [
                    {
                      EventName: result[0].EventName,
                      EventDate: result[0].EventDate,
                      EventPrice: result[0].EventPrice,
                      EventVipPrice : result[0].EventVipPrice,
                      PerformerName: result[0].PerformerName,
                      EventCategory: result[0].EventCategory,
                      EventCapacity: result[0].EventCapacity,
                      EventVipCapacity : result[0].EventVipCapacity,
                      EventAddress: result[0].EventAddress,
                      EventCity: result[0].EventCity,
                      EventPlace: result[0].EventPlace,
                      EventPhotoUrl: result[0].EventPhotoUrl,
                      EventPhotoBackground: result[0].EventPhotoBackground,
                      EventNo: result[0].EventNo,
                    },
                  ];
                  db.query(
                    "INSERT INTO Cart SET ?",
                    {
                      EventName: Event[0].EventName,
                      UserEmail: req.session.emailAddress,
                      EventPrice: Event[0].EventPrice,
                      EventNo: Event[0].EventNo,
                    },
                    (error, result2) => {
                      if (error) {
                        console.log(error);
                        res.redirect("/addCartError");
                      } else {
                        res.redirect("/myCart");
                      }
                    }
                  );
                }
              }
            );
          }
        }
      }
    );
  }
});

router.get("/forgetSuccess", (req, res) => {
  res.render("forgetSuccess", {
    loginn: req.session.loggedinUser,
  });
});
router.get("/resetPassword/:mail", (req, res) => {
  var path = req.params.mail;
  if (path.length < 30) {
    res.redirect("/notFound");
  }
  res.render("passwordConfirmation", {
    pathh: path,
    message: req.session.message,
    loginn: req.session.loggedinUser,
  });
});
router.post("/passwordChange/:mail", async (req, res) => {
  var path = req.params.mail;
  const decryptedEmail = cryptr.decrypt(path);
  const { password, passwordConfirm } = req.body;
  if (password !== passwordConfirm) {
    res.render("passwordConfirmation", {
      message: "Passwords do not match",
      pathh: path,
      loginn: req.session.loggedinUser,
    });
  } else {
    let hashedPass = await bcrypt.hash(password, 8);
    db.query(
      "UPDATE users SET password = ? where email = ? ",
      [hashedPass, decryptedEmail],
      (error, result) => {
        if (error) {
          console.log(error);
        } else {
          res.render("changeSuccess", {
            loginn: req.session.loggedinUser,
          });
        }
      }
    );
  }
});
//Easter Egg
router.get("/control", (req, res) => {
  const encryptedString = cryptr.encrypt("salih.coskun@isik.edu.tr");
  console.log(encryptedString);
  const decryptedString = cryptr.decrypt(encryptedString);
  console.log(decryptedString);
  res.redirect("/");
});
router.get("/categoryControl", (req, res) => {
  res.render("categoryControl", {
    email: req.session.emailAddress,
    loginn: req.session.loggedinUser,
    message: req.session.message,
  });
});
module.exports = router;
