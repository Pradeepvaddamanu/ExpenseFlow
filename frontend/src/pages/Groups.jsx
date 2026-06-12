import { useState, useEffect } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";

function Groups() {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [groups, setGroups] = useState([]);

  const token = localStorage.getItem("token");

  const fetchGroups = async () => {
    try {
      const response = await api.get("/groups", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setGroups(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const createGroup = async () => {
    try {
      const response = await api.post(
        "/groups",
        {
          name: groupName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setGroupName("");
  
      navigate(`/groups/${response.data.group_id}`);
  
    } catch (error) {
      console.log(error);
      alert("Failed to create group");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="max-w-6xl mx-auto p-8">

        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-4xl font-bold">
              ExpenseFlow
            </h1>

            <p className="text-gray-500 mt-2">
              Manage your groups and expenses
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>

        </div>

        <div className="bg-white p-6 rounded-2xl shadow mb-8">

          <h2 className="text-2xl font-semibold mb-4">
            Create New Group
          </h2>

          <div className="flex gap-4">

            <input
              type="text"
              placeholder="Enter Group Name"
              value={groupName}
              onChange={(e) =>
                setGroupName(e.target.value)
              }
              className="flex-1 border border-gray-300 rounded-lg p-3"
            />

            <button
              onClick={createGroup}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
            >
              Create
            </button>

          </div>

        </div>

        <h2 className="text-2xl font-semibold mb-4">
          My Groups
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {groups.map((group) => (
            <Link
              key={group.id}
              to={`/groups/${group.id}`}
            >
              <div className="bg-white p-5 rounded-2xl shadow hover:shadow-xl transition-all duration-300">

                <h3 className="text-xl font-bold">
                  {group.name}
                </h3>

                <p className="text-gray-500 mt-3">
                  Open Group →
                </p>

              </div>
            </Link>
          ))}

        </div>

      </div>

    </div>
  );
}

export default Groups;