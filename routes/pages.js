const { decodeBase64 } = require("bcryptjs");
const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

router.get("/", (req, res) => {
  db.query("SELECT * FROM Snoll.Events", async (err, result) => {
    const Events = [];
    for (var i = 0; i < result.length; i++) {
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
router.get("/login", (req, res) => {
  res.render("login", {
    loginn: req.session.loggedinUser,
    email: req.session.emailAddress,
    message: req.session.message,
  });
});
router.get("/dashboard", function (req, res, next) {
  console.log(req.session.emailAddress);
  res.render("dashboard", {
    email: req.session.emailAddress,
    loginn: req.session.loggedinUser,
  });
});
router.get("/logout", function (req, res) {
  req.session.destroy();
  res.redirect("/");
});
// router.get("/anasayfa", (req, res) => {
//   res.render("anasayfa", {
//     email: req.session.emailAddress,
//     loginn: req.session.loggedinUser,
//   });
// });
router.get("/contactus", (req, res) => {
  if (req.session.loggedinUser) {
    console.log(req.session.emailAddress);
  }
  res.render("contactus", {
    email: req.session.emailAddress,
    loginn: req.session.loggedinUser,
  });
});
router.get("/Useragreement", (req, res) => {
  res.render("Useragreement", {
    email: req.session.emailAddress,
    loginn: req.session.loggedinUser,
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
      });
    }
  });
});

router.get("/events/:name", (req, res) => {
  var path = req.params.name;
  db.query(
    "SELECT * FROM Snoll.Events WHERE Snoll.Events.EventName= ? ",
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
            PerformerName: result[0].PerformerName,
            EventCategory: result[0].EventCategory,
            EventCapacity: result[0].EventCapacity,
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
          email: req.session.emailAddress,
          loginn: req.session.loggedinUser,
        });
      }
    }
  );
});

router.get("/payment/:id", (req, res) => {
  var path = req.params.id;
          res.render("payment", {
              path: path,
              email: req.session.emailAddress,
              loginn: req.session.loggedinUser,
            });
});

router.get("/paymentsuccessfull/:id", (req, res) => {
  var path = req.params.id;
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
          },
        ];
      }
      db.query(
        "INSERT INTO Ticket SET ?",
        {
          user_email: req.session.emailAddress,
          event_name: Event[0].EventName,
        },
        (error, result2) => {
          if (error) {
            console.log(error);
          } else {
            res.redirect("/profile");
          }
        }
      );
    }
  );
});



router.get("/aboutus", (req, res) => {
  res.render("aboutus", {
    email: req.session.emailAddress,
    loginn: req.session.loggedinUser,
  });
});

router.get("/privacypolicy", (req, res) => {
  res.render("privacypolicy", {
    email: req.session.emailAddress,
    loginn: req.session.loggedinUser,
  });
});
router.get("/category", (req, res) => {
  db.query("SELECT * FROM snoll.events", async (err, result) => {
    res.render("category", {
      email: req.session.emailAddress,
      loginn: req.session.loggedinUser,
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
      });
      console.log(City);
    }
  });
});

router.get("/cancelticket/:id", (req, res) => {
  var path = req.params.id;
  db.query("DELETE FROM Ticket Where ticket_id = ?", [path], (err, result) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/profile");
  });
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
      });
    }
  );
});
router.get("/profile", async (req, res) => {
  const Detail = [];
  const User = [];
  db.query(
    "SELECT * FROM Users join Ticket ON Users.email = Ticket.user_email",
    [req.session.emailAddress],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        for (var i = 0; i < result.length; i++) {
          if (result[i].email == req.session.emailAddress) {
            var x = [
              {
                firstname: result[i].firstname,
                lastname: result[i].lastname,
                email: result[i].email,
                role: result[i].role,
              },
            ];
            var a = {
              ticket_id: result[i].ticket_id,
              event_name: result[i].event_name,
            };
            User.push(x);
            Detail.push(a);
          }
        }
        var length = User.length;
        for (var j = 0; j < length - 1; j++) {
          console.log(j, User.length);
          User.pop();
        }
        console.log("---------");
        console.log(User.length);
        console.log(Detail);

        res.render("profile", {
          User,
          Detail,
          email: req.session.emailAddress,
          loginn: req.session.loggedinUser,
        });
      }
    }
  );
});

