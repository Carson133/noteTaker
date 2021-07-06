const express = require('express');
const fs = require('fs');
const path = require('path');
const notes = require('./db/db.json');
const note = JSON.parse(fs.readFileSync('./db/db.json'));


const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

app.get('/api/notes', (req, res) => res.json(note));

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    note.push(newNote);

    fs.writeFileSync('./db/db.json', JSON.stringify(note), err => {
        if (err)
        throw (err);
      });  
      res.json(newNote);
});

app.delete("/api/notes/:id", (req, res) => {
    const deleteNote = note
    .findIndex(i => i.id == req.params.id);  
    note.splice(deleteNote, 1);
  
    fs.writeFileSync('./db/db.json', JSON.stringify(note), err => {
      if (err)
        throw (err);
    });
    return res.json(true);
  });

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));