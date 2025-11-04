import { Routes, Route} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserPage from "./pages/UserPage";
import HomePage from "./pages/HomePage";
import SystemAdminDashboard from "./pages/SystemAdminDashboard";
import DashboardOwner from "./pages/DashboardOwner";
import Navbar from "./pages/Navbar";
import AddStorePage from "./pages/AddStorePage";
import UpdatePassword from "./pages/UpdatePassword";
import AddUserForm from "./pages/AddUserForm";
import AddStoreForm from "./pages/AddStoreForm";

export default function App() {
  return (
    <div>
    <Navbar/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/update-password" element={<UpdatePassword/>} />
       
<Route
  path="/owner"
  element={
    <ProtectedRoute allowedRoles={["owner"]}>
      <DashboardOwner/>
    </ProtectedRoute>
  }
/>

<Route
  path="/user"
  element={
    <ProtectedRoute allowedRoles={["user"]}>
      <UserPage/>
    </ProtectedRoute>
  }
/>


        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <SystemAdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/add-store" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AddStoreForm/>
          </ProtectedRoute>
        } />
        <Route path="/admin/add-user" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AddUserForm/>
          </ProtectedRoute>
        } />

<Route
  path="/stores"
  element={
    <ProtectedRoute allowedRoles={["user","owner"]}>
      <AddStorePage />
    </ProtectedRoute>
  }
/>
        <Route path="/unauthorized" element={<h2>Not allowed 🚫</h2>} />
      </Routes>
    </div>
  );
}
