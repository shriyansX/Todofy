import React, { useEffect, useState } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    const res = await fetch('http://localhost:5000/api/todos');
    const data = await res.json();
    setTodos(data);
    setLoading(false);
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const res = await fetch('http://localhost:5000/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const newTodo = await res.json();
    setTodos([...todos, newTodo]);
    setText('');
  };

  const toggleTodo = async (id, completed) => {
    const res = await fetch(`http://localhost:5000/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed })
    });
    const updated = await res.json();
    setTodos(todos.map(t => t._id === id ? updated : t));
  };

  const deleteTodo = async (id) => {
    await fetch(`http://localhost:5000/api/todos/${id}`, { method: 'DELETE' });
    setTodos(todos.filter(t => t._id !== id));
  };

  return (
    <div>
      <h2>Todofy</h2>
      <form onSubmit={addTodo}>
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Add a new task..."
        />
        <button type="submit" disabled={!text.trim()}>Add</button>
      </form>
      {loading ? <p>Loading...</p> : (
        <ul>
          {todos.map(todo => (
            <li key={todo._id} className={todo.completed ? 'completed' : ''}>
              <span onClick={() => toggleTodo(todo._id, todo.completed)} style={{ cursor: 'pointer' }}>
                {todo.text}
              </span>
              <button onClick={() => deleteTodo(todo._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
