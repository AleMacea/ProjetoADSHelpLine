import React from "react";
import { Wifi, Monitor, ShieldAlert, Lock, Printer, ThumbsUp, ThumbsDown } from "lucide-react";
import UserSidebar from "./components/UserSidebar";

export function UsefulArticles() {
  const articles = [
    {
      icon: <Wifi size={32} />,
      title: "Problema com a Internet",
      description:
        "Desligue o modem da tomada por 10 segundos e religue para restaurar a conexão.",
    },
    {
      icon: <Monitor size={32} />,
      title: "Tela Azul no Computador",
      description:
        "Reinicie o sistema e verifique se há atualizações pendentes do Windows.",
    },
    {
      icon: <ShieldAlert size={32} />,
      title: "Erro ao Acessar VPN",
      description:
        "Confira suas credenciais e tente reconectar. Se persistir, reinicie o roteador.",
    },
        {
      icon: <Printer size={32} />,
      title: "Problema com a Impressora",
      description:
        "Verifique se a impressora está ligada, conectada corretamente e se o driver está atualizado.",
    },
    {
      icon: <Lock size={32} />,
      title: "Senha Corporativa Expirada",
      description:
        "Acesse o portal de recuperação de senha e siga os passos para criar uma nova.",
    },
    {
      icon: <ShieldAlert size={32} />,
      title: "Atualização de Sistema",
      description:
        "Confira a nova versão do sistema com aprimoramentos de segurança e desempenho.",
    },
    {
      icon: <Monitor size={32} />,
      title: "Credenciamento Atualizado",
      description:
        "Novos procedimentos foram implementados para facilitar seu credenciamento.",
    },
    {
      icon: <Lock size={32} />,
      title: "Políticas de Segurança Revisadas",
      description:
        "As políticas foram atualizadas para garantir maior segurança em nosso ambiente.",
    }
  ];

  // Estado para armazenar o feedback (like/dislike) para cada artigo
  const [feedback, setFeedback] = React.useState({});

  const handleFeedback = (index, value) => {
    setFeedback((prev) => ({ ...prev, [index]: value }));
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar fixa à esquerda */}
      <UserSidebar />
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Artigos Úteis</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-4 flex flex-col"
            >
              <div className="flex items-center">
                <div className="text-blue-600">{article.icon}</div>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold">{article.title}</h2>
                  <p className="text-gray-600">{article.description}</p>
                </div>
              </div>
              {/* Seção de feedback */}
              <div className="mt-4 flex items-center space-x-2">
                <span className="text-gray-700">Este artigo foi útil?</span>
                <button
                  onClick={() => handleFeedback(index, "like")}
                  className={`p-2 rounded ${
                    feedback[index] === "like"
                      ? "bg-green-200"
                      : "bg-gray-100 hover:bg-green-100"
                  }`}
                >
                  <ThumbsUp size={20} className="text-green-600" />
                </button>
                <button
                  onClick={() => handleFeedback(index, "dislike")}
                  className={`p-2 rounded ${
                    feedback[index] === "dislike"
                      ? "bg-red-200"
                      : "bg-gray-100 hover:bg-red-100"
                  }`}
                >
                  <ThumbsDown size={20} className="text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UsefulArticles;
