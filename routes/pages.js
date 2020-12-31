const { decodeBase64 } = require("bcryptjs");
const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

router.get("/", (req, res) => {
  res.render("index", {
    email: req.session.emailAddress,
    loginn: req.session.loggedinUser,
  });
});
router.get("/register", (req, res) => {
  res.render("register", { message: req.session.message });
});
router.get("/login", (req, res) => {
  res.render("login", { message: req.session.message });
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
  res.render("events", {
    email: req.session.emailAddress,
    loginn: req.session.loggedinUser,
  });
});
router.get("/aboutus", (req, res) => {
  res.render("aboutus", {
    email: req.session.emailAddress,
    loginn: req.session.loggedinUser,
  });
});
router.get("/payment", (req, res) => {
  res.render("payment", {
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
    const Category = [];
    for (var i = 0; i < result.length; i++) {
      var a = { EventCategory: result[i].EventCategory };
      Category.push(a);
    }
    res.render("category", {
      Category,
      email: req.session.emailAddress,
      loginn: req.session.loggedinUser,
    });
  });
});

router.get("/cityguide", (req, res) => {
  db.query('SELECT * FROM Snoll.City', async (err, result) => {
    const City = [];
    if(err){
      console.log(err);
    }else{
      for(var i = 0; i<result.length; i++){
        var a = {CityName: result[i].CityName};
        City.push(a);
      }
      res.render("cityguide", {
        City,
        email: req.session.emailAddress,
        loginn: req.session.loggedinUser
      });
      console.log(City);
    }
  })
});

router.get("/cityguide/:name", (req,res) => {
      var path = req.params.name;
      db.query("SELECT * FROM Snoll.city WHERE Snoll.city.CityName= ? ", [path],  (err,result) => {
        if(err){
          console.log(err);
        }else{
          const City = [{CityName: result[0].CityName, HistoryPlaces: result[0].HistoryPlaces, BeautyPlaces: result[0].BeautyPlaces, ArtPlaces: result[0].ArtPlaces,
          EatPlace: result[0].EatPlace, CitySummary: result[0].CitySummary}];
          console.log(City);
          res.render("city",{
            City,
            email: req.session.emailAddress,
            loginn: req.session.loggedinUser
          });
        }
      })
});



// var a = {CityName: result[i].CityName, HistoryPlaces: result[i].HistoryPlaces, BeautyPlaces: result[i].BeautyPlaces, ArtPlaces: result[i].ArtPlaces,
//   EatPlaces: result[i].EatPlaces, CitySummary: result[i].CitySummary};

router.get("/ticket", (req, res) => {
  res.render("ticket", {
    email: req.session.emailAddress,
    loginn: req.session.loggedinUser,
  });
});
router.get("/category/Tiyatro", (req, res) => {
  db.query(
    "SELECT * FROM snoll.events WHERE EventCategory='Tiyatro' ",
    async (err, result) => {
      const Tiyatro = [];
      for (var i = 0; i < result.length; i++) {
        var a = { EventName: result[i].EventName };
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
router.get("/category/M%C3%BCzik", (req, res) => {
  db.query(
    "SELECT * FROM snoll.events WHERE EventCategory='Müzik' ",
    async (err, result) => {
      const Music = [];
      for (var i = 0; i < result.length; i++) {
        var a = { EventName: result[i].EventName };
        Music.push(a);
      }
      res.render("Müzik", {
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
        var a = { EventName: result[i].EventName };
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
        var a = { EventName: result[i].EventName };
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
router.get("/profile", (req, res) => {
  res.render("profile", {
    email: req.session.emailAddress,
    loginn: req.session.loggedinUser,
  });
});
router.get("/adminPanel", (req, res) => {
  res.render("adminPanel", {
    email: req.session.emailAddress,
    loginn: req.session.loggedinUser,
  });
});
module.exports = router;
