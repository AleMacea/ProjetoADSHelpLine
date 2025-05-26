import React from "react";
import { Button } from "@/components/ui/button";
import Sidebar from "./components/Sidebar";


// Simulação de dados de chamados
const tickets = [
    {
        id: 1,
        date: "24/05/2025",
        problem: "Problema com a VPN",
        requester: "João Silva",
        responsible: "Carlos Souza",
        category: "Rede",
        status: "Em Andamento",
        priority: "Alta",
    },
    {
        id: 2,
        date: "23/05/2025",
        problem: "Tela azul no computador",
        requester: "Maria Oliveira",
        responsible: "Ana Costa",
        category: "Hardware",
        status: "Aberto",
        priority: "Média",
    },
    {
        id: 3,
        date: "22/05/2025",
        problem: "Erro ao acessar Intranet",
        requester: "Felipe Martins",
        responsible: "Ricardo Lima",
        category: "VPN",
        status: "Fechado",
        priority: "Baixa",
    },
];

export function TicketList() {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar fixa à esquerda */}
            <Sidebar />
            <div className="p-6 bg-gray-50 min-h-screen">
                <h1 className="text-3xl font-bold mb-4">Lista de Chamados</h1>
                <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-200 text-gray-700">
                                <th className="p-2 text-left">ID</th>
                                <th className="p-2 text-left">Data</th>
                                <th className="p-2 text-left">Problema</th>
                                <th className="p-2 text-left">Solicitante</th>
                                <th className="p-2 text-left">Responsável</th>
                                <th className="p-2 text-left">Categoria</th>
                                <th className="p-2 text-left">Situação</th>
                                <th className="p-2 text-left">Prioridade</th>
                                <th className="p-2 text-left">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map((ticket) => (
                                <tr key={ticket.id} className="border-t">
                                    <td className="p-2">{ticket.id}</td>
                                    <td className="p-2">{ticket.date}</td>
                                    <td className="p-2">{ticket.problem}</td>
                                    <td className="p-2">{ticket.requester}</td>
                                    <td className="p-2">{ticket.responsible}</td>
                                    <td className="p-2">{ticket.category}</td>
                                    <td className="p-2">{ticket.status}</td>
                                    <td className="p-2">
                                        <span
                                            className={`inline-block w-4 h-4 rounded-full ${ticket.priority === "Alta"
                                                    ? "bg-red-500"
                                                    : ticket.priority === "Média"
                                                        ? "bg-yellow-500"
                                                        : "bg-green-500"
                                                }`}
                                        ></span>
                                    </td>
                                    <td className="p-2">
                                        <Button variant="outline" className="mr-2">Ver</Button>
                                        <Button variant="outline">Editar</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default TicketList;
