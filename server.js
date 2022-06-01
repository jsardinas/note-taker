const express = require('express');
const path = require('path');
const fs = require('fs');
const notesData = require('./db/db.json')

const PORT = 5001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/api/notes', (req, res) => res.json(notesData));

app.post('/api/notes', (req, res) => {
  let response = 'OK';
  if(req.body){
    const {title, text} = req.body;
    notesData.push({"title":title, "text":text});
    fs.writeFile('./db/db.json', JSON.stringify(notesData), err => {
      if (err)
        console.log(err);
      else
        console.log("Note added successfully!");
    })
  }
});

app.delete('api/notes', (req, res) => {
  //console.log('delete request');
  //console.log(req);
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
