const express = require("express");
const api = express.Router();
const chalk = require("chalk");

function log() {
  console.log(chalk.bgCyanBright.bold(" [Router] API Successfully Booted "));
}

setTimeout(log, 1000);

api.get('/database/users', async (req, res, next) => {
 let data = [
  {
    _id: "23c323w42344",
    name: "Vidul",
    age: "16",
    username: "VidulHB",
    password: "P@ssw0rd",
    array: [
      {_id: "23c323w42344",
    name: "Vidul",
    age: "16",
    username: "VidulHB",
    password: "P@ssw0rd",
  },
  {
    _id: "23c323w42342324",
    name: "Senura",
    age: "15",
    username: "WPIS_Developer",
    password: "P@ssw0rd2"
  },
  {
    _id: "233243wc23c32",
    name: "Gaviru",
    age: "16",
    username: "GaviruFer",
    password: "P@ssw0rd3"
  }
  ]
  },
  {
    _id: "23c323w42342324",
    name: "Senura",
    age: "15",
    username: "WPIS_Developer",
    password: "P@ssw0rd2"
  },
  {
    _id: "233243wc23c32",
    name: "Gaviru",
    age: "16",
    username: "GaviruFer",
    password: "P@ssw0rd3"
  }
];
  res.json(data)
});

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
