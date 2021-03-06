const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");

//importing schema's
const User = require("./model/User");
const Item = require("./model/Item");

//intialization of express
const app = express();

//BodyParser middleware
app.use(bodyParser.json());

//DB config
const db = config.get("mongoURL");
// const db = require("./config/default").mongoURL;

//email verifying which is real account or not
var transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "oak64426442@gmail.com",
    pass: "Chandu@123"
  }
});

//validation User
app.post("/validation/:token1", (req, res) => {
  const { token1 } = req.params;
  console.log(token1);
  User.updateOne({ token: token1 }, { isuser: true }, function(err, raw) {
    if (err) {
      res.send(err);
    }
  });
});

//user Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ msg: "please enter all fields" });
  }
  User.findOne({ email }).then(user => {
    if (!user) return res.json({ msg: "User Does not exists" });
    //Validate password
    bcrypt
      .compare(password, user.password)
      .then(res1 => {
        if (user.isuser) {
          jwt.sign({ id: user.id }, config.get("jwtSecret"), (err, token) => {
            if (err) throw err;
            res.json({ token, user });
          });
        } else {
          return res.json({ msg: "Please Verify your email" });
        }
      })
      .catch(err => {
        console.log(err);
      });
  });
});

// User Registration
app.post("/register", (req, res) => {
  const { name, email, phone, password } = req.body;
  User.findOne({ email }).then(user => {
    if (user) return res.json({ msg: "email already exists" });
    User.findOne({ phone }).then(user => {
      if (user) return res.json({ msg: "phone already exists" });
      jwt.sign({ id: email }, config.get("jwtSecret"), (err, token) => {
        if (err) throw err;
        const newUser = new User({
          name,
          email,
          phone,
          password,
          token
        });
        //create salt and hash
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            //sending mail
            var mailOptions = {
              from: "oak64426442@gmail.com",
              to: email,
              subject: " Registration Success",
              text: "That was easy!",
              html: `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta http-equiv="X-UA-Compatible" content="ie=edge">
                    <title>Document</title>
                     <!-- Compiled and minified CSS -->
                     <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
                     <!-- Compiled and minified JavaScript -->
                     <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
                    <style>
                    .button { background-color: #4CAF50; /* Green */ border: none; color: white; padding: 16px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; -webkit-transition-duration: 0.4s; /* Safari */ transition-duration: 0.4s; cursor: pointer; }  .button1 { background-color: white; color: black; border: 2px solid #4CAF50; }
                    </style>      
                </head>
                <body>
                    <div class="container">
                    <H1>Welcome ${name}</H1>
                    <center><H1>WELCOME TO NOTES</H1></center>
                    <blockquote>
                        Memorable things are always beautyfull to keep them more beautyful here we can notes down our memories forever.When ever we read these notes that remains our happens and enjoyment once agian back. 
                    </blockquote>
                    <p class="flow-text"><h3>Thank You.</h3><br>
                    For registering to your Notes website with memories. <br>
                    In order to activate your account please click on given below button
                    </p><br>
                    <a href="http://192.168.10.97:3000/?token=${token}"><button class="button button1">Activate</button></a>
                </div>
                </body>
                </html>`
            };
            transporter.sendMail(mailOptions, function(err, info) {
              if (err) {
                return res.json({ msg: "network failed" });
              } else {
                newUser.save().then(user => {
                  console.log(info.response);
                  res.json({ token, user });
                });
              }
            });
          });
        });
      });
      // newUser.save().then(user => {
      //   res.json(user);
      // });
    });
  });
});

