import React from "react";

const Signup = () => {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);

        const payload = JSON.parse(atob(data.token.split(".")[1]));
        localStorage.setItem("role", payload.role);

        alert("Registration successful");

        // Optional redirect after signup
        window.location.href = "/dashboard";
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Registration failed");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="signup-container bg-blue-300 rounded-3xl p-4 ">
      <h2 className="text-center">Sign Up</h2>
      <form className="flex justify-center flex-col items-center" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          className="border border-gray-300 p-2 rounded-3xl mb-2"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          className="border border-gray-300 p-2 rounded-3xl mb-2"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          className="border border-gray-300 p-2 rounded-3xl mb-2"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <button className="bg-blue-500 py-2 px-4 rounded-3xl m-2" type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
