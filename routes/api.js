const express = require("express");
const api = express.Router();
const chalk = require("chalk");
const mongoose = require('mongoose');
const fs = require('fs')

function log() {
  console.log(chalk.bgCyanBright.bold(" [Router] API Successfully Booted "));
}

setTimeout(log, 1000);

api.get("/database/find", async (req, res, next) => {
  const collection = require(`../models/${req.query.collection}`)
 res.json(await collection.find({}).sort({ _id: 'asc' }).lean().exec())
});


function build_json(data) {
  let collection = data
  let card_text = '';
  let keys = Object.keys(collection)

  function handleArr(array) {
    let objects = '';
    for (let i2 = 0; i2 < array.length; i2++) {
      let object_children = '';
      Object.keys(array[i2]).forEach(key => {
        objects_children += `"${key}" : ${array[i2][key].toString()},`
      })
  objects += `{ ${object_children} },`
    }
    return objects;
  }

  function handleNested(nest) {
    let objects = '';
    let i2 = 0;

    Object.keys(nest).forEach(key => {
      i2++
      if (typeof nest[key] === 'object') {
  objects += `"${key}" : { ${handleNested(nest[key])} },`
    }else{
        objects	+= `"${key}" : ${nest[key].toString()},`
    }
    });
    return objects.replace(', }', "}");
  }

  keys.forEach(key => {
    if(key === "_id"){
    }else{
    if(Array.isArray(collection[key])){
  card_text += `"${key}" : [
  ${handleArr(collection[key])}
  ],`
    }else { 
      if (typeof collection[key] === 'object') {
  card_text += `"${key}" : {${handleNested(collection[key])}},`
    }else{
     card_text += `"${key}" : ${collection[key].toString()},`
    }
  }
}
  });
let text = `{ ${card_text}}`
text = text.replaceAll(',}', '}')
text = text.replaceAll('function ', `"`).replaceAll('() { [native code] }', `" `)
return text
}

api.get("/database/collections", async (req, res, next) => {
  const data = await mongoose.connection.db.listCollections().toArray();
  const promises = [];
    const promise = new Promise((resolve, reject) => {
      for (let i = 0; i < data.length; i++) {
        const element = data[i];
      fs.access(`./models/${element.name}.js`, fs.constants.F_OK, async (err) => {
        if (err) {
          data.splice(i, 1)
        }
      })
       }
       setTimeout(() => {
        for (let i = 0; i < data.length; i++) {
          const element = data[i];
          try {
            const collection = require(`../models/${element.name}.js`);
            let collection_schema = mongoose.model(`${element.name}`).schema.obj;
            data[i].json = `${build_json(collection_schema)}`;
            resolve(); 
          } catch (error) {
            reject(error); 
          }
        }
      }, 500)
    })
    promises.push(promise);

  await Promise.all(promises);

 
  res.json(data);
});

api.post('/database/delete', async (req, res, next) => {
  const post_data = req.body
  const collection = require(`../models/${post_data.collection}`)
  const data = await collection.find({}).exec()
  try {
  collection.findOneAndDelete({ _id : data[Number(`${post_data.object_no}`)]._id }).exec()
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
  collection.findOneAndUpdate({ _id : data[Number(`${post_data.object_no}`)]._id }, { $set: post_data.json}).exec()
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
