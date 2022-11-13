// var express = require("express");
// var app = express();
 

const express = require('express')
const app = express()
require('dotenv').config()
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const port = process.env.PORT || 5000
var cookieParser = require('cookie-parser');
const userRouter = require("./routes/userRouter")
const PostRouter = require("./routes/postRouter")
// const mongoose = require('mongoose')

// config express, ejs
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static(__dirname + "/public"));

var engine = require('ejs-locals');
app.engine('ejs', engine);
// app.use(expressLayouts);
// app.set('layout', 'layouts/layout');
app.use(cookieParser());

app.use(userRouter)
// !important!
app.use(PostRouter)
// you need to install the following libraries |express|ejs|[dotenv > if required]
// or run this command >> npm i express ejs dotenv 


// required libs : mongoose | colors
// run the following command
// npm i mongoose colors

const colors = require('colors');
const mongoose = require('mongoose')
mongoose.connect(process.env.URI , { useNewUrlParser : true, useUnifiedTopology : true})
.then((res)=>console.log('> Connected...'.bgCyan))
.catch(err=>console.log(`> Error while connecting to mongoDB : ${err.message}`.underline.red ))






app.listen(port , ()=> console.log('> Server is up and running on port : ' + port))