//adding a new note
app.post("/addnote", (req, res) => {
  const { email, title, content } = req.body;
  User.findOne({ email })
    .then(user => {
      if (!user) res.json({ msg: "email ID doesnot exist" });
      const newNote = new Item({
        email,
        title,
        content
      });
      newNote
        .save()
        .then(user1 => {
          Item.find({ email }, (req, res1) => {
            res.json(res1);
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

//getting the note
app.get("/getnote/:email", (req, res) => {
  const { email } = req.params;
  Item.find({ email }, (req, res1) => {
    res.json(res1);
  });
});

//update note
app.post("/updatedata", (req, res) => {
  const doc = {
    title: req.body[1],
    content: req.body[2],
    updatedDate: Date.now()
  };
  const email = req.body[3];
  Item.updateOne({ _id: req.body[0] }, doc, function(err, raw) {
    if (err) {
      res.send(err);
    }
    Item.find({ email }, (req, res1) => {
      res.json(res1);
    });
  });
});

//delete a note
app.delete("/deletenote/:id", (req, res) => {
  const { id } = req.params;
  Item.findByIdAndDelete(id, (req, res)).then(user => {
    res.json(user);
  });
});

//search a note
app.post("/searchnote", (req, res) => {
  Item.find({ email: req.body[1], title: req.body[0] })
    .then(user => {
      if (user == "") {
        res.json({ msg: "Item doesnot exist" });
      } else {
        res.json(user);
      }
    })
    .catch(err => console.log(err));
});

//otp email sending
app.post("/sendemail/:mail", (req, res) => {
  const { mail } = req.params;
  var val = Math.floor(1000 + Math.random() * 9000);
  console.log(val);
  User.findOne({ email: mail })
    .then(res1 => {
      if (!res1) {
        return res.json({ msg: "Email doesn't exists" });
      }
      var mailOptions = {
        from: "oak64426442@gmail.com",
        to: mail,
        subject: "Reset Your Password",
        text: "Hello",
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>Document</title>
             <!-- Compiled and minified CSS -->
             <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
             <!-- Compiled and minified JavaScript -->
             <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
            <style>
            .button { background-color: #4CAF50; /* Green */ border: none; color: white; padding: 16px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; -webkit-transition-duration: 0.4s; /* Safari */ transition-duration: 0.4s; cursor: pointer; }  .button1 { background-color: white; color: black; border: 2px solid #4CAF50; }
            </style>      
        </head>
        <body>
            <div class="container">
            <H1>Hi,</H1>
            <center><H1>Reset Your Password</H1></center>
            <blockquote>
                We have received a password 'reset' request.You can reset your password by entering these OTP code below.
                <br>
                <strong><b>${val}</b></strong>
            </blockquote>
            <p class="flow-text"><h3>Thank You.</h3>
               <br>
            </p>
            <br>     
        </div>
        </body>
        </html>`
      };
      transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
          console.log(err);
          return res.json({
            msg: "network error please try again after some time"
          });
        }
        res1.email = mail; //updated another way without updateOne()
        res1.otp = val;
        res1.save().then(success => {
          console.log(info.response);
          return res.json({ msg: "otp send to ur email" });
        });
      });
      // else {
      //   //return res.json({ msg: "Email doesn't exists" });
      // }
    })
    .catch(err => {
      console.log(err);
    });
});

//otp verifying
app.post("/otpverify", (req, res) => {
  console.log(req.body);
  User.findOne({ email: req.body[1] })
    .then(res1 => {
      console.log(res1);
      if (res1.otp == req.body[0]) {
        res.json({ msg: "success" });
      } else {
        res.json({ msg: "invalid OTP" });
      }
    })
    .catch(err => {
      console.log(err);
    });
});

//password change
app.post("/newpwd", (req, res) => {
  console.log(req.body);
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(req.body[1], salt, (err, hash) => {
      if (err) throw err;
      //finding particular person based on email ID
      User.findOne({ email: req.body[0] }, (req1, res1) => {
        if (res1) {
          //updating the old password hash with new password hash
          if (res1.password != hash) {
            User.updateOne({ email: req.body[0] }, { password: hash })
              .then(res2 => {
                console.log(res2);
                if (res2) {
                  res.json({ msg: "pwd updated" });
                }
              })
              .catch(err => {
                console.log(err);
              });
          }
        }
      });
    });
  });
});

//user profile displaying

//connect to Mongo
mongoose
  .connect(db, { useNewUrlParser: true, useCreateIndex: false })
  .then(() => console.log("MongoDB Connected ..."))
  .catch(() => console.log(err));

//server port number
const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`server started on port ${port}`));
