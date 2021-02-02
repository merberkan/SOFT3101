const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
var express = require("express");
var router = express.Router();
var nodemailer = require("nodemailer");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("myTotalySecretKey");
mysql.createConnection({ multipleStatements: true });

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const loggedinUser = Boolean;
    const emailAddress = email;
    let userRole;
    if (!email || !password) {
      return res.status(400).render("login", {
        message: "please provide an email or password ",
        loginn: req.session.loggedinUser,
      });
    }
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (error, results) => {
        console.log(results);
        if(results[0].role == "admin"){
          req.session.adminUser = true;
        }if(results[0].role == "owner"){
          req.session.ownerUser = true;
        }
        if (
          results == "" ||
          !(await bcrypt.compare(password, results[0].password))
        ) {
          req.session.message = "email or password incorrect";
          res.render("login", {
            message: req.session.message,
            loginn: req.session.loggedinUser,
            adminn: req.session.adminUser,
            ownerr: req.session.ownerUser,
          });
        } else {
          const id = results[0].id;
          const token = jwt.sign(
            {
              id: id,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: process.env.JWT_EXPIRES_IN,
            }
          );
          console.log("the token is :" + token);
          const cookieOptions = {
            expires: new Date(
              Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
          };
          res.cookie("jwt", token, cookieOptions);
          req.session.loggedinUser = true;
          req.session.emailAddress = email;
          req.session.userRole = results[0].role;
          console.log(req.session.userRole);
          // sessionStorage.setItem(email,emailAddress);
          // console.log(emailAddress);
          //     return res.status(200).redirect('dashboard', {
          //         email : emailAddress
          //     });
          if (req.session.userRole == "admin") {
            res.redirect("/adminMain");
          } else if (req.session.userRole == "owner") {
            res.redirect("/ownerMain");
          } else {
            res.redirect("/");
          }
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
exports.register = (req, res) => {
  console.log(req.body);
  // const name = req.body.name;
  // const email = req.body.email;
  // const password = req.body.password;
  // const passwordConfirm = req.body.passwordConfirm;
  // Aşağıdaki satır yukarıda yazdığımın aynısı kısa hali
  const { name, lastname, email, password, passwordConfirm } = req.body;
  db.query(
    "SELECT email FROM users WHERE email = ?",
    [email],
    async (error, results) => {
      if (error) {
        console.log(error);
      }
      if (results.length > 0) {
        res.render("register", {
          message: "That Email is already in use",
          loginn: req.session.loggedinUser,
        });
      } else if (password !== passwordConfirm) {
        res.render("register", {
          message: "Passwords do not match",
          loginn: req.session.loggedinUser,
        });
      } else {
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);
        db.query(
          "INSERT INTO users SET ? ",
          {
            role: "regUser",
            password: hashedPassword,
            email: email,
            firstname: name,
            lastname: lastname,
          },
          (err, results) => {
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
                to: email,
                subject: "Tebrikler",
                text:
                  "Tebrikler başarılı bir şekilde sitemize kayıt oldunuz! Email adresiniz : " +
                  email,
              };

              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log("Email sent: " + info.response);
                }
              });
              console.log(results);
              req.session.name = name;
              req.session.lname = lastname;
              return res.redirect("/registerSuccess");
            }
          }
        );
      }
    }
  );
};

exports.contactus = (req, res) => {
  console.log("çalıştı");

  const { nameS, contactmail, message } = req.body;
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
    to: contactmail,
    subject: "Destek Talebi",
    text:
      "Merhabalar Sayın " +
      nameS +
      " Gönderdiğiniz mesaj destek ekiplerimiz tarafından incelemeye" +
      " alınmıştır. En kısa sürede tarafınızla iletişime geçilecektir.",
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  var mailOptions = {
    from: "snolldestek@gmail.com",
    to: "snolldestek@gmail.com",
    subject: "Destek Ekibinin Dikkatine ",
    text:
      "Destek ekibinin dikkatine " +
      nameS +
      " isimli kullanıcı destek ekibimize şu mesajı bıraktı " +
      message +
      " En kısa sürede değerlendirilip kullanıcıya geri dönülmesi gerekmektedir . İyi çalışmalar",
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  req.session.contactname = nameS;
  res.redirect("/contactusSuccess");
};

exports.adminPanel = (req, res) => {
  try {
    const {
      EventNo,
      EventName,
      EventDate,
      EventPlace,
      EventPrice,
      EventPhotoBackground,
      EventPhotoUrl,
      PerformerName,
      EventCategory,
      EventCapacity,
      EventAddress,
      EventCity,
      owner_email,
    } = req.body;
    db.query(
      "INSERT INTO Events SET ?",
      {
        EventNo: EventNo,
        EventName: EventName,
        EventDate: EventDate,
        EventPlace: EventPlace,
        EventPrice: EventPrice,
        EventPhotoBackground: EventPhotoBackground,
        EventPhotoUrl: EventPhotoUrl,
        PerformerName: PerformerName,
        EventCategory: EventCategory,
        EventCapacity: EventCapacity,
        EventAddress: EventAddress,
        EventCity: EventCity,
        owner_email: owner_email,
      },
      (err, results) => {
        if (err) {
          console.log(err);
        } else {
          return res.redirect("/EventPanel");
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

exports.contactus = (req, res) => {
  console.log("çalıştı");

  const { nameS, contactmail, message } = req.body;
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
    to: contactmail,
    subject: "Destek Talebi",
    text:
      "Merhabalar Sayın " +
      nameS +
      " Gönderdiğiniz mesaj destek ekiplerimiz tarafından incelemeye" +
      " alınmıştır. En kısa sürede tarafınızla iletişime geçilecektir.",
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  var mailOptions = {
    from: "snolldestek@gmail.com",
    to: "snolldestek@gmail.com",
    subject: "Destek Ekibinin Dikkatine ",
    text:
      "Destek ekibinin dikkatine " +
      nameS +
      " isimli kullanıcı destek ekibimize şu mesajı bıraktı " +
      message +
      " En kısa sürede değerlendirilip kullanıcıya geri dönülmesi gerekmektedir . İyi çalışmalar",
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  req.session.contactname = nameS;
  res.redirect("/contactusSuccess");
};

exports.forgetPasswordSendMail = (req, res) => {
  const { email } = req.body;
  const loggedinUser = Boolean;
  const emailAddress = email;
  let userRole;
  if (!email) {
    return res.status(400).render("forgetPassword", {
      message: "Email kısmı boş bırakılamaz",
      loginn: req.session.loggedinUser,
    });
  }
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (error, results) => {
      console.log(results);
      if (results == "") {
        req.session.message = "email sistemde kayıtlı değil";
        res.render("forgetPassword", {
          message: req.session.message,
          loginn: req.session.loggedinUser,
        });
      } else {
        const encryptedemail = cryptr.encrypt(email);
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
          to: email,
          subject: "Tebrikler",
          text:
            "Burada ki bağlantıyı kullanarak şifrenizi sıfırlayabilirsiniz http://localhost:3000/resetPassword/" +
            encryptedemail +
            " Bizi tercih ettiğiniz için teşekkür ederiz",
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
        res.redirect("/forgetSuccess");
      }
    }
  );
};
