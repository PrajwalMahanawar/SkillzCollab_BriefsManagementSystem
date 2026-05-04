"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState([]);

  const [form, setForm] = useState({
    brand: "",
    name: "",
    description: "",
    start_date: "",
    end_date: "",
  });

  const fetchCompetitions = async () => {
    try {
      const res = await api.get("/competitions/");
      setCompetitions(res.data);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const createCompetition = async (e) => {
    e.preventDefault();

    try {
      await api.post("/competitions/", form);

      setForm({
        brand: "",
        name: "",
        description: "",
        start_date: "",
        end_date: "",
      });

      fetchCompetitions();
    } catch (err) {
      alert("Failed to create brief");
      console.log(err.response?.data);
    }
  };

  const deleteCompetition = async (id) => {
    try {
      await api.delete(`/competitions/${id}/`);
      fetchCompetitions();
    } catch (err) {
      alert("Failed to delete brief");
      console.log(err.response?.data);
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Briefs Management Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Create, manage, and view competition briefs.
          </p>
        </div>

        <form
          onSubmit={createCompetition}
          className="bg-white shadow rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            className="border rounded-lg p-3"
            placeholder="Brand / Host"
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
          />

          <input
            className="border rounded-lg p-3"
            placeholder="Competition Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="date"
            className="border rounded-lg p-3"
            value={form.start_date}
            onChange={(e) => setForm({ ...form, start_date: e.target.value })}
          />

          <input
            type="date"
            className="border rounded-lg p-3"
            value={form.end_date}
            onChange={(e) => setForm({ ...form, end_date: e.target.value })}
          />

          <textarea
            className="border rounded-lg p-3 md:col-span-2"
            placeholder="Competition Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <button className="bg-black text-white rounded-lg p-3 font-semibold md:col-span-2 hover:bg-gray-800">
            Create Brief
          </button>
        </form>

        <div>
          <h2 className="text-2xl font-bold mb-4">Generated Briefs</h2>

          {competitions.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-6 text-gray-500">
              No briefs created yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {competitions.map((brief) => (
                <div
                  key={brief.id}
                  className="bg-white rounded-2xl shadow-md p-6 border hover:shadow-xl transition"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <p className="text-sm text-gray-500">Brand / Host</p>
                      <h3 className="text-xl font-bold text-gray-900">
                        {brief.brand}
                      </h3>
                    </div>

                    <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">
                      #{brief.id}
                    </span>
                  </div>

                  <h4 className="text-lg font-semibold mt-4">{brief.name}</h4>

                  <p className="text-gray-600 mt-2 text-sm line-clamp-3">
                    {brief.description}
                  </p>

                  <div className="mt-4 bg-gray-50 rounded-lg p-3 text-sm">
                    <p>
                      <span className="font-semibold">Start:</span>{" "}
                      {brief.start_date}
                    </p>
                    <p>
                      <span className="font-semibold">End:</span>{" "}
                      {brief.end_date}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteCompetition(brief.id)}
                    className="mt-5 w-full bg-red-600 text-white rounded-lg p-2 hover:bg-red-700"
                  >
                    Delete Brief
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}