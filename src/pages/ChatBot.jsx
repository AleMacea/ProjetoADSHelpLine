import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import UserSidebar from './components/UserSidebar';
import problemasDetalhados from './problemas_detalhados.json';
import problemasExtensos from './problemas_extensos.json';

export function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [step, setStep] = useState('list');
  const [input, setInput] = useState('');
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [problemaSelecionado, setProblemaSelecionado] = useState(null);
  const [conversaIniciada, setConversaIniciada] = useState(false);

  const problemasListados = problemasDetalhados.map((item, index) => ({
    numero: index + 1,
    ...item
  }));

  useEffect(() => {
    if (!conversaIniciada) {
      iniciarConversa();
    }
  }, [conversaIniciada]);

  const iniciarConversa = () => {
    setConversaIniciada(true);
    addMessage('bot', 'Olá! Sou seu assistente virtual de TI. Veja abaixo os problemas mais comuns:');
    addMessage(
      'bot',
      problemasListados
        .map((item) => `${item.numero}. [${item.categoria}] ${item.problema}`)
        .join('\n')
    );
    addMessage('bot', 'Digite o número correspondente ao seu problema para começarmos o diagnóstico:');
    setStep('esperando');
    setProblemaSelecionado(null);
    setEtapaAtual(0);
  };

  const addMessage = (role, content) => {
    setMessages((prev) => [...prev, { role, content }]);
  };

  const avancarEtapa = (resposta) => {
    const etapa = problemaSelecionado.etapas[etapaAtual];
    if (!etapa) return;

    if (resposta.toLowerCase() === 'sim') {
      addMessage('bot', etapa.resposta_sim);
      const proximaEtapa = etapaAtual + 1;
      if (proximaEtapa < problemaSelecionado.etapas.length) {
        setEtapaAtual(proximaEtapa);
        setTimeout(() => {
          addMessage('bot', problemaSelecionado.etapas[proximaEtapa].pergunta);
        }, 500);
      } else {
        addMessage('bot', 'Todas as etapas foram concluídas. Se o problema persistir, por favor, abra um chamado.');
        setTimeout(() => setConversaIniciada(false), 2000);
      }
    } else if (
      resposta.toLowerCase() === 'não' ||
      resposta.toLowerCase() === 'nao'
    ) {
      addMessage('bot', etapa.resposta_nao);
    } else {
      addMessage('bot', "Por favor, responda com 'sim' ou 'não'.");
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

  const handleUserInput = () => {
    if (!input.trim()) return;

    const userInput = input.toLowerCase().trim();
    addMessage('user', input);

    const palavrasEncerramento = [
      'deu certo',
      'finalizado',
      'resolvido',
      'consegui'
    ];
    if (palavrasEncerramento.some((p) => userInput.includes(p))) {
      addMessage('bot', 'Fico feliz que o problema tenha sido resolvido! Se precisar de mais ajuda, estou por aqui. 😊');
      setTimeout(() => setConversaIniciada(false), 2000);
      setInput('');
      return;
    }

    const numero = parseInt(input);

    if (step === 'esperando') {
      if (!isNaN(numero) && numero >= 1 && numero <= problemasListados.length) {
        const problema = problemasListados[numero - 1];
        setProblemaSelecionado(problema);
        setEtapaAtual(0);
        addMessage('bot', `Você selecionou: "${problema.problema}". Vamos começar o diagnóstico passo a passo.`);
        addMessage('bot', problema.etapas[0].pergunta);
        setStep('diagnostico');
      } else {
        const encontrado = buscarProblema(input);
        if (encontrado) {
          addMessage('bot', `Solução para "${encontrado.problema}":\n${encontrado.solucao}`);
        } else {
          addMessage('bot', 'Desculpe, não encontrei uma solução para esse problema. Tente reformular ou entre em contato com o suporte.');
        }
        setTimeout(() => setConversaIniciada(false), 2000);
      }
    } else if (step === 'diagnostico' && problemaSelecionado) {
      avancarEtapa(input);
    }

    setInput('');
  };

  return (
    <div className="flex min-h-screen">
      <UserSidebar />
      <div className="flex-1 bg-gray-50 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
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
