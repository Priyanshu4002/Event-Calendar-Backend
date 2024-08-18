import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb+srv://singhpsv2002:helloWorld@cluster0.vtlvj.mongodb.net/?retryWrites=true", {}).then(() => {
  console.log("Connected to database.");
})
.catch((err) => {
  console.log(`Some Error occured. ${err}`);
});

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  category: String,
});

const Event = mongoose.model("Event", eventSchema);

// GET all events
app.get("/events", async (req, res) => {
  try {
    const events = await Event.find({});
    res.json(events);
  } catch (err) {
    res.status(500).send(err);
  }
});


// GET a single event by ID
app.get("/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event) {
      res.json(event);
    } else {
      res.status(404).send("Event not found");
    }
  } catch (err) {
    res.status(500).send(err);
  }
});


// POST a new event
app.post("/events", async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(500).send(err);
  }
});


// PUT (Update) an event by ID
app.put("/events/:id", async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedEvent) {
      res.json(updatedEvent);
    } else {
      res.status(404).send("Event not found");
    }
  } catch (err) {
    res.status(500).send(err);
  }
});


// DELETE an event by ID
app.delete("/events/:id", async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (deletedEvent) {
      res.status(204).send();
    } else {
      res.status(404).send("Event not found");
    }
  } catch (err) {
    res.status(500).send(err);
  }
});


// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
