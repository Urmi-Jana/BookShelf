//jshint esversion:6
require('dotenv').config()
const multer = require('multer')
const mongoose = require("mongoose")
const express = require("express");
const ejs = require("ejs");
const _ = require("lodash");
const port = process.env.PORT || 3000;


const aboutContent = "Hi there! Welcome to My BookShelf, a collection of the books I've read and want to read in the future, along with my thoughts about them. Feel free to leave a comment and read what other people think about the book as weel!! It would mean the world to me if you started reading a book because of my review.";
const contactContent = "I'm always available at janaurmi6@gmail.com";

const app = express();
app.use(express.urlencoded({extended: true}));

app.set('view engine', 'ejs');
app.use(express.static("public"));

const pass = process.env.DB_PASSWORD;

mongoose.connect("mongodb+srv://admin-urmi:"+pass+"@cluster0.d1ij7.mongodb.net/BookReview", {useNewUrlParser: true});

const reviewSchema = {
  username: String,
  comment: String
}

const Review = mongoose.model("Review", reviewSchema)

const postSchema = {
  title: String,
  content: String,
  url: String,
  reviews: [reviewSchema]
}

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    posts.forEach(function(post){
      console.log(post.title);
    })
    res.render("home", {
      // startingContent: homeStartingContent,
      posts: posts
      });
  })
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post( {
    title: req.body.postTitle,
    content: req.body.postBody,
    url: req.body.image,
    reviews: []
  });

  post.save(function(err){
    if (!err) res.redirect("/");
  });  

});

app.get("/posts/:postId", function(req, res){
  const requestedTitle = (req.params.postId);
  console.log(req.params.postId);

  Post.findById(requestedTitle, function(err, post){
    if (err) console.log(err);
    else{
      res.render("post", {
        title: post.title,
        content: post.content,
        reviews: post.reviews,
        url: post.url,
        postid: requestedTitle
      })
    }
  })
});

app.post("/posts/:postId", function(req, res){  

  Post.findById(req.body.postid, function(err, post){
    if (err) console.log(err);
    else {
      const newReview = new Review({
        username: req.body.username,
        comment: req.body.reviewBody
      })

      console.log(post.title);

      post.reviews.push(newReview)

      post.save(function(err){
        if (!err) res.redirect("/posts/" + req.body.postid);
        else console.log(err);
      }); 
    }
  })
})

app.listen(port, function() {
  console.log(`Server started on port {port} ` );
});
