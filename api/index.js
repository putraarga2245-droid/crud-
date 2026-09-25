const express = require("express");
const connectToMongoDB = require("../DB/db");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

// Panggil fungsi koneksi database
connectToMongoDB();

// Skema data sederhana (Contoh: Catatan / Notes)
const noteSchema = new mongoose.Schema({
  title: String,
  content: String
});
const Note = mongoose.models.Note || mongoose.model("Note", noteSchema);

// Endpoint Tes Sederhana
app.get("/api/hello", (req, res) => {
  res.json({ message: "API is working successfully!" });
});

// 1. READ (Mendapatkan semua data) - GET /api/notes
app.get("/api/notes", async (req, res) => {
  try {
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. CREATE (Menambah data baru) - POST /api/notes
app.post("/api/notes", async (req, res) => {
  try {
    const { title, content } = req.body;
    const newNote = new Note({ title, content });
    await newNote.save();
    res.status(201).json({ message: "Data berhasil ditambah!", data: newNote });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 3. UPDATE (Mengubah data berdasarkan ID) - PUT /api/notes/:id
app.put("/api/notes/:id", async (req, res) => {
  try {
    const { title, content } = req.body;
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );
    if (!updatedNote) return res.status(404).json({ error: "Data tidak ditemukan" });
    res.status(200).json({ message: "Data berhasil diubah!", data: updatedNote });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 4. DELETE (Menghapus data berdasarkan ID) - DELETE /api/notes/:id
app.delete("/api/notes/:id", async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote) return res.status(404).json({ error: "Data tidak ditemukan" });
    res.status(200).json({ message: "Data berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;
