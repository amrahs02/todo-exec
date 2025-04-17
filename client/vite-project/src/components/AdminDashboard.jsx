import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("role") === "admin"; // Assume role is saved in localStorage

  const fetchUsers = async () => {
    try {
      if (isAdmin) {
        const res = await fetch("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 403) {
          setError("Access Denied: You are not authorized to view users.");
          setUsers([]);
          return;
        }

        const data = await res.json();
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          setError("Invalid user data format");
        }
      }
    } catch (err) {
      setError("Failed to fetch users");
    }
  };

  const fetchTodos = async () => {
    try {
      const res = await fetch(isAdmin 
        ? "http://localhost:5000/api/admin/todos" 
        : "http://localhost:5000/api/users/todos", { // If user is not admin, fetch user todos only
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 403) {
        setError("Access Denied: You are not authorized to view todos.");
        setTodos([]);
        return;
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        setTodos(data);
      } else {
        setError("Invalid todos data format");
      }
    } catch (err) {
      setError("Failed to fetch todos");
    }
  };

  const deleteUser = async (id) => {
    const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
    fetchTodos();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>

      {error && (
        <div className="text-red-600 mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {isAdmin && (
        <div className="mb-6">
          <h3 className="font-semibold">All Users</h3>
          {users.length === 0 && <p>No users found or not authorized.</p>}
          <ul>
            {users.map((user) => (
              <li key={user._id}>
                {user.name} - {user.email} - {user.role}
                <button
                  className="ml-2 text-red-500"
                  onClick={() => deleteUser(user._id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3 className="font-semibold">{isAdmin ? "All Todos" : "Your Todos"}</h3>
        {todos.length === 0 && <p>No todos found or not authorized.</p>}
        <ul>
          {todos.map((todo) => (
            <li key={todo._id}>
              <strong>{todo.title}</strong> by {todo.user?.name || "Unknown"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
