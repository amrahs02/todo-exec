import React, { useEffect, useState } from "react";

const CreateTodo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  // edddit the 
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // Get token from localStorage

    try {
      const response = await fetch("http://localhost:5000/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add token here
        },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) {
        throw new Error("Failed to create todo");
      }

      const data = await response.json();
      setTodos((prevTodos) => [...prevTodos, data]);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Error creating todo:", error);
    }

  };

  const handleEdit = (todo) => {
    setEditId(todo._id);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
  };
  
  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      });
  
      if (!response.ok) throw new Error("Failed to update todo");
  
      const updated = await response.json();
      setTodos((prev) =>
        prev.map((todo) => (todo._id === id ? updated : todo))
      );
      setEditId(null);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleDelete = async(id) =>{
    try {
      const response = await fetch(`http://localhost:5000/todos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete todo');

      setTodos((prev) => prev.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  }
  

  useEffect(() => {
    const fetchTodos = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("http://localhost:5000/todos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch todos");
        }

        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    fetchTodos();
  }, [todos]);

  // delete

  return (
    // todo crate page n react and tailwind

    <div className="bg-blue-100 p-4 rounded-3xl w-1/2 m-3">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          type="text"
          placeholder="Enter Todo Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-300 p-2 rounded-3xl mb-2"
        />
        <textarea
          placeholder="Enter Todo Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-gray-300 p-2 rounded-2xl mb-2"
        ></textarea>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Create Todo
        </button>
      </form>

      <ul className="mt-4">
  {todos.map((todo) => (
    <li key={todo._id} className="bg-white p-2 rounded shadow mb-2">
      {editId === todo._id ? (
        <>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="border p-1 rounded mb-1 w-full"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="border p-1 rounded mb-1 w-full"
          />
          <button
            onClick={() => handleUpdate(todo._id)}
            className=" text-black px-2 py-1 rounded mr-2"
          >
            Save
          </button>
          <button
            onClick={() => setEditId(null)}
            className="  text-black px-2 py-1 rounded"
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <h3 className="font-bold text-blue-400">{todo.title}</h3>
          <p className="font-bold">{todo.description}</p>
          <button
            onClick={() => handleEdit(todo)}
            className=" text-black px-2 py-1 rounded-3xl mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(todo._id)}
            className=" text-black px-2 py-1 rounded-3xl"
          >
            Delete
          </button>
        </>
      )}
    </li>
  ))}
</ul>

    </div>
  );
};
export default CreateTodo;
