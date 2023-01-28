//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
// const ejs = require("ejs");
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

const aboutContent = "about content";
const contactContent = "contact content";

app.get("/", (req, res) => {
  Blog.find({}, (err, data)=>{
    if(err)
      console.log(err);
    else{
      res.render("home", { allPost: data });
    }
  }); 
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
app.get("/post/:topicId", (req, res) => {
  let id = req.params.topicId;
  // console.log(id);

  Blog.findOne({_id:id}, (err, data)=>{
    if(err){
    console.log(err);
    res.redirect("/");
    } else {
      // console.log(data);
      res.render("post", {post : data});
    }
  });
});

app.post("/compose", (req, res) => {
  var post = [{
    title: req.body.postTitle,
    content: req.body.postContent
  }];
  Blog.insertMany(post, (err)=>{
    if(err)
      console.log(err);
  });
  res.redirect("/");
});

app.listen(port, function () {
  console.log("started " + port);
});
