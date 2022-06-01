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
  if(req.body){
    const {title, text} = req.body;
    notesData.push({"id":uuidv4(), "title":title, "text":text});
    fs.writeFile('./db/db.json', JSON.stringify(notesData), err => {
      if (err)
        console.log(err);
      else
        console.log("Note created successfully!");
    });
    res.status(201).json('Note created successfully');
  }
});

app.delete('/api/notes/:id', (req, res) => {
  console.log(req.params.id);
  notesData = notesData.filter(x => x.id !== req.params.id);
  fs.writeFile('./db/db.json', JSON.stringify(notesData), err => {
    if (err)
      console.log(err);
    else
      console.log("Note deleted successfully!");
  });
  res.status(200).json(req.params.id);
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
