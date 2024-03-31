const express = require("express");
const admin = express.Router();
const chalk = require("chalk");

function log() {
  console.log(
    chalk.bgCyanBright.bold(" [Router] Admin Successfully Booted ")
  );
}

setTimeout(log, 1000);

const isAdmin = (req, res, next) => {
  if(!req.session.user){
    res.redirect('/login')
  }
  if (req.session.adminkey === 'eeeee') {
    res.redirect('/')
  } else {
    next();
  }
};

admin.get('/', isAdmin, async (req, res, next) => {
        res.render('admin/index.ejs', {
          user: user
        });
});

module.exports = admin;
