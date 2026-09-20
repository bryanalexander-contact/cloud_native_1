import React from 'react';

export default function ShipmentStatusBadge({ status }) {
    let bg = '#e0f2fe';
    let color = '#0369a1';
    let label = 'Creado';

    if (status === 'IN_TRANSIT' || status === 'En Ruta') {
        bg = '#fef3c7';
        color = '#b45309';
        label = 'En Ruta';
    } else if (status === 'DELIVERED' || status === 'Aceptado') {
        bg = '#d1fae5';
        color = '#047857';
        label = 'Aceptado';
    }

    return (
        <span style={{
            backgroundColor: bg,
            color: color,
            padding: '4px 12px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: '700',
            display: 'inline-block'
        }}>
            {label}
        </span>
    );
}