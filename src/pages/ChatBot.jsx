import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import UserSidebar from './components/UserSidebar';
import problemasDetalhados from './problemas_detalhados.json';
import problemasExtensos from './problemas_extensos.json';

export function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState('list');
  const [input, setInput] = useState('');
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [problemaSelecionado, setProblemaSelecionado] = useState(null);
  const [conversaIniciada, setConversaIniciada] = useState(false);

  const problemasListados = problemasDetalhados.map((item, index) => ({
    numero: index + 1,
    ...item
  }));

  // Ref para garantir que a conversa seja iniciada apenas uma vez
  const conversationStartedRef = useRef(false);

  // Função de delay que retorna uma Promise resolvida após ms milissegundos
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Simula que o bot está digitando antes de responder
  const botReply = async (content, delayTime = 1000) => {
    setIsTyping(true);
    await delay(delayTime);
    if (content && content.trim() !== '') {
      setMessages((prev) => [...prev, { role: 'bot', content }]);
    }
    setIsTyping(false);
  };

  // Adiciona mensagem imediata (por exemplo, do usuário)
  const addMessage = (role, content) => {
    setMessages((prev) => [...prev, { role, content }]);
  };

  // Inicia a conversa exibindo as mensagens iniciais em sequência
  const iniciarConversa = async () => {
    setConversaIniciada(true);
    setMessages([]);
    const initialMessages = [
      'Olá! Sou seu assistente virtual de TI.',
      problemasListados
        .map((item) => `${item.numero}. [${item.categoria}] ${item.problema}`)
        .join('\n'),
      'Digite o número correspondente ao seu problema para começarmos o diagnóstico:'
    ];

    for (const msg of initialMessages) {
      await botReply(msg, 1000);
    }
    setStep('esperando');
    setProblemaSelecionado(null);
    setEtapaAtual(0);
  };

  // Avança para a próxima etapa do diagnóstico.
  // Agora, imprime SEMPRE as instruções e depois a pergunta.
  const avancarEtapa = async (resposta) => {
    const etapa = problemaSelecionado.etapas[etapaAtual];
    if (!etapa) return;

    if (resposta.toLowerCase() === 'sim') {
      await botReply(etapa.resposta_sim, 1000);
      const proximaEtapa = etapaAtual + 1;
      if (proximaEtapa < problemaSelecionado.etapas.length) {
        setEtapaAtual(proximaEtapa);
        await delay(500);
        // Log para debugar
        console.log("Avançando para nova etapa. Instrucoes:", problemaSelecionado.etapas[proximaEtapa].instrucoes);
        // Envia sempre as instruções (mesmo que em branco, para teste)
        await botReply(problemaSelecionado.etapas[proximaEtapa].instrucoes, 1000);
        await botReply(problemaSelecionado.etapas[proximaEtapa].pergunta, 1000);
      } else {
        await botReply(
          'Todas as etapas foram concluídas. Se o problema persistir, por favor, abra um chamado.',
          1000
        );
        setTimeout(() => {
          setConversaIniciada(false);
          setMessages([]);
        }, 2000);
      }
    } else if (resposta.toLowerCase() === 'não' || resposta.toLowerCase() === 'nao') {
      await botReply(etapa.resposta_nao, 1000);
      await delay(500);
      // Log para debugar
      console.log("Repetindo instrucoes para a mesma etapa. Instrucoes:", etapa.instrucoes);
      await botReply(etapa.instrucoes, 1000);
      await botReply(etapa.pergunta, 1000);
    } else {
      await botReply("Por favor, responda com 'sim' ou 'não'.", 1000);
    }
  };

  const buscarProblema = (texto) => {
    const textoLower = texto.toLowerCase();
    const encontradoDetalhado = problemasListados.find((item) =>
      textoLower.includes(item.problema.toLowerCase())
    );
    if (encontradoDetalhado) return encontradoDetalhado;
    const encontradoExtenso = problemasExtensos.find((item) =>
      textoLower.includes(item.problema.toLowerCase())
    );
    if (encontradoExtenso) return encontradoExtenso;
    return null;
  };

  // Processa a entrada do usuário e gerencia o fluxo da conversa
  const handleUserInput = async () => {
    if (!input.trim()) return;

    addMessage('user', input);
    const userInput = input.toLowerCase().trim();

    const palavrasEncerramento = ['deu certo', 'finalizado', 'resolvido', 'consegui'];
    if (palavrasEncerramento.some((p) => userInput.includes(p))) {
      await botReply(
        'Fico feliz que o problema tenha sido resolvido! Se precisar de mais ajuda, estou por aqui. 😊',
        1000
      );
      setTimeout(() => {
        setConversaIniciada(false);
        setMessages([]);
      }, 2000);
      setInput('');
      return;
    }

    const numero = parseInt(input);
    if (step === 'esperando') {
      if (!isNaN(numero) && numero >= 1 && numero <= problemasListados.length) {
        const problema = problemasListados[numero - 1];
        setProblemaSelecionado(problema);
        setEtapaAtual(0);
        await botReply(
          `Você selecionou: "${problema.problema}". Vamos começar o diagnóstico passo a passo. Por favor, responda as próximas perguntas com SIM ou NÃO e caso consiga resolver o problema me avise, COMBINADO ?`,
          1000
        );
        // Exibe as instruções da primeira etapa (sempre) e depois a pergunta
        console.log("Instrucoes da primeira etapa:", problema.etapas[0].instrucoes);
        await botReply(problema.etapas[0].instrucoes, 1000);
        await botReply(problema.etapas[0].pergunta, 1000);
        setStep('diagnostico');
      } else {
        const encontrado = buscarProblema(input);
        if (encontrado) {
          await botReply(
            `Solução para "${encontrado.problema}":\n${encontrado.solucao}`,
            1000
          );
        } else {
          await botReply(
            'Desculpe, não encontrei uma solução para esse problema. Tente reformular ou entre em contato com o suporte.',
            1000
          );
        }
        setTimeout(() => {
          setConversaIniciada(false);
          setMessages([]);
        }, 2000);
      }
    } else if (step === 'diagnostico' && problemaSelecionado) {
      await avancarEtapa(input);
    }
    setInput('');
  };

  // Inicia a conversa apenas uma vez quando o componente é montado
  useEffect(() => {
    if (!conversationStartedRef.current) {
      conversationStartedRef.current = true;
      iniciarConversa();
    }
  }, []);

  return (
    <div className="flex min-h-screen">
      <UserSidebar />
      <div className="flex-1 bg-gray-50 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-xl px-4 py-2 rounded-xl whitespace-pre-wrap ${
                msg.role === 'user' ? 'ml-auto bg-blue-500 text-white' : 'mr-auto bg-gray-200 text-black'
              }`}
            >
              {msg.content}
            </div>
          ))}
          {isTyping && (
            <div className="max-w-xl px-4 py-2 rounded-xl whitespace-pre-wrap mr-auto bg-gray-200 text-black">
              <i>Digitando...</i>
            </div>
          )}
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await handleUserInput();
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
