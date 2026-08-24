'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export default function Home() {
  const [materias, setMaterias] = useState([]);
  const [leituras, setLeituras] = useState([]);
  const [vinculos, setVinculos] = useState([]);

  const [formMateria, setFormMateria] = useState({ name: '', code: '' });
  const [formLeitura, setFormLeitura] = useState({ title: '', autor: '', comentario: '' });
  const [formVinculo, setFormVinculo] = useState({ leituraId: '', materiaId: '', comentario: '' });

  const handleAddMateria = (e) => {
    e.preventDefault();
    const nomeLimpo = formMateria.name.trim();
    if (!nomeLimpo) return;

    const jaExiste = materias.some((m) => m.name.toLowerCase() === nomeLimpo.toLowerCase());
    if (jaExiste) {
      alert('Esta disciplina já está cadastrada!');
      return;
    }

    const novaMateria = {
      id: `m-${Date.now()}`,
      name: nomeLimpo,
      code: formMateria.code.trim() || 'DISC',
    };

    setMaterias((prev) => [...prev, novaMateria]);
    setFormMateria({ name: '', code: '' });
  };

  const handleAddLeitura = (e) => {
    e.preventDefault();
    if (!formLeitura.title.trim()) return;

    const novaLeitura = {
      id: `l-${Date.now()}`,
      title: formLeitura.title.trim(),
      autor: formLeitura.autor.trim() || 'Autor não informado',
      comentario: formLeitura.comentario.trim(),
    };

    setLeituras((prev) => [...prev, novaLeitura]);
    setFormLeitura({ title: '', autor: '', comentario: '' });
  };

  const handleAddVinculo = (e) => {
    e.preventDefault();
    if (!formVinculo.leituraId || !formVinculo.materiaId) return;

    const novoVinculo = {
      id: `v-${Date.now()}`,
      source: formVinculo.leituraId,
      target: formVinculo.materiaId,
      comentario: formVinculo.comentario.trim(),
    };

    setVinculos((prev) => [...prev, novoVinculo]);
    setFormVinculo({ leituraId: '', materiaId: '', comentario: '' });
  };

  const materiasDisponiveis = useMemo(() => {
    if (!formVinculo.leituraId) return materias;

    const materiasJaConectadas = vinculos
      .filter((v) => (v.source.id || v.source) === formVinculo.leituraId)
      .map((v) => v.target.id || v.target);

    return materias.filter((m) => !materiasJaConectadas.includes(m.id));
  }, [formVinculo.leituraId, materias, vinculos]);

  const leiturasPorAutor = useMemo(() => {
    const grupos = {};
    leituras.forEach((l) => {
      const autor = l.autor || 'Autor não informado';
      if (!grupos[autor]) grupos[autor] = [];
      grupos[autor].push(l);
    });
    return grupos;
  }, [leituras]);

  const graphData = useMemo(() => {
    const nodes = [
      ...materias.map((m) => ({
        id: m.id,
        name: `📖 Disciplina: ${m.name} (${m.code})`,
        group: 'materia',
        val: 14,
      })),
      ...leituras.map((l) => ({
        id: l.id,
        name: `📚 Leitura: ${l.title}\n✍️ Autor: ${l.autor}`,
        group: 'leitura',
        val: 9,
      })),
    ];

    const links = vinculos.map((v) => ({
      source: v.source,
      target: v.target,
      label: v.comentario || '',
    }));

    return { nodes, links };
  }, [materias, leituras, vinculos]);

  return (
    <main
      style={{
        padding: '30px 20px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: '#838F58',
        backgroundImage: `linear-gradient(rgba(131, 143, 88, 0.88), rgba(131, 143, 88, 0.88)), url('https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1000&auto=format&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: '#F9D1D9',
        minHeight: '100vh',
      }}
    >
      {/* Cabeçalho */}
      <header style={{ marginBottom: '30px', borderBottom: '2px solid #F9D1D9', paddingBottom: '15px' }}>
        <h1 style={{ fontSize: '34px', color: '#F9D1D9', margin: 0, fontWeight: '700', letterSpacing: '-0.5px' }}>
          🌸 Jardim de Leituras 📚
        </h1>
        <p style={{ color: '#ffffff', marginTop: '8px', fontSize: '15px', opacity: 0.95, fontWeight: '500' }}>
          Cadastre suas disciplinas, leituras e organize suas conexões conceituais
        </p>
      </header>

      {/* Formulários de Cadastro */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '25px' }}>
        
        {/* Cadastro de Disciplina */}
        <form style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '2px solid #F9D1D9', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} onSubmit={handleAddMateria}>
          <h3 style={{ margin: '0 0 14px 0', color: '#575527', fontSize: '15px', fontWeight: 'bold' }}>📗 1. Cadastrar Disciplina</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="text"
              placeholder="Nome da disciplina"
              value={formMateria.name}
              onChange={(e) => setFormMateria({ ...formMateria, name: e.target.value })}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #838F58', fontSize: '13px', color: '#333', outline: 'none' }}
            />
            <input
              type="text"
              placeholder="Sigla / Código"
              value={formMateria.code}
              onChange={(e) => setFormMateria({ ...formMateria, code: e.target.value })}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #838F58', fontSize: '13px', color: '#333', outline: 'none' }}
            />
            <button type="submit" style={{ backgroundColor: '#838F58', color: '#ffffff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '4px' }}>
              + Salvar Disciplina
            </button>
          </div>
        </form>

        {/* Cadastro de Leitura */}
        <form style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '2px solid #F9D1D9', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} onSubmit={handleAddLeitura}>
          <h3 style={{ margin: '0 0 14px 0', color: '#838F58', fontSize: '15px', fontWeight: 'bold' }}>📖 2. Cadastrar Leitura</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="text"
              placeholder="Título da leitura ou artigo"
              value={formLeitura.title}
              onChange={(e) => setFormLeitura({ ...formLeitura, title: e.target.value })}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #F9D1D9', fontSize: '13px', color: '#333', outline: 'none' }}
            />
            <input
              type="text"
              placeholder="Autor(es)"
              value={formLeitura.autor}
              onChange={(e) => setFormLeitura({ ...formLeitura, autor: e.target.value })}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #F9D1D9', fontSize: '13px', color: '#333', outline: 'none' }}
            />
            <textarea
              placeholder="Anotações sobre a leitura (opcional)..."
              value={formLeitura.comentario}
              onChange={(e) => setFormLeitura({ ...formLeitura, comentario: e.target.value })}
              rows={2}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #F9D1D9', fontSize: '13px', color: '#333', resize: 'vertical', outline: 'none' }}
            />
            <button type="submit" style={{ backgroundColor: '#F9D1D9', color: '#575527', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              + Salvar Leitura
            </button>
          </div>
        </form>

      </section>

      {/* Conectar Vínculo */}
      {(materias.length > 0 && leituras.length > 0) && (
        <form style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '2px solid #F9D1D9', marginBottom: '25px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} onSubmit={handleAddVinculo}>
          <h3 style={{ margin: '0 0 14px 0', color: '#575527', fontSize: '15px', fontWeight: 'bold' }}>🔗 3. Conectar Leitura à Disciplina</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginBottom: '12px' }}>
            
            <select
              value={formVinculo.leituraId}
              onChange={(e) => setFormVinculo({ ...formVinculo, leituraId: e.target.value, materiaId: '' })}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #F9D1D9', fontSize: '13px', backgroundColor: '#fff', color: '#333', outline: 'none' }}
            >
              <option value="">📚 Selecione a Leitura</option>
              {leituras.map((l) => (
                <option key={l.id} value={l.id}>{l.title} ({l.autor})</option>
              ))}
            </select>

            <select
              value={formVinculo.materiaId}
              onChange={(e) => setFormVinculo({ ...formVinculo, materiaId: e.target.value })}
              disabled={!formVinculo.leituraId || materiasDisponiveis.length === 0}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #838F58', fontSize: '13px', backgroundColor: '#fff', color: '#333', outline: 'none' }}
            >
              <option value="">
                {!formVinculo.leituraId
                  ? '📚 Selecione uma leitura primeiro'
                  : materiasDisponiveis.length === 0
                  ? '⚠️ Conectada a todas as disciplinas'
                  : '📗 Selecione a Disciplina'}
              </option>
              {materiasDisponiveis.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Comentário do vínculo (opcional)"
              value={formVinculo.comentario}
              onChange={(e) => setFormVinculo({ ...formVinculo, comentario: e.target.value })}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #F9D1D9', fontSize: '13px', color: '#333', outline: 'none' }}
            />
          </div>

          <button
            type="submit"
            disabled={!formVinculo.leituraId || !formVinculo.materiaId}
            style={{
              backgroundColor: (!formVinculo.leituraId || !formVinculo.materiaId) ? '#e2e8f0' : '#838F58',
              color: (!formVinculo.leituraId || !formVinculo.materiaId) ? '#94a3b8' : '#ffffff',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: (!formVinculo.leituraId || !formVinculo.materiaId) ? 'not-allowed' : 'pointer',
              width: '100%',
            }}
          >
            Criar Conexão no Grafo
          </button>
        </form>
      )}

      {/* Indicadores */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '15px', fontSize: '13px', fontWeight: 'bold' }}>
        <span style={{ color: '#575527', backgroundColor: '#ffffff', padding: '6px 14px', borderRadius: '20px', border: '1px solid #F9D1D9' }}>
          📗 Disciplinas: {materias.length}
        </span>
        <span style={{ color: '#575527', backgroundColor: '#F9D1D9', padding: '6px 14px', borderRadius: '20px' }}>
          📚 Leituras: {leituras.length}
        </span>
        <span style={{ color: '#ffffff', backgroundColor: '#838F58', padding: '6px 14px', borderRadius: '20px', border: '1px solid #F9D1D9' }}>
          🔗 Conexões: {vinculos.length}
        </span>
      </div>

      {/* Grafo Interativo */}
      <div style={{ height: '480px', border: '3px solid #F9D1D9', borderRadius: '16px', overflow: 'hidden', marginBottom: '35px', backgroundColor: '#ffffff', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
        <ForceGraph2D
          key="grafo-estavel"
          graphData={graphData}
          nodeLabel="name"
          nodeColor={(node) => (node.group === 'materia' ? '#838F58' : '#F9D1D9')}
          linkColor={() => '#F9D1D9'}
          linkWidth={2.5}
          backgroundColor="#ffffff"
        />
      </div>

      {/* Painéis Inferiores */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* Leituras por Autor */}
        <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '2px solid #F9D1D9', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#838F58', fontSize: '16px', borderBottom: '2px solid #F9D1D9', paddingBottom: '8px', fontWeight: 'bold' }}>
            ✍️ Leituras por Autor
          </h3>
          {Object.keys(leiturasPorAutor).length === 0 ? (
            <p style={{ fontSize: '13px', color: '#888' }}>Nenhuma leitura cadastrada ainda.</p>
          ) : (
            Object.entries(leiturasPorAutor).map(([autor, listaObras]) => (
              <div key={autor} style={{ marginBottom: '16px', padding: '12px', borderRadius: '8px', backgroundColor: '#fcf8fa', border: '1px solid #F9D1D9' }}>
                <div style={{ fontWeight: 'bold', color: '#575527', fontSize: '14px', marginBottom: '6px' }}>
                  👤 Autor: {autor}
                </div>
                {listaObras.map((ob) => (
                  <div key={ob.id} style={{ marginLeft: '10px', paddingLeft: '8px', borderLeft: '3px solid #F9D1D9', marginTop: '6px' }}>
                    <div style={{ fontSize: '13px', color: '#333', fontWeight: '600' }}>📚 {ob.title}</div>
                    {ob.comentario && <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#666', fontStyle: 'italic' }}>"{ob.comentario}"</p>}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Lista de Vínculos */}
        <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '2px solid #F9D1D9', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#838F58', fontSize: '16px', borderBottom: '2px solid #F9D1D9', paddingBottom: '8px', fontWeight: 'bold' }}>
            🔗 Conexões Registradas
          </h3>
          {vinculos.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#888' }}>Nenhuma conexão criada ainda.</p>
          ) : (
            vinculos.map((v) => {
              const lei = leituras.find((l) => l.id === (v.source.id || v.source));
              const mat = materias.find((m) => m.id === (v.target.id || v.target));
              return (
                <div key={v.id} style={{ marginBottom: '12px', padding: '10px', borderRadius: '8px', backgroundColor: '#f4f6ef', borderLeft: '4px solid #838F58' }}>
                  <div style={{ fontSize: '13px', color: '#333' }}>
                    <b>📚 {lei?.title || 'Leitura'}</b> &rarr; <b>📗 {mat?.name || 'Disciplina'}</b>
                  </div>
                  {v.comentario && (
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#575527' }}>
                      💬 Nota: {v.comentario}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>

      </section>

    </main>
  );
}
