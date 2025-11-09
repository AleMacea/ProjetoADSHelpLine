import { Home, LogOut, Ticket, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { name: "Início", icon: <Home size={18} />, path: "/home" },
  { name: "Base de Conhecimento", icon: <BookOpen size={18} />, path: "/knowledge-base" },
  { name: "Lista de Chamados", icon: <Ticket size={18} />, path: "/tickets" },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="hidden md:flex sticky top-0 h-screen w-64 bg-[rgba(33,0,93,255)] text-white shadow-md flex-col z-30">
      {/* Logo do HelpLine */}
      <div className="flex items-center justify-center p-3 border-b border-blue-800">
        <img src="/images/logo.png" alt="HelpLine Logo" className="w-24 h-auto" />
      </div>

      {/* Informações do usuário */}
      {user && (
        <div className="px-4 py-3 border-b border-blue-800">
          <p className="text-sm font-semibold">{user.name}</p>
          <p className="text-xs text-blue-200">{user.role === 'manager' ? 'Gerente' : 'Usuário'}</p>
        </div>
      )}

      {/* Navegação */}
      <div className="p-4 flex-grow overflow-y-auto">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.name} 
                to={item.path}
                className="block"
              >
                <Button 
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-2 text-white hover:bg-blue-800 transition-colors",
                    isActive && "bg-blue-700"
                  )}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Botão de sair */}
      <div className="p-4 border-t border-blue-800">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2 text-white hover:bg-red-600 transition-colors"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span>Sair</span>
        </Button>
      </div>
    </aside>
  );
}
