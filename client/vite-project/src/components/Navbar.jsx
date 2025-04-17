import React from "react";

const Navbar = () => {
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: localStorage.getItem("token") }),
      });

      // Clear all local storage data including the token
      localStorage.clear();
      // get a pop up message
      alert("Logout successful");
      // Redirect to the login page

      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div>
      <nav className="navbar  navbar-brand bg-blue-500 w-full p-4 rounded-3xl m-2 navbar-expand-lg">
        <div className="container-fluid">
          <div
            className=" flex justify-center items-center z-10 "
            id="navbarNav"
          >
            <button>
              <a href="/" className="text-white font-bold m-2">
                Create Todo
              </a>
            </button>

            <button>
              <a
                href="/login"
                className="text-white bg-yellow-500 rounded-3xl p-2 font-bold m-2"
              >
                Login
              </a>
            </button>
            <button>
              <a
                href="/register"
                className="text-white bg-green-500 rounded-3xl p-2  font-bold m-2"
              >
                Register
              </a>
            </button>
            {/* 
            <button>
              <a href="/todos" className="text-white font-bold m-2">
                Profile name will be shown here
              </a>    
            </button> */}

            <button onClick={handleLogout}>
              <span className="text-white bg-red-500 rounded-3xl p-2   font-bold m-2 cursor-pointer">
                Logout
              </span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
