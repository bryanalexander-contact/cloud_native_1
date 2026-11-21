import React from 'react';

export default function LoginFooter() {
    return (
        <div style={styles.footer}>
            <p style={styles.mainText}>Iniciar sesión segura según normativa oficial</p>
            <div style={styles.subTextContainer}>
                <span style={styles.dot} />
                <span style={styles.subText}>Autenticación segura mediante Azure AD (MSAL)</span>
            </div>
        </div>
    );
}

const styles = {
    footer: {
        textAlign: 'center',
    },
    mainText: {
        fontSize: '14px',
        color: '#111827',
        fontWeight: '600',
        marginBottom: '6px',
    },
    subTextContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
    },
    dot: {
        width: '6px',
        height: '6px',
        backgroundColor: '#d1d5db',
        borderRadius: '50%',
    },
    subText: {
        fontSize: '12px',
        color: '#9ca3af',
    }
};