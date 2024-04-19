const express = require("express");
const api = express.Router();
const chalk = require("chalk");
const mongoose = require('mongoose');

function log() {
  console.log(chalk.bgCyanBright.bold(" [Router] API Successfully Booted "));
}

setTimeout(log, 1000);

api.get("/database", async (req, res, next) => {
  const collection = require(`../models/${req.query.collection}`)
 res.json(await collection.find({}).exec())
});

api.get("/database/collections", async (req, res, next) => {
  res.json(await mongoose.connection.db.listCollections().toArray())
});

api.post('/database/delete', async (req, res, next) => {
  const post_data = req.body
  const collection = require(`../models/${post_data.collection}`)
  const data = await collection.find({}).exec()
  try {
  collection.findOneAndDelete(data[Number(`${post_data.object_no}`)]).exec()
  res.status(200).json({ "messsage": "success"})
  } catch(err){
    res.status(401).json({ "message": "error"})
    console.log('error: ' + err)
  }
})

api.post('/database/edit', async (req, res, next) => {
  const post_data = req.body
  const collection = require(`../models/${post_data.collection}`)
  const data = await collection.find({}).exec()
  try {
  collection.findOneAndUpdate(data[Number(`${post_data.object_no}`)], { $set: post_data.json}).exec()
  res.status(200).json({ "messsage": "success"})
  } catch(err){
    res.status(401).json({ "message": "error"})
    console.log('error: ' + err)
  }
})

api.post('/database/create', async (req, res, next) => {
  const post_data = req.body
  const collection = require(`../models/${post_data.collection}`)
  try {
  collection.create(post_data.json)
  res.status(200).json({ "messsage": "success"})
  } catch(err){
    res.status(401).json({ "message": "error"})
    console.log('error: ' + err)
  }
})

// api.post('/login', async (req, res, next) => {
//   const info = req.body
//   const user = require('../models/user')
//   user.findOne({ username: info.username }, async (err, data) => {
//     if (data) {
//       user.findOne({ password: info.password }, async (err, data) => {
//         if (data) {
//           const logins = await dbb.get("logins")
//   dbb.add("logins", 1)
//           req.session.user = data.username;
//           res.redirect('/')
//         } else {
//           res.status(401).json({ "message": "password incorrect" })
//         }
//       })
//     } else {
//       res.status(401).json({ "message": "username incorrect" })
//     }
//   })
// })

module.exports = api;
