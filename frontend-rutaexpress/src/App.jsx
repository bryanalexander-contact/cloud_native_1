import { useMsal } from '@azure/msal-react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ShipmentsPage from './pages/ShipmentsPage';
import DashboardLayout from './components/dashboard/DashboardLayout';

export default function App() {
    const { accounts } = useMsal();

    return (
        <BrowserRouter>
            <Routes>
                {accounts.length > 0 ? (
                    <>
                        <Route path="/" element={
                            <DashboardLayout>
                                <DashboardPage />
                            </DashboardLayout>
                        } />
                        <Route path="/shipments" element={
                            <DashboardLayout title="Gestión de Envíos">
                                <ShipmentsPage />
                            </DashboardLayout>
                        } />
                        <Route path="*" element={<Navigate to="/" />} />
                    </>
                ) : (
                    <>
                        <Route path="/" element={<LoginPage />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </>
                )}
            </Routes>
        </BrowserRouter>
    );
}
