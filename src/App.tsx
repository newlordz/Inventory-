import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Sales } from './pages/Sales';
import { Restock } from './pages/Restock';
import { ShipmentLog } from './pages/ShipmentLog';
import { Login } from './pages/Login';
import { StaffManagement } from './pages/StaffManagement';
import { AppProvider, useAppContext } from './context/AppContext';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) {
    const { role } = useAppContext();

    if (!role) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(role)) {
        // Redirect unauthorized staff to sales
        return <Navigate to="/sales" replace />;
    }

    return <Layout>{children}</Layout>;
}

function AppRoutes() {
    const { role } = useAppContext();

    return (
        <Routes>
            <Route path="/login" element={role ? <Navigate to={role === 'owner' ? '/' : '/sales'} replace /> : <Login />} />

            <Route path="/" element={
                <ProtectedRoute allowedRoles={['owner']}>
                    <Dashboard />
                </ProtectedRoute>
            } />

            <Route path="/sales" element={
                <ProtectedRoute allowedRoles={['owner', 'staff']}>
                    <Sales />
                </ProtectedRoute>
            } />

            <Route path="/restock" element={
                <ProtectedRoute allowedRoles={['owner']}>
                    <Restock />
                </ProtectedRoute>
            } />

            <Route path="/shipments" element={
                <ProtectedRoute allowedRoles={['owner']}>
                    <ShipmentLog />
                </ProtectedRoute>
            } />

            <Route path="/staff" element={
                <ProtectedRoute allowedRoles={['owner']}>
                    <StaffManagement />
                </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <AppProvider>
            <AppRoutes />
        </AppProvider>
    );
}

export default App;
