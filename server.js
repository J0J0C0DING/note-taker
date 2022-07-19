const fs = require('fs');
const path = require('path');

const express = require('express');
const app = express();
const shortid = require('shortid');

// Middleware
// Parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

app.use(express.static('public'));

const PORT = process.env.PORT || 3001;

const notes = require('./db/db.json');

function findById(id, notesArray) {
  const result = notesArray.filter(note => note.id === id)[0];

  return result;
}

function createNewNote(body, notesArray) {
  const note = body;
  notesArray.push(note);

  fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(notesArray, null, 2));

  return note;
}

function deleteNote(id, notesArray) {
  for (let i = 0; i < notesArray.length; i++) {
    let note = notesArray[i];

    if (note.id == id) {
      notesArray.splice(i, 1);
      fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(notesArray, null, 2));
    }
  }
}

// Get all notes
app.get('/api/notes', (req, res) => {
  res.json(notes);
});

// Get not by id
app.get('/api/notes/:id', (req, res) => {
  const result = findById(req.params.id, notes);

  if (result) {
    res.json(result);
  } else {
    res.sendStatus(404);
  }
});

app.post('/api/notes', (req, res) => {
  // Set random id using shortid
  req.body.id = shortid.generate();

  // Add note to json file and notes array
  const note = createNewNote(req.body, notes);

  res.json(note);
});

// ************** NEED TO GET ROUTE TO DELETE NOTE************
app.delete('/api/notes/:id', (req, res) => {
  deleteNote(req.params.id, notes);

  res.json({
    message: `Successfully deleted note`,
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
