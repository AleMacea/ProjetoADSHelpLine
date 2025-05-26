import React from "react";
import Sidebar from './components/Sidebar';

export function KnowledgeBase() {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar fixa à esquerda */}
            <Sidebar />

            <div className="flex-1 p-6 bg-gray-50">
                <h1 className="text-3xl font-bold mb-4">Base de Conhecimento</h1>
                <p className="text-gray-700">Aqui os administradores podem documentar artigos para ajudar na solução de problemas.</p>
            </div>
        </div>
    );
}

export default KnowledgeBase;
