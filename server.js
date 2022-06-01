const express = require('express');
const path = require('path');
const fs = require('fs');
var notesData = require('./db/db.json')
const { v4: uuidv4 } = require('uuid');

const PORT = 5001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/api/notes', (req, res) => res.json(notesData));

app.post('/api/notes', (req, res) => {
  if (req.body && req.body.title && req.body.text){
    const {title, text} = req.body;
    notesData.push({"id":uuidv4(), "title":title, "text":text});
    fs.writeFile('./db/db.json', JSON.stringify(notesData), err => {
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

app.delete('/api/notes/:id', (req, res) => {
  console.log(req.params.id);
  var i = 0;
  while(i < notesData.length && notesData[i].id != req.params.id)++i;
  if (i == notesData.length)
    res.status(400).json('The requested id does not exist');

  const deletedNote = notesData[i];
  notesData.splice(i,1);  
  fs.writeFile('./db/db.json', JSON.stringify(notesData), err => {
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

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);



app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
