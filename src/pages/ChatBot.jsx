import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import UserSidebar from "./components/UserSidebar";

const categories = {
  "Hardware": { icon: "🖥️", issues: ["Computador lento", "Monitor não liga", "Teclado não funciona"] },
  "Conectividade": { icon: "🌐", issues: ["Sem internet", "Wi-Fi desconectando", "VPN não acessível"] },
  "Acesso e Login": { icon: "🔐", issues: ["Esqueci a senha", "Conta bloqueada", "Erro de autenticação"] },
  "Softwares e Sistemas": { icon: "🛠️", issues: ["Programa travando", "Erro na instalação", "E-mail corporativo"] },
  "Arquivos e Documentos": { icon: "📁", issues: ["Arquivo corrompido", "Perda de dados", "Erro de permissão"] },
  "Áudio e Vídeo": { icon: "🔊", issues: ["Microfone não funciona", "Problemas em reunião"] },
  "Segurança": { icon: "⚠️", issues: ["Notificação de vírus", "Tentativa de phishing", "Antivírus inativo"] },
  "Chamados Administrativos": { icon: "🧾", issues: ["Solicitação de equipamento", "Criação de e-mail", "Acesso a sistemas"] },
};

export function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentCategory, setCurrentCategory] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  const addMessage = (role, content) => {
    setMessages(prev => [...prev, { role, content }]);
  };

  const simulateTyping = async (text) => {
    setIsTyping(true);
    let tempMessage = "";

    addMessage("bot", "");
    const messageIndex = messages.length;

    for (let i = 0; i < text.length; i++) {
      tempMessage += text[i];
      setMessages(prev => [
        ...prev.slice(0, messageIndex),
        { role: "bot", content: tempMessage },
        ...prev.slice(messageIndex + 1)
      ]);
      await new Promise(resolve => setTimeout(resolve, 30));
    }

    setIsTyping(false);
  };

  useEffect(() => {
    const startConversation = async () => {
      if (messages.length > 0) return;

      await simulateTyping("Olá! Como posso te ajudar hoje?");
      await new Promise(resolve => setTimeout(resolve, 1000));
      await simulateTyping("Escolha uma das opções abaixo:");

      // Adiciona a lista de categorias apenas UMA VEZ
      addMessage("bot",
        <div className="space-y-2">
          {Object.keys(categories).map((category, index) => (
            <div key={category}>
              {index + 1}. {categories[category].icon} <strong>{category}</strong>
            </div>
          ))}
        </div>
      );
    };

    startConversation();
  }, []); // Empty dependency array ensures this runs only once

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    addMessage("user", userMessage);

    let botResponse = "Desculpe, não entendi. Selecione um número válido.";
    const categoryKeys = Object.keys(categories);
    const selectedIndex = parseInt(userMessage) - 1;

    if (!currentCategory && selectedIndex >= 0 && selectedIndex < categoryKeys.length) {
      const selectedCategory = categoryKeys[selectedIndex];
      setCurrentCategory(selectedCategory);

      botResponse = `Você escolheu ${categories[selectedCategory].icon} ${selectedCategory}.\n` +
        categories[selectedCategory].issues.map((issue, index) => `${index + 1}. ${issue}`).join("\n") +
        "\nDigite o número do problema para obter uma solução.";
    }
    else if (currentCategory && selectedIndex >= 0 && selectedIndex < categories[currentCategory].issues.length) {
      const selectedProblem = categories[currentCategory].issues[selectedIndex];
      botResponse = `Solução para "${selectedProblem}":\n${solutions[selectedProblem] || "Solução não disponível no momento."}`;
      setCurrentCategory(null);
    }

    await simulateTyping(botResponse);
  };

  return (
    <div className="flex min-h-screen">
      <UserSidebar />

      <div className="flex-1 bg-gray-50 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-xl px-4 py-2 rounded-xl ${msg.role === "user"
                ? "ml-auto bg-blue-500 text-white"
                : "mr-auto bg-gray-200 text-black"
                }`}
            >
              {msg.content}
            </div>
          ))}

          {isTyping && (
            <div className="max-w-xl px-4 py-2 rounded-xl mr-auto bg-gray-200 text-black">
              {messages[messages.length - 1]?.content || ""}
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 border-t bg-white flex gap-2"
        >
          <Input
            placeholder="Escolha uma opção..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">
            <Send size={16} className="mr-1" />
            Enviar
          </Button>
        </form>
      </div>
    </div>
  );
}