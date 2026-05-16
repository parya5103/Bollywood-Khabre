"use client";

import { useState } from 'react';

export default function AdminDashboard() {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (data.token) {
            setToken(data.token);
            setMessage("Login successful!");
        } else {
            setMessage(data.error || "Login failed");
        }
    } catch (err) {
        setMessage("Connection error");
    }
  };

  const triggerScrape = async () => {
      try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/admin/trigger-scrape`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              }
          });
          const data = await res.json();
          setMessage(data.message || data.error);
      } catch (err) {
          setMessage("Failed to trigger scraper");
      }
  };

  if (!token) {
      return (
          <div className="max-w-md mx-auto mt-20 p-8 bg-slate-900 rounded-xl">
              <h2 className="text-2xl font-bold mb-6 text-orange-500">Admin Login</h2>
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                  <input type="text" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} className="p-3 bg-slate-800 rounded-md text-white" />
                  <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="p-3 bg-slate-800 rounded-md text-white" />
                  <button type="submit" className="p-3 bg-orange-600 hover:bg-orange-700 font-bold rounded-md text-white">Login</button>
              </form>
              {message && <p className="mt-4 text-red-400">{message}</p>}
          </div>
      );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-8 text-orange-500">Admin Command Center</h1>
      <div className="bg-slate-900 p-8 rounded-2xl flex flex-col gap-6">
          <p className="text-green-400 font-mono text-sm">{message}</p>
          <div className="flex gap-4">
              <button onClick={triggerScrape} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-white">Trigger Manual Scrape</button>
          </div>
      </div>
    </div>
  );
}
