const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const pug = require('pug')

const { readFromFile, readAndAppend, writeToFile } = require('../helpers/fsUtils');


// GET route for retrieving all the notes
notes.get('/', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
  });

// GET route for specific note
notes.get('/:note_id', (req, res) => {
  const noteId = req.params.note_id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.id === noteId);
      return result.length > 0
        ? res.json(result)
        : res.json('No note with that ID');
    });
});

// DELETE route for specific note
notes.delete('/:note_id', (req, res) => {
  const noteId = req.params.note_id;
  console.log(noteId);
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      // make new array of all notes except the one with ID provided in URL
      const result = json.filter((note) => note.id !== noteId);

      // save that array to filesys
      writeToFile('./db/db.json', result);

      // respond to DELETE request
      res.json(`Item ${noteId} has been deleted`);
    });
});

// POST route for new note
notes.post('/', (req, res) => {
  console.log(req.body);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    readAndAppend(newNote, './db/db.json');
    res.json(`Note added successfully`);
  } else {
    res.error('Error in adding note');
  }
});

notes.post('/login', function(req, res) {
  fs.readFile('./db/db.json', (err, data) => {
    if (err) throw err

    const notes = JSON.parse(data)

    res.render('login', { notes: notes })
  })
})


module.exports = notes;