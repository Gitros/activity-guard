import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import AuditLogsPage from "./pages/AuditLogsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* protected */}
      <Route element={<ProtectedRoute />}>
        <Route path="/audit-logs" element={<AuditLogsPage />} />
      </Route>

      {/* default */}
      <Route path="/" element={<Navigate to="/audit-logs" replace />} />
      <Route path="*" element={<Navigate to="/audit-logs" replace />} />
    </Routes>
  );
}
