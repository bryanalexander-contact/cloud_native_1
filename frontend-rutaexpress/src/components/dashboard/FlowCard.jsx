import React, { useState } from 'react';
import { Activity, CheckCircle2, Clock, Truck, Package, Check } from 'lucide-react';

const STAGES = [
    { name: 'Creado', icon: Package, count: 12, desc: 'Ingreso al sistema' },
    { name: 'Aceptado', icon: CheckCircle2, count: 8, desc: 'Validado por despacho' },
    { name: 'En Bodega', icon: Clock, count: 5, desc: 'Preparación de carga' },
    { name: 'En Ruta', icon: Truck, count: 14, desc: 'Transporte activo' },
    { name: 'Entregado', icon: Check, count: 32, desc: 'Recepción conforme' },
];

export default function FlowCard() {
    const [selectedStage, setSelectedStage] = useState(null);

    return (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
                <div className="flex items-center gap-2">
                    <Activity className="text-blue-600" size={20} />
                    <span className="font-bold text-slate-900 text-sm">Flujo de Trazabilidad en Tiempo Real (Kafka Stream)</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">Tópico:</span>
                    <code className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">shipment-status-topic</code>
                </div>
            </div>
            
            {/* Diagrama de etapas */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {STAGES.map((stage, idx) => {
                    const Icon = stage.icon;
                    const isSelected = selectedStage === stage.name;
                    return (
                        <div
                            key={stage.name}
                            onClick={() => setSelectedStage(isSelected ? null : stage.name)}
                            className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                                isSelected 
                                    ? 'bg-blue-50 border-blue-400 shadow-sm ring-2 ring-blue-200' 
                                    : 'bg-slate-50 border-slate-100 hover:border-slate-300 hover:bg-slate-100/60'
                            }`}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 shadow-2xs'}`}>
                                    <Icon size={18} />
                                </div>
                                <span className="text-xs font-bold text-slate-400 font-mono">0{idx + 1}</span>
                            </div>
                            <div className="font-bold text-slate-900 text-sm">{stage.name}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{stage.desc}</div>
                            <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
                                <span className="text-slate-400">En tránsito:</span>
                                <span className="font-bold text-blue-600">{stage.count} uds.</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}