const express = require("express");
const index = express.Router();
const chalk = require("chalk");

function log() {
  console.log(
    chalk.bgCyanBright.bold(" [Router] Index Successfully Booted ")
  );
}

setTimeout(log, 1000);

index.get('/', async (req, res, next) => {
  const user = req.session.user
  const session = req.session
  res.render('index.ejs', {
    user: user,
    session: session
  });
});

index.get('/logout', async (req, res, next) => {
  req.session.destroy(function(err) {
    if (err) {
      console.log(err);
      res.send("Error")
    } else {
      res.redirect('/')
    }
  })
})

index.get('/login', async (req, res, next) => {
  const user = req.session.user
  if (user) {
    res.redirect('/')
  } else {
    res.render('login.ejs', { user: user });
  }
});

module.exports = index;
