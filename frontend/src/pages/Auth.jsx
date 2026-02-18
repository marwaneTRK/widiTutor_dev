import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
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

      if (res.ok) setIsLogin(true); // Switch to login after successful register
    } catch (err) {
      console.error(err);
      setMessage("Error registering");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();
      setMessage(data.message || "Logged in successfully");

      if (res.ok) navigate("/welcome"); // redirect to welcome page
    } catch (err) {
      console.error(err);
      setMessage("Error logging in");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center">
            {isLogin ? "Login" : "Create Account"}
          </h2>

          <form
            onSubmit={isLogin ? handleLogin : handleRegister}
            className="space-y-3"
          >
            {!isLogin && (
              <>
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
              </>
            )}

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

            <button className="btn btn-primary w-full">
              {isLogin ? "Login" : "Register"}
            </button>
            <div className="divider">OR</div>

            <button
              type="button"
              onClick={() =>
                (window.location.href = `${API_URL}/api/auth/google`)
              }
              className="btn btn-outline w-full"
            >
              Continue with Google
            </button>
          </form>

          {message && (
            <div className="alert alert-info mt-3">
              <span>{message}</span>
            </div>
          )}

          <p className="mt-3 text-center text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              className="btn btn-link btn-sm"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
