


import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();
  const username =
  localStorage.getItem("name") || "User";

  const [stats, setStats] = useState({
    groups: 0,
    members: 0,
    expenses: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [activities, setActivities] = useState([]);

  const token = useMemo(() => localStorage.getItem("token"), []);
  

  const fetchStats = async () => {
    try {
      setError("");
      setLoading(true);

      const response = await api.get("/dashboard-stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats(response.data);
    } catch (err) {
      console.log(err);
      setError(
        "Couldn’t load dashboard stats. Please refresh or log in again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(
      "/activities",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    );
      setActivities(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchStats();
    fetchActivities();
  }, []);

  const logout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      
      navigate("/login");
    } finally {
      setLoggingOut(false);
    }
  };

  const formatINR = (value) => {
    const n = Number(value || 0);
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);
  };

  const StatCard = ({ title, value, icon, gradient }) => (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 shadow-sm border border-white/60 bg-white/80 backdrop-blur hover:shadow-xl transition-all ${gradient}`}
    >
      <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-white/40 to-transparent" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <h3 className="text-4xl font-extrabold mt-2 tracking-tight">
            {value}
          </h3>
        </div>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/70 border border-white/60">
          {icon}
        </div>
      </div>
      <div className="relative mt-3 text-xs text-gray-500">
        {title === "Total Expenses" ? "All-time total" : "Active this year"}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F3F4FF]">
      <div className="max-w-6xl mx-auto p-6 md:p-8">
        <div className="fixed inset-0 -z-10 overflow-hidden">className="flex items-center gap-3 bg-white/80 backdrop-blur px-4 py-2 rounded-2xl shadow-sm border border-white/60"
  <div className="absolute top-0 left-20 h-96 w-96 rounded-full bg-indigo-300/20 blur-3xl"></div>

  <div className="absolute right-20 top-40 h-96 w-96 rounded-full bg-violet-300/20 blur-3xl"></div>
</div>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
  <div className="flex items-center gap-3 bg-white/80 px-3 py-2 rounded-2xl shadow-sm border border-slate-200">
    <img
      src={`https://ui-avatars.com/api/?name=${username}&background=4F46E5&color=fff`}
      alt="avatar"
      className="w-10 h-10 rounded-full"
    />
    <div>
    <p className="text-sm font-semibold">
  {username}
</p>
      <p className="text-xs text-slate-500">Welcome back,{username}</p>
    </div>
  </div>

  <button
  onClick={logout}
  disabled={loggingOut}
  className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl font-semibold transition"
>
  {loggingOut ? "Logging out..." : "Logout"}
</button>
</div>

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-7 md:p-8 rounded-3xl shadow-lg mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
            <h2 className="text-2xl md:text-3xl font-bold">
  Hello {username} 👋
</h2>
              <p className="mt-2 text-blue-100">
              You are managing {stats.groups} groups and tracking {formatINR(stats.expenses)} in expenses.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block w-px h-10 bg-white/20" />
              <div className="text-sm text-blue-50">
                <div className="font-semibold">Today’s focus</div>
                <div className="opacity-90">Settle up faster</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {error ? (
          <div className="mb-6">
            <div className="bg-white border border-red-200 rounded-2xl p-4 text-red-700">
              {error}
              <button
                className="ml-3 inline-flex items-center px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-800 text-sm font-semibold"
                onClick={fetchStats}
              >
                Retry
              </button>
            </div>
          </div>
        ) : null}

        <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          {loading ? (
            <>
              <div className="rounded-2xl p-6 shadow-sm border border-white/60 bg-white/80">
                <div className="h-4 bg-slate-200 rounded w-24 mb-4 animate-pulse" />
                <div className="h-10 bg-slate-200 rounded w-28 animate-pulse" />
                <div className="h-3 bg-slate-200 rounded w-32 mt-3 animate-pulse" />
              </div>
              <div className="rounded-2xl p-6 shadow-sm border border-white/60 bg-white/80">
                <div className="h-4 bg-slate-200 rounded w-24 mb-4 animate-pulse" />
                <div className="h-10 bg-slate-200 rounded w-28 animate-pulse" />
                <div className="h-3 bg-slate-200 rounded w-32 mt-3 animate-pulse" />
              </div>
              <div className="rounded-2xl p-6 shadow-sm border border-white/60 bg-white/80">
                <div className="h-4 bg-slate-200 rounded w-28 mb-4 animate-pulse" />
                <div className="h-10 bg-slate-200 rounded w-40 animate-pulse" />
                <div className="h-3 bg-slate-200 rounded w-32 mt-3 animate-pulse" />
              </div>
            </>
          ) : (
            <>
              <StatCard
                title="Groups"
                value={stats.groups}
                gradient="from-blue-100 to-indigo-100"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-6 h-6 text-blue-700"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                }
              />

              <StatCard
                title="Members"
                value={stats.members}
                gradient="from-indigo-100 to-purple-100"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-6 h-6 text-indigo-700"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                }
              />

              <StatCard
                title="Total Expenses"
                value={`₹${stats.expenses}`}
                gradient="from-purple-100 to-pink-100"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-6 h-6 text-purple-700"
                  >
                    <path d="M3 7h18v10H3z" />
                    <path d="M16 12h5" />
                  </svg>
                }
              />
            </>
          )}
        </div>
        
        

        {/* Main Action */}
        <Link to="/groups">
          <div className="group bg-white/80 border border-white/60 backdrop-blur p-7 md:p-8 rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold">
                  👥 Manage Groups
                </h2>
                <p className="text-slate-600 mt-2 max-w-xl">
                  Create groups, add members, track expenses and calculate settlements.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </div>
                <div className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">
                  Open Groups
                </div>
              </div>
            </div>
          </div>
        </Link>
        <div className="mt-6 bg-white/80 backdrop-blur rounded-3xl p-6 border border-white/60 shadow-sm">

  <div className="flex justify-between items-center mb-5">
    <h2 className="text-2xl font-bold">
      Recent Activity
    </h2>

    <span className="text-sm text-slate-400">
      Latest Updates
    </span>
  </div>

  {activities.length === 0 ? (
  <div className="text-center py-8">

    <div className="text-5xl mb-3">
      📋
    </div>

    <h3 className="text-lg font-semibold text-slate-700">
      No Recent Activity
    </h3>

    <p className="text-slate-500 mt-2">
      Activities will appear here when you create groups,
      add members or record expenses.
    </p>

  </div>
) : (
  activities.map((activity) => (
    <div
      key={activity.id}
      className="border-b border-slate-200 py-3"
    >
      <p className="font-medium">
        {activity.message}
      </p>

      <p className="text-sm text-slate-400">
        {new Date(activity.created_at).toLocaleString()}
      </p>
    </div>
  ))
)}

</div>
        

 
      </div>
    </div>
  );
}

export default Dashboard;