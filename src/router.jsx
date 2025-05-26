import { createBrowserRouter } from 'react-router-dom';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { ChatBot } from './pages/ChatBot';
import { KnowledgeBase } from './pages/KnowledgeBase';
import { Register } from './pages/Register';
import TicketList from './pages/Ticketlist';
import UserHelp from './pages/UserHelp';

export const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/home", element: <Home /> },
  { path: "/chat", element: <ChatBot /> },
  { path: "/knowledge-base", element: <KnowledgeBase /> },
  { path: "/register", element: <Register /> },
  { path: "/tickets", element: <TicketList /> },
  {path: "/artigos", element: <UserHelp />},
  { path: "*", element: <Login /> },
]);
