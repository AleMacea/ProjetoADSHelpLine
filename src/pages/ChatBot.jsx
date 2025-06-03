import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import UserSidebar from './components/UserSidebar';
import problemasDetalhados from './problemas_detalhados.json';

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

  // A partir do JSON, obtemos uma lista de problemas
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

  // Função para delay (simula tempo de digitação/resposta)
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Função para rolar o chat para a última mensagem
  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Adiciona mensagem do bot com um delay e executa o auto-scroll
  const botReply = async (content, delayTime = 1000) => {
    setIsTyping(true);
    await delay(delayTime);
    if (content && content.trim() !== "") {
      setMessages((prev) => [...prev, { role: 'bot', content }]);
    }
    setIsTyping(false);
    scrollToBottom();
  };

  // Adiciona mensagem (usuário ou bot) e rola para a última mensagem
  const addMessage = (role, content) => {
    setMessages((prev) => [...prev, { role, content }]);
    scrollToBottom();
  };

  // Inicia o chat com mensagens iniciais do bot
  const iniciarConversa = async () => {
    setConversaIniciada(true);
    setMessages([
      { role: 'bot', content: 'Olá! Sou seu assistente virtual de TI.' },
      { role: 'bot', content: problemasListados.map(
          (item) => `${item.numero}. [${item.categoria}] ${item.descricao}`
        ).join('\n') 
      },
      { role: 'bot', content: 'Digite o número correspondente ao seu problema para começarmos o diagnóstico:' }
    ]);
    setContadorNao(0);
    setProtocoloChamado(null);
    setMostrarBotaoAtendente(false);
    setStep('esperando');
  };

  // Abre um chamado e envia mensagens de confirmação
  const abrirChamado = async () => {
    const protocolo = Math.floor(100000 + Math.random() * 900000);
    setProtocoloChamado(protocolo);
    setMostrarBotaoAtendente(false);
    await botReply(`Chamado aberto! Seu número de protocolo é ${protocolo}. Um atendente entrará em contato com você em breve.`, 1000);
    await botReply(`Obrigado por utilizar o assistente virtual de TI. Estou sempre por aqui se precisar! 😊`, 1000);
  };

  // Avança para a próxima etapa com base na resposta "sim" ou "não"
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
        await botReply('Todas as etapas foram concluídas. Se o problema persistir, podemos abrir um chamado.', 1000);
        setMostrarBotaoAtendente(true);
      }
    } else if (
      resposta.toLowerCase() === 'não' ||
      resposta.toLowerCase() === 'nao'
    ) {
      // Incrementa o contador de respostas negativas
      setContadorNao((prev) => prev + 1);
      // Como setContadorNao é assíncrono, usamos (contadorNao + 1) para ver o valor final esperado
      if (contadorNao + 1 >= 2) {
        await botReply('Parece que as tentativas anteriores não resolveram seu problema. Vou abrir um chamado para suporte técnico especializado.', 1000);
        await abrirChamado();
      } else {
        await botReply(etapa.resposta_nao, 1000);
        await delay(500);
        await botReply(etapa.instrucoes, 1000);
        await botReply(etapa.pergunta, 1000);
      }
    } else {
      await botReply("Por favor, responda com 'sim' ou 'não'.", 1000);
    }
  };

  // Processa a resposta digitada pelo usuário
  const handleUserInput = async () => {
    if (!input.trim()) return;

    addMessage('user', input);
    const userInput = input.toLowerCase().trim();

    if (userInput.includes("falar com um atendente")) {
      await abrirChamado();
      setInput('');
      return;
    }

    const numero = parseInt(input);
    if (step === 'esperando') {
      if (!isNaN(numero) && numero >= 1 && numero <= problemasListados.length) {
        const problema = problemasListados[numero - 1];
        setProblemaSelecionado(problema);
        setEtapaAtual(0);
        await botReply(`Você selecionou: "${problema.descricao}". Vamos começar o diagnóstico passo a passo.`, 1000);
        await botReply(problema.etapas[0].instrucoes, 1000);
        await botReply(problema.etapas[0].pergunta, 1000);
        setStep('diagnostico');
      } else {
        await botReply('Desculpe, não encontrei um problema correspondente.', 1000);
      }
    } else if (step === 'diagnostico' && problemaSelecionado) {
      if (
        userInput === 'sim' ||
        userInput === 'não' ||
        userInput === 'nao'
      ) {
        await avancarEtapa(userInput);
      } else {
        await botReply("Por favor, responda com 'sim' ou 'não'.", 1000);
      }
    }

    setInput('');
  };

  // Inicia o chat assim que o componente é montado
  useEffect(() => {
    iniciarConversa();
  }, []);

  return (
    <div className="flex min-h-screen">
      <UserSidebar />
      <div className="flex-1 bg-gray-50 flex flex-col">
        <div
          className="flex-1 overflow-y-auto p-6 space-y-4"
          style={{ maxHeight: '600px', overflowY: 'auto' }}
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
          <div ref={chatEndRef}></div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUserInput();
          }}
          className="p-4 border-t bg-white flex gap-2"
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
  );
}
