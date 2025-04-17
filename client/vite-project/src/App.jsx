import "./App.css";
import Navbar from "./components/Navbar";
// import ReadTodo from "./components/ReadTodo";
// import UpdateTodo from "./components/UpdateTodo";
import CreateTodo from "./components/CreateTodo";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
// import DeleteTodo from "./components/DeleteTodo";

function App() {
  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to login first");
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <div className="bg-blue-100">
        <Navbar />
        {/* <DeleteTodo/> */}
        <div className="flex justify-center items-center h-screen">
          <Routes>
            <Route path="/register" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <CreateTodo />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
