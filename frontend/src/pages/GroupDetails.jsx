import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import ExpenseChart from "../components/expensechart";
function GroupDetails() {
  const { groupId } = useParams();

  const [members, setMembers] = useState([]);
  const [memberName, setMemberName] = useState("");
  const [insight, setInsight] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [category, setCategory] = useState("");
  const [scanning, setScanning] = useState(false);

  const [expenses, setExpenses] = useState([]);
  const [paidBy, setPaidBy] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [editingExpense, setEditingExpense] = useState(null);

  const [editAmount, setEditAmount] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPaidBy, setEditPaidBy] = useState("");

  const [settlements, setSettlements] = useState([]);

  const token = localStorage.getItem("token");

  const fetchMembers = async () => {
    try {
      const response = await api.get(
        `/groups/${groupId}/members`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMembers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addMember = async () => {
    try {
      await api.post(
        `/groups/${groupId}/members`,
        {
          member_name: memberName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMemberName("");
      fetchMembers();
    } catch (error) {
      console.log(error);
    }
  };
  const scanReceipt = async () => {
    try {
      setScanning(true);
  
      const formData = new FormData();
      formData.append("file", receipt);
  
      const response = await api.post(
        "/ocr-receipt",
        formData
      );
      console.log(response.data);
  
      setAmount(response.data.amount);
      setDescription(response.data.description);
      setCategory(response.data.category);
  
    } catch (error) {
      console.log(error);
    } finally {
      setScanning(false);
    }
  };
  const fetchExpenses = async () => {
    try {
      const response = await api.get(
        `/groups/${groupId}/expenses`
      );

      setExpenses(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addExpense = async () => {
    try {
      await api.post(
        `/groups/${groupId}/expenses`,
        {
          paid_by: paidBy,
          amount: Number(amount),
          description: description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPaidBy("");
      setAmount("");
      setDescription("");

      fetchExpenses();
    } catch (error) {
      console.log(error);
    }
  };
  const generateInsights = async () => {
    try {
      setLoadingAI(true);
  
      const response = await api.post(
        "/ai-insights",
        {
          expenses: expenses
        }
      );
  
      setInsight(response.data.insight);
  
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingAI(false);
    }
  };
  const deleteExpense = async (expenseId) => {
    try {
      await api.delete(
        `/expenses/${expenseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      fetchExpenses();
      fetchSettlement();
  
    } catch (error) {
      console.log(error);
    }
  };
  const updateExpense = async () => {
    try {
      await api.put(
        `/expenses/${editingExpense.id}`,
        {
          paid_by: editPaidBy,
          amount: Number(editAmount),
          description: editDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setEditingExpense(null);
  
      fetchExpenses();
      fetchSettlement();
  
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSettlement = async () => {
    try {
      const response = await api.get(
        `/groups/${groupId}/optimized-settlement`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Settlement:", response.data);
  
      setSettlements(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchMembers();
    fetchExpenses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
  
      <div className="max-w-7xl mx-auto">
  
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
  
          <h1 className="text-4xl font-bold">
            Group Details
          </h1>
  
          <p className="text-gray-500 mt-2">
            Group ID: {groupId}
          </p>
  
        </div>
  
        <div className="grid md:grid-cols-3 gap-6 mb-8">
  
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-gray-500">
              Members
            </h3>
  
            <p className="text-3xl font-bold mt-2">
              {members.length}
            </p>
          </div>
  
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-gray-500">
              Expenses
            </h3>
  
            <p className="text-3xl font-bold mt-2">
              {expenses.length}
            </p>
          </div>
  
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-gray-500">
              Settlements
            </h3>
  
            <p className="text-3xl font-bold mt-2">
              {settlements.length}
            </p>
          </div>
  
        </div>
  
        <div className="grid lg:grid-cols-2 gap-8">
  
          <div className="bg-white rounded-2xl shadow p-6">
  
            <h2 className="text-2xl font-semibold mb-4">
              Members
            </h2>
  
            <div className="flex gap-3 mb-6">
  
              <input
                type="text"
                placeholder="Member Name"
                value={memberName}
                onChange={(e) =>
                  setMemberName(e.target.value)
                }
                className="border p-3 rounded-lg flex-1"
              />
  
              <button
                onClick={addMember}
                className="bg-black text-white px-5 rounded-lg"
              >
                Add
              </button>
  
            </div>
  
            {members.map((member) => (
              <div
                key={member.id}
                className="border rounded-lg p-3 mb-2"
              >
                {member.member_name}
              </div>
            ))}
  
          </div>
  
          <div className="bg-white rounded-2xl shadow p-6">
  
            <h2 className="text-2xl font-semibold mb-4">
              Add Expense
            </h2>
            <input
  type="file"
  onChange={(e) =>
    setReceipt(e.target.files[0])
  }
  className="hidden"
  id="receiptUpload"
/>

<label
  htmlFor="receiptUpload"
  className="cursor-pointer flex items-center justify-between border-2 border-dashed border-purple-300 bg-purple-50 hover:bg-purple-100 rounded-xl p-4 transition"
>
  <span className="text-slate-600">
    {receipt
      ? `📄 ${receipt.name}`
      : "Upload Receipt or Screenshot"}
  </span>

  <span className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium shadow">
  📁 Browse
</span>
</label>

{receipt && (
  <p className="text-green-600 text-sm mt-2">
    ✓ File selected successfully
  </p>
)}
            
  
            <div className="space-y-3">
  
              <input
                type="text"
                placeholder="Paid By"
                value={paidBy}
                onChange={(e) =>
                  setPaidBy(e.target.value)
                }
                className="border p-3 rounded-lg w-full"
              />
  
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
                className="border p-3 rounded-lg w-full"
              />
  
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                className="border p-3 rounded-lg w-full"
              />
              <input
  value={category}
  onChange={(e) =>
    setCategory(e.target.value)
  }
  placeholder="Category"
  className="border p-3 rounded-lg w-full"
/>
<button
  onClick={scanReceipt}
  disabled={scanning}
  className="bg-purple-600 text-white px-4 py-2 rounded-lg disabled:opacity-60"
>
  {scanning
    ? "🔄 Scanning..."
    : "✨ Scan Receipt"}
</button>
{scanning && (
  <p className="text-purple-600 text-sm mt-2">
    Extracting receipt details...
  </p>
)}
  
              <button
                onClick={addExpense}
                className="bg-black text-white px-5 py-3 rounded-lg w-full"
              >
                Add Expense
              </button>
              
  
            </div>

  
          </div>
  
        </div>
  
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
  
          <div className="bg-white rounded-2xl shadow p-6">
  
            <h2 className="text-2xl font-semibold mb-4">
              Expenses
            </h2>
  
            {expenses.map((expense) => (
  <div
    key={expense.id}
    className="border rounded-xl p-4 mb-3 flex justify-between items-center bg-white"
  >
    <div>
      <p className="font-semibold">
        {expense.paid_by}
      </p>

      <p className="text-slate-600">
        ₹{expense.amount} • {expense.description}
      </p>
    </div>

    <div className="flex gap-2">
    <button
  onClick={() => {
    setEditingExpense(expense);

    setEditPaidBy(expense.paid_by);
    setEditAmount(expense.amount);
    setEditDescription(expense.description);
  }}
  className="bg-blue-500 text-white px-3 py-1 rounded-lg"
>
  Edit
</button>

      <button
        onClick={() => deleteExpense(expense.id)}
        className="bg-red-500 text-white px-3 py-1 rounded-lg"
      >
        Delete
      </button>
    </div>
  </div>
))}
  
          </div>
  
          <div className="bg-white rounded-2xl shadow p-6">
  
            <div className="flex justify-between items-center mb-4">
  
              <h2 className="text-2xl font-semibold">
                Settlement
              </h2>
  
              <button
                onClick={fetchSettlement}
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Calculate
              </button>
  
            </div>
            <p>Settlements Found: {settlements.length}</p>
  
            {settlements.map((settlement) => (
  <div
    key={`${settlement.from}-${settlement.to}`}
    className="bg-gradient-to-r from-emerald-50 to-green-50 border border-green-100 rounded-2xl p-4 shadow-sm mb-3"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500">
          Needs to Pay
        </p>

        <h3 className="font-bold text-lg">
          {settlement.from}
        </h3>
      </div>

      <div className="text-2xl">
        →
      </div>

      <div className="text-right">
        <p className="text-sm text-slate-500">
          Receives
        </p>

        <h3 className="font-bold text-lg">
          {settlement.to}
        </h3>
      </div>
    </div>

    <div className="mt-4 text-center">
      <span className="text-3xl font-bold text-emerald-600">
        ₹{settlement.amount}
      </span>
    </div>
  </div>
))}
            
  
          </div>
  
        </div>
        <div className="bg-white rounded-2xl shadow p-6 mt-8">

  <div className="flex justify-between items-center">

    <h2 className="text-2xl font-semibold">
      🤖 AI Insights
    </h2>

    <button
  onClick={generateInsights}
  disabled={loadingAI}
  className="bg-purple-600 text-white px-4 py-2 rounded-lg"
>
  {loadingAI ? "Generating..." : "Generate"}
</button>

  </div>

  {insight && (
  <div className="mt-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 p-6 rounded-xl">

    <h3 className="text-lg font-semibold text-purple-700 mb-3">
      AI Expense Report
    </h3>

    <div className="whitespace-pre-wrap text-gray-700">
      {insight}
    </div>

  </div>
)}

</div>
<div className="mt-8">
  <ExpenseChart expenses={expenses} />
</div>
{editingExpense && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    <div className="bg-white rounded-2xl p-6 w-full max-w-md">

      <h2 className="text-2xl font-bold mb-4">
        Edit Expense
      </h2>

      <input
        value={editPaidBy}
        onChange={(e) =>
          setEditPaidBy(e.target.value)
        }
        placeholder="Paid By"
        className="border p-3 rounded-lg w-full mb-3"
      />

      <input
        value={editAmount}
        onChange={(e) =>
          setEditAmount(e.target.value)
        }
        placeholder="Amount"
        className="border p-3 rounded-lg w-full mb-3"
      />

      <input
        value={editDescription}
        onChange={(e) =>
          setEditDescription(e.target.value)
        }
        placeholder="Description"
        className="border p-3 rounded-lg w-full mb-4"
      />
      <input
  value={description}
  onChange={(e) =>
    setDescription(e.target.value)
  }
  placeholder="Description"
/>



      <div className="flex gap-3">

        <button
          onClick={updateExpense}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex-1"
        >
          Save
        </button>

        <button
          onClick={() =>
            setEditingExpense(null)
          }
          className="bg-gray-300 px-4 py-2 rounded-lg flex-1"
        >
          Cancel
        </button>

      </div>

    </div>

  </div>
)}
        
  
      </div>
      
  
    </div>
  );
}
export default GroupDetails;