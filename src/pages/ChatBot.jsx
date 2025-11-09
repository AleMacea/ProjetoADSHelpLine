import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import UserSidebar from './components/UserSidebar';
import TopBar from '@/components/TopBar';
import { MobileMenu } from '@/components/MobileMenu';
import problemasDetalhados from './problemas_detalhados.json';
import { ticketsAPI } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

// Componente para exibir o indicador de digitação
const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-1">
      <span className="animate-bounce delay-0">.</span>
      <span className="animate-bounce delay-100">.</span>
      <span className="animate-bounce delay-200">.</span>
    </div>
  );
};

export function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState('list');
  const [input, setInput] = useState('');
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [problemaSelecionado, setProblemaSelecionado] = useState(null);
  const [conversaIniciada, setConversaIniciada] = useState(false);
  const [contadorNao, setContadorNao] = useState(0);
  const [mostrarBotaoAtendente, setMostrarBotaoAtendente] = useState(false);
  const [protocoloChamado, setProtocoloChamado] = useState(null);
  const chatEndRef = useRef(null);
  const conversationStarted = useRef(false); // Evita duplicação das mensagens iniciais
  const { user } = useAuth();

  // Definição dos ícones para cada categoria
  const categoriaIcons = {
    Hardware: '💻',
    Rede: '🌐',
    Software: '💾',
    Geral: '⚙️'
  };

  // Monta a lista de problemas a partir do JSON
  let contador = 1;
  const problemasListados = Array.isArray(problemasDetalhados)
    ? problemasDetalhados.flatMap((categoria) =>
        categoria.problemas.map((problema) => ({
          numero: contador++,
          categoria: categoria.categoria,
          descricao: problema.descricao,
          etapas: problema.etapas,
        }))
      )
    : [];

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Envia mensagem do bot com delay e atualiza o indicador de digitação
  const botReply = async (content, delayTime = 1000) => {
    setIsTyping(true);
    await delay(delayTime);
    if (content && content.trim() !== "") {
      setMessages((prev) => [...prev, { role: 'bot', content }]);
    }
    setIsTyping(false);
    scrollToBottom();
  };

  const addMessage = (role, content) => {
    setMessages((prev) => [...prev, { role, content }]);
    scrollToBottom();
  };

  // Inicia a conversa com as mensagens iniciais e inclui ícones
  const iniciarConversa = async () => {
    setConversaIniciada(true);
    // Saudação com ícone
    await botReply("🤖 Olá! Sou seu assistente virtual de TI.", 1000);
    // Monta o menu de problemas com ícones
    const menuList = problemasListados
      .map((item) => {
        const icon = categoriaIcons[item.categoria] || '';
        return `${item.numero}. [${icon} ${item.categoria}] ${item.descricao}`;
      })
      .join('\n');
    await botReply(menuList, 1000);
    await botReply("Digite o número correspondente ao seu problema para começarmos o diagnóstico:", 1000);

    setContadorNao(0);
    setProtocoloChamado(null);
    setMostrarBotaoAtendente(false);
    setStep('esperando');
  };

  const abrirChamado = async () => {
    try {
      setMostrarBotaoAtendente(false);
      
      // Determinar categoria e título baseado no problema selecionado
      const categoria = problemaSelecionado?.categoria || 'Geral';
      const titulo = problemaSelecionado?.descricao || 'Problema técnico';
      const descricao = `Chamado aberto através do chatbot.\nProblema: ${titulo}\nCategoria: ${categoria}`;

      // Criar ticket através da API
      const ticket = await ticketsAPI.create({
        title: titulo,
        description: descricao,
        category: categoria,
        priority: 'medium'
      });

      setProtocoloChamado(ticket.protocol);
      await botReply(`Chamado aberto com sucesso! Seu número de protocolo é ${ticket.protocol}. Um atendente entrará em contato com você em breve.`, 1000);
      await botReply("Obrigado por utilizar o assistente virtual de TI. Estou sempre por aqui se precisar! 😊", 1000);
    } catch (error) {
      console.error('Erro ao criar ticket:', error);
      await botReply("Desculpe, ocorreu um erro ao abrir o chamado. Por favor, tente novamente mais tarde ou entre em contato diretamente com o suporte.", 1000);
    }
  };

  const avancarEtapa = async (resposta) => {
    if (!problemaSelecionado || !problemaSelecionado.etapas) return;

    const etapa = problemaSelecionado.etapas[etapaAtual];
    if (!etapa) return;

    if (resposta.toLowerCase() === 'sim') {
      await botReply(etapa.resposta_sim, 1000);
      setContadorNao(0);
      const proximaEtapa = etapaAtual + 1;
      if (proximaEtapa < problemaSelecionado.etapas.length) {
        setEtapaAtual(proximaEtapa);
        await delay(500);
        await botReply(problemaSelecionado.etapas[proximaEtapa].instrucoes, 1000);
        await botReply(problemaSelecionado.etapas[proximaEtapa].pergunta, 1000);
      } else {
        await botReply("Todas as etapas foram concluídas. Se o problema persistir, podemos abrir um chamado.", 1000);
        setMostrarBotaoAtendente(true);
      }
    } else if (
      resposta.toLowerCase() === 'não' ||
      resposta.toLowerCase() === 'nao'
    ) {
      setContadorNao((prev) => prev + 1);
      if (contadorNao + 1 >= 2) {
        await botReply("Parece que as tentativas anteriores não resolveram seu problema. Vou abrir um chamado para suporte técnico especializado.", 1000);
        await abrirChamado();
      } else {
        await botReply(etapa.resposta_nao, 1000);
        await delay(500);
        await botReply(etapa.instrucoes, 1000);
        await botReply(etapa.pergunta, 1000);
      }
    } else {
      await botReply("Por favor, responda com SIM ✅ ou NÃO ❌.", 1000);
    }
  };

  // Processa a mensagem do usuário, limpa o input imediatamente e direciona o fluxo
  const handleUserInput = async () => {
    if (!input.trim()) return;
    
    const userText = input;
    addMessage('user', userText);
    setInput(''); // Limpeza imediata do campo de texto
    
    const userInput = userText.toLowerCase().trim();
    
    if (userInput.includes("falar com um atendente")) {
      await abrirChamado();
      return;
    }
    
    const numero = parseInt(userText);
    if (step === 'esperando') {
      if (!isNaN(numero) && numero >= 1 && numero <= problemasListados.length) {
        const problema = problemasListados[numero - 1];
        setProblemaSelecionado(problema);
        setEtapaAtual(0);
        await botReply(
          `Você selecionou: "${problema.descricao}". Vamos começar o diagnóstico passo a passo. Por favor, responda as etapas com SIM ✅ ou NÃO ❌.`,
          1000
        );
        await botReply(problema.etapas[0].instrucoes, 1000);
        await botReply(problema.etapas[0].pergunta, 1000);
        setStep('diagnostico');
      } else {
        await botReply("Desculpe, não encontrei um problema correspondente.", 1000);
      }
    } else if (step === 'diagnostico' && problemaSelecionado) {
      if (
        userInput === 'sim' ||
        userInput === 'não' ||
        userInput === 'nao'
      ) {
        await avancarEtapa(userInput);
      } else {
        await botReply("Por favor, responda com SIM ✅ ou NÃO ❌.", 1000);
      }
    }
  };

  // useEffect com flag para iniciar a conversa apenas uma vez
  useEffect(() => {
    if (!conversationStarted.current) {
      conversationStarted.current = true;
      iniciarConversa();
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <MobileMenu isManager={false} />
      <UserSidebar />
      <div className="flex-1 flex flex-col bg-gray-50">
        <TopBar />
        <div className="flex-1 p-4 md:p-6">
          <div className="bg-white border border-[#D9D9D9] rounded-lg shadow-sm">
            <div className="bg-[#D9D9D9] text-slate-900 px-4 md:px-6 py-3 rounded-t-lg">
              <h1 className="text-2xl font-bold">Chat Bot de Suporte</h1>
            </div>
            <div className="p-4 md:p-6 flex flex-col gap-4">
              <div
                className="flex-1 overflow-y-auto space-y-4"
                style={{ maxHeight: '500px', overflowY: 'auto' }}
              >
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`max-w-xl px-4 py-2 rounded-xl whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'ml-auto bg-blue-500 text-white'
                        : 'mr-auto bg-gray-200 text-black'
                    }`}
                  >
                    {msg.content}
                  </div>
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={chatEndRef}></div>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUserInput();
                }}
                className="bg-white border border-[#D9D9D9] rounded-lg p-4 flex gap-2"
              >
                <Input
                  placeholder="Digite sua resposta..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit">Enviar</Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
