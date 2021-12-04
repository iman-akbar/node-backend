//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true
});

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

app
  .route("/articles")
  .get((req, res) => {
    Article.find((err, foundArticles) => {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post((req, res) => {
    console.log();
    console.log();

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save((err, foundArticles) => {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (!err) {
        res.send("success delete");
      } else {
        res.send(err);
      }
    });
  });


//////////////////////////////////////specific articles ///////////////////////////////////////////////////////////////////

app.route("/articles/:articleTitle")

  .get((req, res) => {
    Article.findOne({
      title: req.params.articleTitle
    }, (err, foundArticles) => {
      if (foundArticles) {
        res.send(foundArticles)
      } else {
        res.send("no article was found")
      }
    })
  })
  
  .put((req, res) => {
    Article.updateOne( {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
      (err) => {
        if (!err) {
          res.send("successfully update")
        }
      }
    )
  })
// app.get("/articles", );

// app.post("/articles", );

// app.delete("/articles", )

//TODO

app.listen(3000, function () {
  console.log("Server started on port 3000");
});