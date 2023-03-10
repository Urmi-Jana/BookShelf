//jshint esversion:6
require('dotenv').config()
const multer = require('multer')
const mongoose = require("mongoose")
const express = require("express");
const ejs = require("ejs");
const _ = require("lodash");
const port = process.env.PORT || 3000;


const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

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

app.listen(PORT, function() {
  console.log(`Server started on port {PORT} ` );
});
