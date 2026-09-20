import React from 'react';

export default function Topbar({ title = 'Dashboard', userName, onLogout }) {
    return (
        <header style={styles.topbar}>
            <h1 style={styles.pageTitle}>{title}</h1>
            
            <div style={styles.userSection}>
                <div style={styles.azureBadge}>
                    <span style={styles.dot}></span>
                    <span>Autenticado con Azure AD</span>
                </div>
                <div style={styles.userProfile} onClick={onLogout} title="Hacer clic para cerrar sesión">
                    <img 
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
                        alt="Avatar" 
                        style={styles.avatar} 
                    />
                    <span style={styles.userName}>{userName || 'Carlos Rodriguez'}</span>
                    <span>▼</span>
                </div>
            </div>
        </header>
    );
}

const styles = {
    topbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
    },
    pageTitle: {
        fontSize: '22px',
        fontWeight: 'bold',
        color: '#0f172a',
        margin: 0,
    },
    userSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    azureBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        backgroundColor: '#eff6ff',
        color: '#1d4ed8',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '500',
        border: '1px solid #bfdbfe',
    },
    dot: {
        width: '8px',
        height: '8px',
        backgroundColor: '#3b82f6',
        borderRadius: '50%',
    },
    userProfile: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        color: '#1e293b',
    },
    avatar: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        objectFit: 'cover',
    },
    userName: {
        fontSize: '14px',
    }
};