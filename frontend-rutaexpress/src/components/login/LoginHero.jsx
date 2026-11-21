import React from 'react';
import PortadaLogin from "../../assets/public/PortadaLogin.jpg"

export default function LoginHero() {
    return (
        <div style={{ ...styles.heroContainer, backgroundImage: `url(${PortadaLogin})` }} />
    );
}


const styles = {
    heroContainer: {
        width: '100%',
        height: '100%',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    }
};
