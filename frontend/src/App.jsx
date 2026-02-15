import { useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, pseudo }),
      });
      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      console.error(err);
      setMessage("Error creating user");
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-2xl">Create User Test</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="form-control w-full">
              <span className="label-text mb-1">Name</span>
              <input
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </label>
            <label className="form-control w-full">
              <span className="label-text mb-1">Pseudo</span>
              <input
                type="text"
                placeholder="Enter pseudo"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </label>
            <button type="submit" className="btn btn-primary w-full">
              Create
            </button>
          </form>
          {message && <p className="text-sm mt-2">{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default App;
