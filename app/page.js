'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export default function Home() {
  // 1. Estados zerados (começa sem nenhuma bolinha)
  const [materias, setMaterias] = useState([]);
  const [leituras, setLeituras] = useState([]);
  const [vinculos, setVinculos] = useState([]);

  // 2. Estados dos campos dos formulários
  const [novaMateria, setNovaMateria] = useState('');
  const [novaLeitura, setNovaLeitura] = useState('');
  
  // Seleção de vinculos
  const [leituraParaConectar, setLeituraParaConectar] = useState('');
  const [materiaParaConectar, setMateriaParaConectar] = useState('');

  // 3. Adicionar Matéria (Bolinha Verde)
  const adicionarMateria = (e) => {
    e.preventDefault();
    if (!novaMateria.trim()) return;
    const nova = {
      id: `m-${Date.now()}`,
      name: novaMateria.trim(),
    };
    setMaterias([...materias, nova]);
    if (!materiaParaConectar) setMateriaParaConectar(nova.id);
    setNovaMateria('');
  };

  // 4. Adicionar Leitura (Bolinha Rosa)
  const adicionarLeitura = (e) => {
    e.preventDefault();
    if (!novaLeitura.trim()) return;
    const nova = {
      id: `p-${Date.now()}`,
      title: novaLeitura.trim(),
    };
    setLeituras([...leituras, nova]);
    if (!leituraParaConectar) setLeituraParaConectar(nova.id);
    setNovaLeitura('');
  };

  // 5. Criar Linha/Vínculo entre Leitura e Matéria
  const criarVinculo = (e) => {
    e.preventDefault();
    if (!leituraParaConectar || !materiaParaConectar) return;

    // Evita criar o mesmo vínculo duas vezes
    const jaExiste = vinculos.some(
      (v) => v.source === leituraParaConectar && v.target === materiaParaConectar
    );

    if (!jaExiste) {
      setVinculos([
        ...vinculos,
        { source: leituraParaConectar, target: materiaParaConectar }
      ]);
    }
  };

  // 6. Montagem dinâmica do Grafo
  const graphData = {
    nodes: [
      ...materias.map((m) => ({ id: m.id, name: `📗 Disciplina: ${m.name}`, group: 'materia', val: 14 })),
      ...leituras.map((l) => ({ id: l.id, name: `🌸 Leitura: ${l.title}`, group: 'leitura', val: 8 })),
    ],
    links: vinculos,
  };

  return (
    <main style={{ padding: '30px', fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#faf5f7', color: '#2d3748', minHeight: '100vh' }}>
      
      {/* Cabeçalho */}
      <header style={{ marginBottom: '25px', borderBottom: '2px solid #fbcfe8', paddingBottom: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '32px' }}>🌸📚🌿</span>
          <h1 style={{ fontSize: '28px', color: '#9d174d', margin: 0 }}>
            Jardim Digital de Conhecimento
          </h1>
        </div>
        <p style={{ color: '#047857', marginTop: '8px', fontWeight: '500' }}>
          Construa a teia do seu curso de Biblioteconomia & Ciência da Informação do zero
        </p>
      </header>

      {/* 📝 Formulários de Cadastro Inicial */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        
        {/* Form 1: Criar Matéria (Verde) */}
        <form onSubmit={adicionarMateria} style={{ backgroundColor: '#ffffff', padding: '18px', borderRadius: '12px', border: '1px solid #a7f3d0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#047857', fontSize: '15px' }}>📗 1. Cadastrar Disciplina</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Ex: Organização do Conhecimento..."
              value={novaMateria}
              onChange={(e) => setNovaMateria(e.target.value)}
              style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
            />
            <button type="submit" style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '10px 14px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              + Adicionar
            </button>
          </div>
        </form>

        {/* Form 2: Criar Leitura (Rosa) */}
        <form onSubmit={adicionarLeitura} style={{ backgroundColor: '#ffffff', padding: '18px', borderRadius: '12px', border: '1px solid #fbcfe8', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#be185d', fontSize: '15px' }}>🌸 2. Cadastrar Leitura / Artigo</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Ex: Artigo sobre Taxonomia..."
              value={novaLeitura}
              onChange={(e) => setNovaLeitura(e.target.value)}
              style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
            />
            <button type="submit" style={{ backgroundColor: '#ec4899', color: 'white', border: 'none', padding: '10px 14px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              + Adicionar
            </button>
          </div>
        </form>

      </section>

      {/* 🔗 Form 3: Criar Vínculo entre Leitura e Matéria */}
      {(materias.length > 0 && leituras.length > 0) && (
        <form onSubmit={criarVinculo} style={{ backgroundColor: '#ffffff', padding: '18px', borderRadius: '12px', border: '2px dashed #f472b6', marginBottom: '25px' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#9d174d', fontSize: '15px' }}>🔗 3. Conectar Leitura a uma Disciplina</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
            
            <select
              value={leituraParaConectar}
              onChange={(e) => setLeituraParaConectar(e.target.value)}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', flex: 1, minWidth: '200px' }}
            >
              {leituras.map((l) => (
                <option key={l.id} value={l.id}>🌸 {l.title}</option>
              ))}
            </select>

            <span style={{ fontWeight: 'bold', color: '#be185d' }}>se conecta com ➔</span>

            <select
              value={materiaParaConectar}
              onChange={(e) => setMateriaParaConectar(e.target.value)}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', flex: 1, minWidth: '200px' }}
            >
              {materias.map((m) => (
                <option key={m.id} value={m.id}>📗 {m.name}</option>
              ))}
            </select>

            <button type="submit" style={{ backgroundColor: '#be185d', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              Conectar no Grafo
            </button>
          </div>
        </form>
      )}

      {/* Legenda dos Nós */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>
        <span style={{ color: '#059669', backgroundColor: '#d1fae5', padding: '4px 12px', borderRadius: '20px', border: '1px solid #a7f3d0' }}>
          📗 Disciplinas ({materias.length})
        </span>
        <span style={{ color: '#be185d', backgroundColor: '#fce7f3', padding: '4px 12px', borderRadius: '20px', border: '1px solid #fbcfe8' }}>
          🌸 Leituras ({leituras.length})
        </span>
        <span style={{ color: '#9d174d', backgroundColor: '#fbcfe8', padding: '4px 12px', borderRadius: '20px' }}>
          🔗 Vínculos ({vinculos.length})
        </span>
      </div>

      {/* Grafo Interativo */}
      <div style={{ height: '480px', border: '2px solid #fbcfe8', borderRadius: '16px', overflow: 'hidden', marginBottom: '40px', boxShadow: '0 10px 25px -5px rgba(244, 114, 182, 0.15)' }}>
        <ForceGraph2D
          graphData={graphData}
          nodeLabel="name"
          nodeColor={(node) => (node.group === 'materia' ? '#10b981' : '#ec4899')}
          linkColor={() => '#f472b6'}
          linkWidth={2.5}
          backgroundColor="#fcf8fa"
        />
      </div>

    </main>
  );
}
