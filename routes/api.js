const api = require('express').Router();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
var notesData = require('../db/db.json');

api.get('/notes', (req, res) => res.json(notesData));

api.post('/notes', (req, res) => {
  if (req.body && req.body.title && req.body.text){
    const {title, text} = req.body;
    notesData.push({"id":uuidv4(), "title":title, "text":text});
    fs.writeFile('../db/db.json', JSON.stringify(notesData), err => {
      if(err){
        notesData.pop();
        console.log(err);
        res.status(500).json('Error creating note');
      }
      else{
        const successMsg = 'Note created successfully';
        console.log(successMsg)
        res.status(201).json(successMsg);
      }
    });
  }
  else{
    res.status(400).json('Bad request');
  }
});

api.delete('/notes/:id', (req, res) => {
  console.log(req.params.id);
  var i = 0;
  while(i < notesData.length && notesData[i].id != req.params.id)++i;
  if (i == notesData.length)
    res.status(400).json('The requested id does not exist');

  const deletedNote = notesData[i];
  notesData.splice(i,1);  
  fs.writeFile('../db/db.json', JSON.stringify(notesData), err => {
    if (err){
      console.log(err);
      notesData.push(deletedNote);
      res.status(500).json('Error deleting note');
    }
    else{
      const successMsg = `Note ${req.params.id} deleted successfully`;
      console.log(successMsg);
      res.status(200).json(successMsg);
    }
  });
});

module.exports = api;