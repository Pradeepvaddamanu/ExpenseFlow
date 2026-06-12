import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const register = async () => {
    try {
      setLoading(true);
      setError("");

      await api.post("/register", {
        name,
        email,
        password,
      });

      navigate("/login");

    } catch (error) {
      console.log(error);

      if (
        error.response &&
        error.response.data
      ) {
        const detail =
          error.response.data.detail;

        if (typeof detail === "string") {
          setError(detail);
        } else {
          setError("Please check all fields");
        }
      } else {
        setError("Registration Failed");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-indigo-100 flex items-center justify-center">

      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">

        <h1 className="text-5xl font-bold text-center">
          ExpenseFlow
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Smart Group Expense Management
        </p>

        <p className="text-gray-500 text-center mb-8">
          Create your account
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-3 rounded-lg mb-6"
        />

        <button
          onClick={register}
          disabled={loading}
          className="bg-black text-white w-full py-3 rounded-lg hover:bg-gray-800 transition"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Register;