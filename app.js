//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash");
const mongoose = require("mongoose");
const port = process.env.port || 3000;

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/blogDB", { useNewUrlParser: true });
const blog = new mongoose.Schema({ title : String, content : String });
const Blog = mongoose.model("Blog", blog);

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let allPost = [];
const aboutContent = "about content";
const contactContent = "contact content";

app.get("/", (req, res) => {
  res.render("home", { allPost: allPost });
  // console.log(allPost); 
});
app.get("/contact", (req, res) => {
  res.render("contact", { data: contactContent });
});
app.get("/about", (req, res) => {
  res.render("about", { data: aboutContent });
});
app.get("/compose", (req, res) => {
  res.render("compose");
});
app.get("/post/:topic", (req, res) => {
  let name = lodash.lowerCase(req.params.topic);
  console.log(name);
  let flag = false;
  let reqPost;
  allPost.forEach(post => {
    let title = lodash.lowerCase(post.title);
    if (title == name) {
      flag = true;
      reqPost = post;
    }
  });
  if (flag) {
    res.render("post", {post : reqPost});
  }
  else {
    console.log("Not Available");
    res.redirect("/");
  }
});

app.post("/compose", (req, res) => {
  var post = {
    title: req.body.postTitle,
    content: req.body.postContent
  };
  allPost.push(post);
  res.redirect("/");
});

app.listen(port, function () {
  console.log("started " + port);
});
