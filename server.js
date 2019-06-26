const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const User = require("./model/User");
const Item = require("./model/Item");

//intialization of express
const app = express();

//BodyParser middleware
app.use(bodyParser.json());

//DB config
const db = require("./config/default").mongoURL;

//user Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ msg: "please enter all fields" });
  }
  User.findOne({ email }).then(user => {
    if (!user) return res.json({ msg: "User Does not exists" });
    //Validate password
    if (user.password == password) {
      res.json(user);
    } else {
      res.json({ msg: "Password Does not Match" });
    }
  });
});

// User Registration
app.post("/register", (req, res) => {
  const { name, email, phone, password } = req.body;
  User.findOne({ email }).then(user => {
    if (user) return res.json({ msg: "email already exists" });
    User.findOne({ phone }).then(user => {
      if (user) return res.json({ msg: "phone already exists" });
      const newUser = new User({
        name,
        email,
        phone,
        password
      });
      newUser.save().then(user => {
        res.json(user);
      });
    });
  });
});

//adding a new note
app.post("/addnote", (req, res) => {
  const { email, title, content } = req.body;
  User.findOne({ email }).then(user => {
    if (!user) res.json({ msg: "email ID doesnot exist" });
    const newNote = new Item({
      email,
      title,
      content
    });
    newNote.save().then(user => {
      Item.find({ email }, (req, res1) => {
        res.json(res1);
      });
    });
  });
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
    source: req.body[2]
  };
  Item.updateOne({ _id: req.body[0] }, doc, function(err, raw) {
    if (err) {
      res.send(err);
    }
    res.send(raw);
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

//connect to Mongo
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected ..."))
  .catch(() => console.log(err));

//server port number
const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`server started on port ${port}`));
