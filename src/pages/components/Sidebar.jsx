import { Home, User, Settings, LogOut, Ticket, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { name: "Início", icon: <Home size={18} />, path: "/" },
  { name: "Chat", icon: <User size={18} />, path: "/chat" },
  { name: "Configurações", icon: <Settings size={18} />, path: "/configuracoes" },
  { name: "Base de Conhecimento", icon: <BookOpen size={18} />, path: "/knowledge-base" },
  { name: "Lista de Chamados", icon: <Ticket size={18} />, path: "/tickets" }, // Ícone de ticket
];

export default function Sidebar() {
  const [active, setActive] = useState("Início");

  return (
    <aside className="h-screen w-64 bg-[rgba(33,0,93,255)] text-white shadow-md flex flex-col">
      {/* Logo do HelpLine */}
      <div className="flex items-center justify-center p-3">
        <img src="/images/logo.png" alt="HelpLine Logo" className="w-24 h-auto" />
      </div>

      {/* Navegação */}
      <div className="p-4 flex-grow">
        <nav className="space-y-2 mt-2">
          {navItems.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2 text-white hover:bg-blue-800",
                active === item.name && "bg-blue-700"
              )}
              onClick={() => setActive(item.name)}
            >
              {item.icon}
              {item.name}
            </Button>
          ))}
        </nav>
      </div>

      {/* Botão de sair */}
      <div className="p-4">
        <Button variant="ghost" className="w-full justify-start gap-2 text-white hover:bg-red-600">
          <LogOut size={18} />
          Sair
        </Button>
      </div>
    </aside>
  );
}
