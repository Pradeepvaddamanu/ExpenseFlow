import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Groups from "./pages/Groups";
import Settlement from "./pages/Settlement";
import GroupDetails from "./pages/GroupDetails";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
  path="/groups/:groupId"
  element={<GroupDetails />}
/>

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/groups" element={<Groups />} />

        <Route path="/settlement" element={<Settlement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;