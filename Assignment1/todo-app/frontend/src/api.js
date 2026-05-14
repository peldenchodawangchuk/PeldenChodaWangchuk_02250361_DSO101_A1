const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Something went wrong');
  return data;
};

export const getTodos = () =>
  fetch(`${API_URL}/api/todos`).then(handleResponse);

export const createTodo = (title, description) =>
  fetch(`${API_URL}/api/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description }),
  }).then(handleResponse);

export const updateTodo = (id, updates) =>
  fetch(`${API_URL}/api/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  }).then(handleResponse);

export const deleteTodo = (id) =>
  fetch(`${API_URL}/api/todos/${id}`, { method: 'DELETE' }).then(handleResponse);