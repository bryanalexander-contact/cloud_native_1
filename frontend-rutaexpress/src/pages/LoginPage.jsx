import React from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../auth/authConfig';
import LoginHero from '../components/login/LoginHero';
import LoginBranding from '../components/login/LoginBranding';
import MicrosoftButton from '../components/login/MicrosoftButton';
import LoginFooter from '../components/login/LoginFooter';

export default function LoginPage() {
    const { instance } = useMsal();

    const handleLogin = () => {
        instance.loginRedirect(loginRequest).catch(error => {
            console.error("Error al iniciar sesión con redirección:", error);
        });
    };

    return (
        <div style={styles.pageContainer}>
            <div style={styles.leftPanel}>
                <LoginHero />
            </div>

            <div style={styles.rightPanel}>
                <div style={styles.formWrapper}>
                    <LoginBranding />
                    <MicrosoftButton onClick={handleLogin} />
                    <LoginFooter />
                </div>
            </div>
        </div>
    );
}

const styles = {
    pageContainer: {
        display: 'flex',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    leftPanel: {
        flex: '1',
        display: 'flex',
    },
    rightPanel: {
        flex: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        padding: '40px',
    },
    formWrapper: {
        width: '100%',
        maxWidth: '360px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '80%',
    }
};