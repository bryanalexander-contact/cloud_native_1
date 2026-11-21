import React from 'react';

export default function LoginBranding() {
    return (
        <div style={styles.brandContainer}>
            {/* Logo Isotipo 'R' con flechas de ruta/logística */}
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 8H26C31.5228 8 36 12.4772 36 18C36 22.8252 32.5857 26.8524 28 27.75V28L37.5 40H28.5L20 28H18V40H10V8Z" fill="#0052CC"/>
                <path d="M18 15H25C26.6569 15 28 16.3431 28 18C28 19.6569 26.6569 21 25 21H18V15Z" fill="#ffffff"/>
                <path d="M22 18H34M34 18L30 14M34 18L30 22" stroke="#0052CC" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h1 style={styles.title}>RutaExpress</h1>
        </div>
    );
}

const styles = {
    brandContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '14px',
        marginBottom: '28px',
    },
    title: {
        fontSize: '36px',
        fontWeight: '800',
        color: '#0f172a',
        margin: 0,
        letterSpacing: '-0.5px',
    }
};