router.get("/adminPanel", (req, res) => {
  db.query("SELECT * FROM Snoll.City", async (err, result) => {
    const City = [];
    if (err) {
      console.log(err);
    } 
    if (result.length>0) {
      for (var i = 0; i < result.length; i++) {
        var a = {
          CityName: result[i].CityName,
          
        };
        City.push(a);
      }
    }
    db.query("SELECT * FROM Snoll.Events", async (err, result) => {
      const Events = [];
      if (err) {
        console.log(err);
      } if(result.length >0) {
        for (var i = 0; i < result.length; i++) {
          var a = {
            EventName: result[i].EventName,
            EventNo: result[i].EventNo,
          };
          Events.push(a);
        }
      }
      db.query("SELECT * FROM Snoll.Users", async (err, result) => {
        const Users = [];
        if (err) {
          console.log(err);
        } if(result.length >0) {
          for (var i = 0; i < result.length; i++) {
            var a = {
              role: result[i].role,
              email: result[i].email,
              id:result[i].id,
            };
            Users.push(a);
          }
        res.render("adminPanel", {
        email: req.session.emailAddress,
        loginn: req.session.loggedinUser,
        Users,
        Events,
        City,
        });
        }
        
      }
      );
      
    }
    );
    
  });
  
});

router.get("/eventdelete/:id", (req, res) => {
  const path = req.params.id;
  db.query("DELETE FROM Events Where EventNo = ?", [path], (err, result) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/adminPanel");
  });
});

router.get("/citydelete/:name", (req, res) => {
  const path = req.params.name;
  db.query("DELETE FROM City Where CityName = ?", [path], (err, result) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/adminPanel");
  });
});

router.get("/userdelete/:id", (req, res) => {
  const path = req.params.id;
  db.query("DELETE FROM Users Where id = ?", [path], (err, result) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/adminPanel");
  });
});

router.get("/setAdmin/:mail", (req, res) => {
  const path = req.params.mail;
  db.query("UPDATE  Users SET role = 'admin' Where email = ?", [path], (err, result) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/adminPanel");
  });
});

router.get("/setOwner/:mail", (req, res) => {
  const path = req.params.mail;
  db.query("UPDATE  Users SET role = 'owner' Where email = ?", [path], (err, result) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/adminPanel");
  });
});

router.get("/setUser/:mail", (req, res) => {
  const path = req.params.mail;
  db.query("UPDATE  Users SET role = 'regUser' Where email = ?", [path], (err, result) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/adminPanel");
  });
});

router.get("/ownerPanel", (req, res) => {
  db.query("SELECT * FROM Events", (err, result) => {
    const Events = [];
      if (err) {
        console.log(err);
      }else{
        for (var i = 0; i < result.length; i++) {
          var a = {
            EventName: result[i].EventName,
            EventNo: result[i].EventNo,
          };
          Events.push(a);
        }
        res.render("ownerPanel", {
          Events,
          loginn: req.session.loggedinUser,
          email: req.session.emailAddress,
        });
      }
  })
})

router.get("/eventdeleteasowner/:id", (req, res) => {
  const path = req.params.id;
  db.query("DELETE FROM Events Where EventNo = ?", [path], (err, result) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/ownerPanel");
  });
});




router.get("/registerSuccess", (req, res) => {
  res.render("registerSuccess", {
    loginn: req.session.loggedinUser,
    email: req.session.emailAddress,
    name : req.session.name,
    lastname : req.session.lname,
  });
});
router.get("/contactusSuccess", (req, res) => {
  res.render("contactusSuccess", {
    loginn: req.session.loggedinUser,
    email: req.session.emailAddress,
    contactname : req.session.contactname,
  });
});
router.get("/notFound", (req, res) => {
  res.render("notFound", {
    email: req.session.emailAddress,
    loginn: req.session.loggedinUser,
  });
});
// router.get("/myCart", async (req, res) => {
//   const Detail = [];
//   db.query("SELECT * FROM cart WHERE UserEmail=?",
//   [req.session.emailAddress],
//   (err,result) => {
//     if(err){
//       console.log(err);
//     } else {
//       for (var i = 0; i < result.length; i++) {
//         if(result[i].email == req.session.emailAddress){
//           var a = [
//           {
//               event_no: result[i].event_no,
//               event_name: result[i].event_name,
//               event_price: result[i].event_price,
//           },
//         ];
//           Detail.push(a);
//         }
//       }
//     console.log("---------");
//         console.log(Detail);
//   res.render("myCart", {
//     Detail,
//     email: req.session.emailAddress,
//     loginn: req.session.loggedinUser,
//   });
//     }
//   });
// });

// router.get("/cancelEvent/:eventNo" , (req,res) => {
//   var path = req.params.EventNo;
//   db.query("DELETE FROM Event WHERE EventNo = ?" , [path], (err, result) => {
//     if(err) {
//       console.log(err);
//     }
//     res.redirect("/myCart");
//   });
// });
module.exports = router;
