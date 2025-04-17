import React, { useState } from "react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);

        // Decode token to extract role
        const payload = JSON.parse(atob(data.token.split(".")[1]));
        localStorage.setItem("role", payload.role);

        alert("Login successful");

        // Optional: Navigate based on role
        if (payload.role === "admin") {
          window.location.href = "/admin/dashboard"; // or use navigate()
        } else {
          window.location.href = "/dashboard"; // or any user page
        }

      } else {
        alert(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Login failed");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="login-container flex items-center justify-center bg-blue-300 rounded-3xl p-4 ">
      <form className="flex justify-center flex-col items-center" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          className="border border-gray-300 p-2 rounded-3xl mb-2"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Enter password"
          className="border border-gray-300 p-2 rounded-3xl mb-2"
          value={formData.password}
          onChange={handleChange}
        />
        <button className="py-2 px-4 bg-blue-500 rounded-3xl" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
