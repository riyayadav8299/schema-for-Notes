const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Note = require("./models/Note.model.js");

const app = express();
app.use(bodyParser.json());


app.get("/" ,async function(req,res) {
    res.send("Note Collection");
})



mongoose
  .connect(
    "mongodb+srv://BackendUser:rUOIpCKLc0oVpmtw@clusterkreupai.imb19.mongodb.net/"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

// Create a new note
app.post("/notes", async (req, res) => {
  try {
    const note = new Note({
      relatedTo: req.body.relatedTo,
      title: req.body.title,
      content: req.body.content,
      attachments: req.body.attachments,
      createdBy: req.body.createdBy,
    });
    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Read all notes
app.get("/notes", async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Read a specific note by ID
app.get("/notes/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a note by ID
app.put("/notes/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    note.relatedTo = req.body.relatedTo || note.relatedTo;
    note.title = req.body.title || note.title;
    note.content = req.body.content || note.content;
    note.attachments = req.body.attachments || note.attachments;
    note.updatedAt = Date.now();

    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a note by ID
app.delete("/notes/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    await note.remove();
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start the server
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
