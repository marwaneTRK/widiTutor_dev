import { useState } from "react";

export default function Login() {
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      setMessage("Error registering");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center">Create Account</h2>

          <form onSubmit={handleRegister} className="space-y-3">
            <input
              name="name"
              placeholder="First Name"
              className="input input-bordered w-full"
              onChange={handleChange}
              required
            />

            <input
              name="lastName"
              placeholder="Last Name"
              className="input input-bordered w-full"
              onChange={handleChange}
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              className="input input-bordered w-full"
              onChange={handleChange}
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              className="input input-bordered w-full"
              onChange={handleChange}
              required
            />

            <button className="btn btn-primary w-full">Register</button>
          </form>

          {message && (
            <div className="alert alert-info mt-3">
              <span>{message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
