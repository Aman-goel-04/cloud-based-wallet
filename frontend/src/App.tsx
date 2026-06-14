import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SendTransaction from "./pages/SendTransaction";
import { useAuth } from "./context/useAuth";
import { AuthProvider } from "./context/AuthProvider";
import Signup from "./pages/signup";
import Signin from "./pages/signin";
import Dashboard from "./pages/Dashboard";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { publicKey } = useAuth();
  if (!publicKey) return <Navigate to="/signin" />;
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/send"
            element={
              <ProtectedRoute>
                <SendTransaction />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/signup" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;