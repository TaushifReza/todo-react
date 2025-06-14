import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAddTodoForm, setShowAddTodoForm] = useState(false);

  function handleStatusToggle(id) {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  function handleAddTodo(newTodo) {
    setTodos((todos) => [...todos, newTodo]);
    setShowAddTodoForm(false);
  }

  function handleDeleteTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  useEffect(function () {
    async function fetchToDo() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          "https://jsonplaceholder.typicode.com/todos?_limit=5"
        );

        const data = await res.json();
        console.log(data);

        setTodos(data);
        console.log(`List of ToDo: ${todos}`);
        setError("");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchToDo();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto mt-6">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowAddTodoForm(!showAddTodoForm)}
            className={`px-4 py-2 rounded-md font-medium text-white transition ${
              showAddTodoForm
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {showAddTodoForm ? "❌ Close" : "➕ Add Task"}
          </button>
        </div>

        {showAddTodoForm && (
          <div className="mb-6">
            <FormAddTodo
              onAddTodo={handleAddTodo}
              onClose={() => setShowAddTodoForm(false)}
            />
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
            ❗ {error}
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-600 font-medium">
            🔄 Fetching ToDo...
          </div>
        ) : (
          <ToDo
            todos={todos}
            onStatusToggle={handleStatusToggle}
            onDeleteTodo={handleDeleteTodo}
          />
        )}
      </div>
    </div>
  );
}

function ToDo({ todos, onStatusToggle, onDeleteTodo }) {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">
        📝 ToDo List
      </h2>

      <div className="grid grid-cols-4 font-semibold text-white bg-blue-500 p-3 rounded-t-md">
        <span>S.N.</span>
        <span>Title</span>
        <span>Status</span>
        <span>Action</span>
      </div>

      <ul className="divide-y divide-gray-200 bg-white border border-t-0 rounded-b-md shadow">
        {todos.map((todo, index) => (
          <li
            key={todo.id}
            className="grid grid-cols-4 items-center p-3 hover:bg-gray-50 transition"
          >
            <span className="font-medium">{index + 1}</span>

            <span
              className={`truncate ${
                todo.completed ? "line-through text-gray-500" : "text-gray-800"
              }`}
            >
              {todo.title}
            </span>

            <span>
              <button
                onClick={() => onStatusToggle(todo.id)}
                className={`px-2 py-1 text-xs font-bold rounded-full ${
                  todo.completed
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {todo.completed ? "✅ Completed" : "❌ Pending"}
              </button>
            </span>

            <span>
              <button
                onClick={() => onDeleteTodo(todo.id)}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                🗑 Remove
              </button>
            </span>
          </li>
        ))}
      </ul>

      {todos.length === 0 && (
        <p className="text-center text-gray-400 mt-6">
          No ToDos yet. Add something! 🚀
        </p>
      )}
    </div>
  );
}

function FormAddTodo({ onAddTodo, onClose }) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState(true);

  function handleSubmit(e) {
    e.preventDefault();
    if (!title) return;

    const id = crypto.randomUUID();
    const newTodo = {
      userId: id,
      id,
      title,
      completed: status,
    };

    onAddTodo(newTodo);
    setTitle("");
    setStatus(true);
    onClose(); // close modal after submit
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Add New ToDo</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block mb-1 font-medium text-gray-700"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter your task"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="block mb-1 font-medium text-gray-700"
            >
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value === "true")}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="true">Completed</option>
              <option value="false">Pending</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Add Task
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
