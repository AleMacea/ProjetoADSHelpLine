import { MessageSquare, FileText, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Chat", icon: <MessageSquare size={18} />, path: "/chat" },
  { name: "Artigos Úteis", icon: <FileText size={18} />, path: "/artigos" },
];

export default function UserSidebar() {
  const location = useLocation();

  return (
    <aside className="sticky top-0 h-screen w-64 bg-[rgba(33,0,93,255)] text-white shadow-md flex flex-col">
      {/* Logo do HelpLine */}
      <div className="flex items-center justify-center p-3">
        <img src="/images/logo.png" alt="HelpLine Logo" className="w-24 h-auto" />
      </div>

      {/* Navegação */}
      <div className="p-4 flex-grow">
        <nav className="space-y-2 mt-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className="block" // Garante que o link ocupe toda a linha
              >
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-2 text-white hover:bg-blue-800",
                    isActive && "bg-blue-700"
                  )}
                >
                  {item.icon}
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Botão de sair */}
      <div className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-white hover:bg-red-600"
        >
          <LogOut size={18} />
          Sair
        </Button>
      </div>
    </aside>
  );
}
