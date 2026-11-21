import React from 'react';

export default function MicrosoftButton({ onClick }) {
    return (
        <button onClick={onClick} style={styles.button}>
            <svg width="18" height="18" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
            </svg>
            <span>Iniciar sesión con Microsoft</span>
        </button>
    );
}

const styles = {
    button: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        width: '100%',
        padding: '12px 20px',
        backgroundColor: '#ffffff',
        color: '#1a1a1a',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        transition: 'all 0.2s ease',
    }
};