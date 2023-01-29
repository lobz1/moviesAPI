/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Denys Moroz Student ID: 154298194 Date: 01/15/2023
*  Cyclic Link: https://clever-bee-veil.cyclic.app/
*
********************************************************************************/ 

const express = require("express");
const app = express();
const cors = require("cors");
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();
require('dotenv').config();
const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get("/", function (req, res) {
  res.json({ message: "API Listening!" });
});

app.post("/api/movies", function (req, res) {
    db.addNewMovie(req.body).then((data) => {
        res.status(201).json(data);
    }).catch(() => {
        res.status(500).json({ err: "Unable to Add New Movies" });
    });
});

app.get("/api/movies", function (req, res) {
    let promise = null;
  
    if (req.query.title) {
      promise = db.getAllMovies(
        req.query.page,
        req.query.perPage,
        req.query.title
    );
    } else {
      promise = db.getAllMovies(req.query.page, req.query.perPage);
    }
  
    promise.then((data) => {
        if (data) res.json(data);
        else res.json({ err: "No Movies were Found" });
    }).catch((err) => {
        res.status(500).json({ err: err });
    });
});
  
app.get("/api/movies/:id", function (req, res) {
    db.getMovieById(req.params.id).then((data) => {
        if (data) res.json(data);
        else res.json({ err: "No Movie was Found with given id" });
    }).catch(() => {
        res.status(500).json({ err: "Unable to retrieve New Movies" });
    });
});

app.put("/api/movies/:id", function (req, res) {
    db.updateMovieById(req.body, req.params.id).then(() => {
        res.json({ success: "Movie has been Updated" });
    }).catch(() => {
        res.status(500).json({ err: "Unable to Update New Movies" });
    });
});

app.delete("/api/movies/:id", function (req, res) {
    db.deleteMovieById(req.params.id).then(() => {
        res.status(200).json({ success: "Movie has been Deleted" });
    }).catch(() => {
        res.status(500).json({ err: "Unable to Delete New Movie" });
    });
});

app.use((req, res) => {
    res.status(404).send("Resource was not found");
  });

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});
