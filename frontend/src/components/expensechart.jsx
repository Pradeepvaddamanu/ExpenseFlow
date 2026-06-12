import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";
  
  function ExpenseChart({ expenses }) {
    const chartData = expenses.map((expense) => ({
      name: expense.description,
      amount: expense.amount,
    }));
  
    return (
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">
          📊 Expense Distribution
        </h2>
  
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
  
            <XAxis dataKey="name" />
  
            <YAxis />
  
            <Tooltip />
  
            <Bar dataKey="amount" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
  
  export default ExpenseChart;