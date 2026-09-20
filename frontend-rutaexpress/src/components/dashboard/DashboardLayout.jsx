import { useMsal } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardLayout({ children, title = 'Dashboard' }) {
    const { instance, accounts, inProgress } = useMsal();
    const activeAccount = accounts[0];

    const handleLogout = () => {
        const currentAccount = instance.getActiveAccount() || activeAccount;

        instance.logoutRedirect({
            account: currentAccount,
            postLogoutRedirectUri: "/",
        }).catch(e => console.error("Error al cerrar sesión:", e));
    };

    if (inProgress !== InteractionStatus.None) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
                <p>Cargando sesión con Microsoft Entra ID...</p>
            </div>
        );
    }

    return (
        <div style={styles.layout}>
            <Sidebar />

            <main style={styles.mainContent}>
                <Topbar title={title} userName={activeAccount?.name || activeAccount?.username} onLogout={handleLogout} />
                {children}
            </main>
        </div>
    );
}

const styles = {
    layout: {
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    mainContent: {
        flex: 1,
        marginLeft: '240px',
        padding: '30px',
    }
};
