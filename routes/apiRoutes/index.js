const router = require('express').Router();
const { notes } = require('../../db/db.json');
const path = require('path');
const fs = require('fs');

const generateUniqueID = require('generate-unique-id');

function newNote(note, notesArray = []) {
    //limit id length to 3 digits
    const id = generateUniqueID({
        length: 3,
        useLetters: false
    });

    note.id = id;
    notesArray.push(note);

    fs.writeFileSync(
        path.join(__dirname, '../../db/db.json'),
        JSON.stringify({ notes }, null, 2)
    );

    return note;
}

function noteValidate(note) {
    if (!note.title) {
        return false;
    }
    if (!note.text) {
        return false;
    }
    return true;
}



function grabbyID (id, notesArray) {
    const results = notesArray.filter(note => note.id === id)[0];
    return results;
}




router.get('/notes', (req, res) => {
    return res.json(notes);
});

router.delete('/notes/:id', (req,res) => {
    const deleteNote = notes.indexOf(grabbyID(req.params.id, notes));

    if (deleteNote > -1){
        notes.splice(deleteNote, 1);

        fs.writeFileSync(
            path.join(__dirname, '../../db/db.json'),
            JSON.stringify({ notes }, null, 2)
        );
        return res.json(notes);
    } else {
        return res.send(404);
    }
});


router.post('/notes', (req, res) => {
    if (!noteValidate(req.body)) {
        return res.status(400).send('Please fill out the note');
    } else {
        const note = newNote(req.body, notes);
        return res.json(note);
    }
});

module.exports = router;