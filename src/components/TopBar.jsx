import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const managerLinks = [
  { name: 'Início', path: '/home' },
  { name: 'Base de Conhecimento', path: '/knowledge-base' },
  { name: 'Chamados', path: '/tickets' },
];

const userLinks = [
  { name: 'Início', path: '/home' },
  { name: 'Chat Bot', path: '/chat' },
  { name: 'Artigos Úteis', path: '/artigos' },
  { name: 'Meus Chamados', path: '/tickets' },
];

export default function TopBar() {
  const { user, isManager } = useAuth();
  const location = useLocation();
  const links = isManager ? managerLinks : userLinks;

  return (
    <div className="mt-0 bg-white border-b shadow-sm px-6 py-7 flex justify-end">
       <div className="flex items-center gap-2 text-sm text-slate-600">
        <span className="hidden sm:inline text-slate-500">Olá,</span>
        <span className="font-semibold text-slate-800">
          {user?.name ?? 'Usuário'}
        </span> 
      </div>
    </div>
  );
}
