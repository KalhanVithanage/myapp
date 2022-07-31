const express = require('express');
const core = require('cors');
const bodyparser = require('body-parser')
require('dotenv').config()
const {dbConnection} = require('./db/db')
const user = require('./routes/route');


  const app = (express());
  app.use(bodyparser.json());
  app.use(bodyparser.urlencoded({
      extended:true
  }));
 
  console.log("heloo my name is oo");
  app.use(core());
  app.use('/user/static', express.static('public'))
  app.use('/user',user);
  
  dbConnection.db.getConnection(function (err, connection) {
    // connected! (unless `err` is set)
    if (err) console.log(err);
    else console.log("Database connected ");
  });

  const PORT = process.env.PORT || 4000;
  
  const server = app.listen(PORT,()=>{
      console.log("conected MYDB  "+PORT);
     
  })