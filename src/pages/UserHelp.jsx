import { Wifi, Monitor, ShieldAlert, Lock } from "lucide-react";
import UserSidebar from "./components/UserSidebar";

export function UsefulArticles() {
    const articles = [
        {
            icon: <Wifi size={32} />,
            title: "Problema com a Internet",
            description: "Desligue o modem da tomada por 10 segundos e religue para restaurar a conexão.",
        },
        {
            icon: <Monitor size={32} />,
            title: "Tela Azul no Computador",
            description: "Reinicie o sistema e verifique se há atualizações pendentes do Windows.",
        },
        {
            icon: <ShieldAlert size={32} />,
            title: "Erro ao Acessar VPN",
            description: "Confira suas credenciais e tente reconectar. Se persistir, reinicie o roteador.",
        },
        {
            icon: <Lock size={32} />,
            title: "Senha Corporativa Expirada",
            description: "Acesse o portal de recuperação de senha e siga os passos para criar uma nova.",
        },
    ];

    return (
        <div className="flex min-h-screen">
            {/* Sidebar fixa à esquerda */}
            <UserSidebar />
            <div className="p-6 bg-gray-50 min-h-screen">
                <h1 className="text-3xl font-bold mb-6">Artigos Úteis</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {articles.map((article, index) => (
                        <div key={index} className="bg-white shadow-md rounded-lg p-4 flex items-center">
                            <div className="text-blue-600">{article.icon}</div>
                            <div className="ml-4">
                                <h2 className="text-xl font-semibold">{article.title}</h2>
                                <p className="text-gray-600">{article.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default UsefulArticles;
