'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export default function Home() {
  // 1. Estado inicial das Matérias e Leituras
  const [materias, setMaterias] = useState([
    { id: 'm1', name: 'Representação Temática da Informação', code: 'RTI' },
    { id: 'm2', name: 'Organização do Conhecimento e Taxonomia', code: 'OCT' },
    { id: 'm3', name: 'Fontes de Informação & Recuperação', code: 'FIR' },
    { id: 'm4', name: 'Gestão de Unidades de Informação & Dados', code: 'GUID' },
  ]);

  const [leituras, setLeituras] = useState([
    { id: 'p1', title: 'Princípios de Classificação Bibliográfica', materiaId: 'm1' },
    { id: 'p2', title: 'Taxonomia Aplicada a Dicionários de Dados', materiaId: 'm2' },
  ]);

  // 2. Estados dos Formulários
  const [novaMateria, setNovaMateria] = useState('');
  const [novaLeitura, setNovaLeitura] = useState('');
  const [materiaSelecionada, setMateriaSelecionada] = useState('m1');

  // 3. Funções para adicionar novas matérias e leituras
  const adicionarMateria = (e) => {
    e.preventDefault();
    if (!novaMateria.trim()) return;
    const nova = {
      id: `m-${Date.now()}`,
      name: novaMateria,
      code: 'DISC'
    };
    setMaterias([...materias, nova]);
    setNovaMateria('');
  };

  const adicionarLeitura = (e) => {
    e.preventDefault();
    if (!novaLeitura.trim()) return;
    const nova = {
      id: `p-${Date.now()}`,
      title: novaLeitura,
      materiaId: materiaSelecionada
    };
    setLeituras([...leituras, nova]);
    setNovaLeitura('');
  };

  // 4. Montagem dinâmica dos dados do Grafo
  const graphData = {
    nodes: [
      ...materias.map((m) => ({ id: m.id, name: `📗 ${m.name}`, group: 'materia', val: 14 })),
      ...leituras.map((l) => ({ id: l.id, name: `🌸 ${l.title}`, group: 'leitura', val: 8 })),
    ],
    links: leituras.map((l) => ({
      source: l.id,
      target: l.materiaId,
    })),
  };

  return (
    <main style={{ padding: '30px', fontFamily: 'system-ui, sans-serif', backgroundColor: '#faf5f7', color: '#2d3748', minHeight: '100vh' }}>
      
      {/* Cabeçalho */}
      <header style={{ marginBottom: '25px', borderBottom: '2px solid #fbcfe8', paddingBottom: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '32px' }}>🌸📚🌿</span>
          <h1 style={{ fontSize: '28px', color: '#9d174d', margin: 0 }}>
            Jardim Digital & Acervo Acadêmico
          </h1>
        </div>
        <p style={{ color: '#047857', marginTop: '8px', fontWeight: '500' }}>
          Cadastre e conecte suas leituras com as matérias do curso de Biblioteconomia & Ciência da Informação
        </p>
      </header>

      {/* 📝 Formulários de Cadastro */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        
        {/* Form 1: Adicionar Matéria */}
        <form onSubmit={adicionarMateria} style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #a7f3d0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#047857', fontSize: '16px' }}>📗 Adicionar Nova Disciplina</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Nome da matéria..."
              value={novaMateria}
              onChange={(e) => setNovaMateria(e.target.value)}
              style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
            />
            <button type="submit" style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              + Criar
            </button>
          </div>
        </form>

        {/* Form 2: Adicionar Leitura / Resumo */}
        <form onSubmit={adicionarLeitura} style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #fbcfe8', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#be185d', fontSize: '16px' }}>🌸 Cadastrar Nova Leitura / Artigo</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="text"
              placeholder="Título da leitura/texto..."
              value={novaLeitura}
              onChange={(e) => setNovaLeitura(e.target.value)}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                value={materiaSelecionada}
                onChange={(e) => setMateriaSelecionada(e.target.value)}
                style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', backgroundColor: '#f8fafc' }}
              >
                {materias.map((m) => (
                  <option key={m.id} value={m.id}>
                    Conectar com: {m.name}
                  </option>
                ))}
              </select>
              <button type="submit" style={{ backgroundColor: '#ec4899', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                + Vínculo
              </button>
            </div>
          </div>
        </form>

      </section>

      {/* Legenda dos Nós */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>
        <span style={{ color: '#059669', backgroundColor: '#d1fae5', padding: '4px 12px', borderRadius: '20px', border: '1px solid #a7f3d0' }}>
          📗 Disciplinas ({materias.length})
        </span>
        <span style={{ color: '#be185d', backgroundColor: '#fce7f3', padding: '4px 12px', borderRadius: '20px', border: '1px solid #fbcfe8' }}>
          🌸 Leituras ({leituras.length})
        </span>
      </div>

      {/* Grafo Interativo */}
      <div style={{ height: '500px', border: '2px solid #fbcfe8', borderRadius: '16px', overflow: 'hidden', marginBottom: '40px', boxShadow: '0 10px 25px -5px rgba(244, 114, 182, 0.15)' }}>
        <ForceGraph2D
          graphData={graphData}
          nodeLabel="name"
          nodeColor={(node) => (node.group === 'materia' ? '#10b981' : '#ec4899')}
          linkColor={() => '#f472b6'}
          linkWidth={2.5}
          backgroundColor="#fcf8fa"
        />
      </div>

      {/* Lista Atualizada de Leituras Registradas */}
      <section style={{ maxWidth: '850px' }}>
        <h2 style={{ fontSize: '20px', color: '#9d174d', borderBottom: '2px solid #a7f3d0', paddingBottom: '8px' }}>
          📋 Leituras e Vínculos Cadastrados
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
          {leituras.map((l) => {
            const mat = materias.find((m) => m.id === l.materiaId);
            return (
              <div key={l.id} style={{ padding: '14px', backgroundColor: '#ffffff', borderRadius: '8px', borderLeft: '4px solid #ec4899', border: '1px solid #fbcfe8', borderLeftWidth: '4px' }}>
                <span style={{ fontSize: '12px', color: '#be185d', fontWeight: 'bold' }}>🌸 Leitura</span>
                <h4 style={{ margin: '4px 0', color: '#1e293b' }}>{l.title}</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#047857' }}>
                  Conectado à matéria: <b>{mat ? mat.name : 'Geral'}</b>
                </p>
              </div>
            );
          })}
        </div>
      </section>

    </main>
  );
}
