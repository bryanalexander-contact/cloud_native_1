import { useMsal } from '@azure/msal-react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ShipmentsPage from './pages/ShipmentsPage';
import FleetPage from './pages/FleetPage';
import ReportsPage from './pages/ReportsPage';
import AuditPage from './pages/AuditPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
import DashboardLayout from './components/dashboard/DashboardLayout';

export default function App() {
    const { accounts } = useMsal();

    return (
        <BrowserRouter>
            <Routes>
                {accounts.length > 0 ? (
                    <>
                        <Route path="/" element={
                            <DashboardLayout title="Dashboard">
                                <DashboardPage />
                            </DashboardLayout>
                        } />
                        <Route path="/shipments" element={
                            <DashboardLayout title="Gestión de Envíos">
                                <ShipmentsPage />
                            </DashboardLayout>
                        } />
                        <Route path="/fleet" element={
                            <DashboardLayout title="Flota de Camiones">
                                <FleetPage />
                            </DashboardLayout>
                        } />
                        <Route path="/reports" element={
                            <DashboardLayout title="Reportes">
                                <ReportsPage />
                            </DashboardLayout>
                        } />
                        <Route path="/audit" element={
                            <DashboardLayout title="Auditoría">
                                <AuditPage />
                            </DashboardLayout>
                        } />
                        <Route path="/settings" element={
                            <DashboardLayout title="Configuración">
                                <SettingsPage />
                            </DashboardLayout>
                        } />
                        <Route path="/help" element={
                            <DashboardLayout title="Centro de Ayuda">
                                <HelpPage />
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
