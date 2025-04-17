import React, { useEffect, useState } from "react";

const CreateTodo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch("http://localhost:5000/todos");
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
    // write todo crate page n react and tailwind

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

      <ul className="mt-4 ">
        {todos.map((todo) => (
          <li key={todo.id} className="bg-white  p-2  rounded shadow mb-2">
            <h3 className="font-bold text-blue-400">{todo.title}</h3>
            {/* <p className="text-gray-600">{todo.createdAt}</p> */}
            {/* <p className="text-gray-600">{todo.updatedAt}</p> */}
            <p className="font-bold">{todo.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default CreateTodo;
