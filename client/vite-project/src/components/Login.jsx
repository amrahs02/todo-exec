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
        localStorage.setItem('token', data.token);
        alert("Login successful");
      }
      if (response.ok) {
        alert("Login successful");
        // <Navigate to="/todos" />
      } else {  
        alert(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Loign failed");
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
        <div>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            className="border border-gray-300 p-2 rounded-3xl mb-2"
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            className="border border-gray-300 p-2 rounded-3xl mb-2"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button className="py-2 px-4 bg-blue-500 rounded-3xl" type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
