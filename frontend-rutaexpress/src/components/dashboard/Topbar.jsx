import React, { useState, useRef, useEffect } from 'react';

export default function Topbar({ title = 'Dashboard', userName, userEmail, onLogout }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const menuRef = useRef(null);

    // Cerrar el menú al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogoutClick = () => {
        setMenuOpen(false);
        setShowConfirm(true);
    };

    const handleConfirmLogout = () => {
        setShowConfirm(false);
        onLogout();
    };

    const handleViewProfile = () => {
        setMenuOpen(false);
        setShowProfile(true);
    };

    const displayName = userName || 'Usuario';
    const initials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    return (
        <>
            <header style={styles.topbar}>
                <h1 style={styles.pageTitle}>{title}</h1>

                <div style={styles.userSection}>
                    <div style={styles.azureBadge}>
                        <span style={styles.dot}></span>
                        <span>Autenticado con Azure AD</span>
                    </div>

                    {/* Botón de perfil con dropdown */}
                    <div style={styles.profileWrapper} ref={menuRef}>
                        <div
                            style={styles.userProfile}
                            onClick={() => setMenuOpen(!menuOpen)}
                            title="Opciones de perfil"
                        >
                            <div style={styles.avatarCircle}>
                                <span style={styles.avatarInitials}>{initials}</span>
                            </div>
                            <span style={styles.userName}>{displayName}</span>
                            <span style={{ ...styles.chevron, transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                        </div>

                        {/* Menú desplegable */}
                        {menuOpen && (
                            <div style={styles.dropdown}>
                                <div style={styles.dropdownHeader}>
                                    <div style={styles.dropdownAvatar}>{initials}</div>
                                    <div>
                                        <div style={styles.dropdownName}>{displayName}</div>
                                        {userEmail && <div style={styles.dropdownEmail}>{userEmail}</div>}
                                    </div>
                                </div>
                                <div style={styles.dropdownDivider} />
                                <button
                                    style={styles.dropdownItem}
                                    onClick={handleViewProfile}
                                    onMouseEnter={e => e.target.style.backgroundColor = '#f1f5f9'}
                                    onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
                                >
                                    👤  Ver Perfil
                                </button>
                                <div style={styles.dropdownDivider} />
                                <button
                                    style={{ ...styles.dropdownItem, color: '#dc2626' }}
                                    onClick={handleLogoutClick}
                                    onMouseEnter={e => e.target.style.backgroundColor = '#fef2f2'}
                                    onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
                                >
                                    🚪  Cerrar Sesión
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Modal de confirmación de logout */}
            {showConfirm && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <div style={styles.modalIcon}>🔐</div>
                        <h2 style={styles.modalTitle}>¿Cerrar sesión?</h2>
                        <p style={styles.modalText}>
                            ¿Estás seguro de que deseas salir de <strong>RutaExpress</strong>?
                            Deberás autenticarte nuevamente con Microsoft para volver a acceder.
                        </p>
                        <div style={styles.modalActions}>
                            <button
                                style={styles.btnCancel}
                                onClick={() => setShowConfirm(false)}
                                onMouseEnter={e => e.target.style.backgroundColor = '#f1f5f9'}
                                onMouseLeave={e => e.target.style.backgroundColor = '#ffffff'}
                            >
                                Cancelar
                            </button>
                            <button
                                style={styles.btnLogout}
                                onClick={handleConfirmLogout}
                                onMouseEnter={e => e.target.style.backgroundColor = '#b91c1c'}
                                onMouseLeave={e => e.target.style.backgroundColor = '#dc2626'}
                            >
                                Sí, cerrar sesión
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Ver Perfil */}
            {showProfile && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <div style={styles.modalIcon}>👤</div>
                        <h2 style={styles.modalTitle}>Perfil de Usuario</h2>
                        <div style={styles.profileInfo}>
                            <div style={styles.profileAvatarLarge}>{initials}</div>
                            <div style={styles.profileField}>
                                <span style={styles.profileLabel}>Nombre</span>
                                <span style={styles.profileValue}>{displayName}</span>
                            </div>
                            {userEmail && (
                                <div style={styles.profileField}>
                                    <span style={styles.profileLabel}>Correo</span>
                                    <span style={styles.profileValue}>{userEmail}</span>
                                </div>
                            )}
                            <div style={styles.profileField}>
                                <span style={styles.profileLabel}>Proveedor</span>
                                <span style={styles.profileValue}>Microsoft Azure AD</span>
                            </div>
                            <div style={styles.profileField}>
                                <span style={styles.profileLabel}>Rol</span>
                                <span style={{ ...styles.profileValue, color: '#2563eb', backgroundColor: '#eff6ff', padding: '2px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>
                                    Despachador
                                </span>
                            </div>
                        </div>
                        <div style={styles.modalActions}>
                            <button
                                style={styles.btnCancel}
                                onClick={() => setShowProfile(false)}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
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
        display: 'inline-block',
        width: '8px',
        height: '8px',
        backgroundColor: '#3b82f6',
        borderRadius: '50%',
    },
    profileWrapper: {
        position: 'relative',
    },
    userProfile: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        color: '#1e293b',
        padding: '6px 10px',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
        transition: 'background-color 0.15s',
        userSelect: 'none',
    },
    avatarCircle: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        backgroundColor: '#2563eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    avatarInitials: {
        color: '#ffffff',
        fontSize: '13px',
        fontWeight: '700',
    },
    userName: {
        fontSize: '14px',
        maxWidth: '150px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    chevron: {
        fontSize: '10px',
        color: '#64748b',
        transition: 'transform 0.2s',
    },
    dropdown: {
        position: 'absolute',
        top: 'calc(100% + 8px)',
        right: 0,
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
        minWidth: '220px',
        zIndex: 1000,
        overflow: 'hidden',
    },
    dropdownHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 16px',
        backgroundColor: '#f8fafc',
    },
    dropdownAvatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#2563eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: '700',
        fontSize: '14px',
        flexShrink: 0,
    },
    dropdownName: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#0f172a',
    },
    dropdownEmail: {
        fontSize: '11px',
        color: '#64748b',
        marginTop: '2px',
    },
    dropdownDivider: {
        height: '1px',
        backgroundColor: '#f1f5f9',
    },
    dropdownItem: {
        display: 'block',
        width: '100%',
        padding: '12px 16px',
        textAlign: 'left',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        color: '#334155',
        fontFamily: 'inherit',
        transition: 'background-color 0.15s',
    },
    // Modal overlay
    overlay: {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(4px)',
    },
    modal: {
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '36px',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        textAlign: 'center',
    },
    modalIcon: {
        fontSize: '48px',
        marginBottom: '16px',
    },
    modalTitle: {
        fontSize: '20px',
        fontWeight: '700',
        color: '#0f172a',
        margin: '0 0 12px 0',
    },
    modalText: {
        fontSize: '14px',
        color: '#64748b',
        lineHeight: '1.6',
        margin: '0 0 28px 0',
    },
    modalActions: {
        display: 'flex',
        gap: '12px',
        justifyContent: 'center',
    },
    btnCancel: {
        padding: '10px 24px',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
        color: '#64748b',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'background-color 0.15s',
    },
    btnLogout: {
        padding: '10px 24px',
        borderRadius: '10px',
        border: 'none',
        backgroundColor: '#dc2626',
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'background-color 0.15s',
    },
    // Profile modal
    profileInfo: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '24px',
    },
    profileAvatarLarge: {
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: '#2563eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: '700',
        fontSize: '22px',
        margin: '0 auto 8px',
    },
    profileField: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        width: '100%',
    },
    profileLabel: {
        fontSize: '11px',
        fontWeight: '600',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    profileValue: {
        fontSize: '15px',
        fontWeight: '500',
        color: '#1e293b',
    },
};