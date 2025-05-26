import { useState } from 'react';
import { Button } from '@/components/ui/button';
// import { Link } from 'react-scroll';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlignJustify } from 'lucide-react';
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card';
import React from 'react';
import {Input} from '@/components/ui/input';
import Sidebar from './components/Sidebar';


export function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode fazer a requisição para autenticação TESTEEEEEEE
    console.log({ email, password });
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-50">
        <h1 className="text-3xl font-bold mb-4">Página Inicial</h1>
        <p className="text-gray-700">Conteúdo principal aqui...</p>
      </div>
    </div>
  );
}





