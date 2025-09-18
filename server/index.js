import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/todofy', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const todoSchema = new mongoose.Schema({
  text: String,
  completed: Boolean
});

const Todo = mongoose.model('Todo', todoSchema);

app.get('/api/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post('/api/todos', async (req, res) => {
  const todo = new Todo({ text: req.body.text, completed: false });
  await todo.save();
  res.json(todo);
});

app.put('/api/todos/:id', async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(todo);
});

app.delete('/api/todos/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.listen(5000, () => console.log('Server running on port 5000'));
