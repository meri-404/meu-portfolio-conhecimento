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
      alert('Esta disciplina já está cadastrada.');
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
        name: `Disciplina: ${m.name} (${m.code})`,
        group: 'materia',
        val: 14,
      })),
      ...leituras.map((l) => ({
        id: l.id,
        name: `Leitura: ${l.title}\nAutor: ${l.autor}`,
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
    <main style={{ padding: '30px 20px', fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#DDD3C9', color: '#575527', minHeight: '100vh' }}>
      
      {/* Cabeçalho */}
      <header style={{ marginBottom: '30px', borderBottom: '1px solid #B97D7B', paddingBottom: '15px' }}>
        <h1 style={{ fontSize: '32px', color: '#575527', margin: 0, fontWeight: '600', letterSpacing: '-0.5px' }}>
          Jardim de Leituras
        </h1>
        <p style={{ color: '#575527', marginTop: '8px', fontSize: '15px', opacity: 0.9 }}>
          Cadastre suas disciplinas, leituras e organize suas conexões conceituais
        </p>
      </header>

      {/* Formulários de Cadastro */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '25px' }}>
        
        {/* Cadastro de Disciplina */}
        <form onSubmit={handleAddMateria} style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #ECC4C3', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <h3 style={{ margin: '0 0 14px 0', color: '#575527', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>1. Cadastrar Disciplina</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="text"
              placeholder="Nome da disciplina"
              value={formMateria.name}
              onChange={(e) => setFormMateria({ ...formMateria, name: e.target.value })}
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #DDD3C9', fontSize: '13px', color: '#575527', outline: 'none' }}
            />
            <input
              type="text"
              placeholder="Sigla / Código"
              value={formMateria.code}
              onChange={(e) => setFormMateria({ ...formMateria, code: e.target.value })}
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #DDD3C9', fontSize: '13px', color: '#575527', outline: 'none' }}
            />
            <button type="submit" style={{ backgroundColor: '#928E5E', color: '#ffffff', border: 'none', padding: '10px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginTop: '4px' }}>
              Salvar Disciplina
            </button>
          </div>
        </form>

        {/* Cadastro de Leitura */}
        <form onSubmit={handleAddLeitura} style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #ECC4C3', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <h3 style={{ margin: '0 0 14px 0', color: '#575527', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>2. Cadastrar Leitura</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="text"
              placeholder="Título da leitura ou artigo"
              value={formLeitura.title}
              onChange={(e) => setFormLeitura({ ...formLeitura, title: e.target.value })}
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #DDD3C9', fontSize: '13px', color: '#575527', outline: 'none' }}
            />
            <input
              type="text"
              placeholder="Autor(es)"
              value={formLeitura.autor}
              onChange={(e) => setFormLeitura({ ...formLeitura, autor: e.target.value })}
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #DDD3C9', fontSize: '13px', color: '#575527', outline: 'none' }}
            />
            <textarea
              placeholder="Anotações sobre a leitura (opcional)..."
              value={formLeitura.comentario}
              onChange={(e) => setFormLeitura({ ...formLeitura, comentario: e.target.value })}
              rows={2}
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #DDD3C9', fontSize: '13px', color: '#575527', resize: 'vertical', outline: 'none' }}
            />
            <button type="submit" style={{ backgroundColor: '#B97D7B', color: '#ffffff', border: 'none', padding: '10px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
              Salvar Leitura
            </button>
          </div>
        </form>

      </section>

      {/* Cadastro de Vínculo */}
      {(materias.length > 0 && leituras.length > 0) && (
        <form onSubmit={handleAddVinculo} style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #B97D7B', marginBottom: '25px' }}>
          <h3 style={{ margin: '0 0 14px 0', color: '#575527', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>3. Conectar Leitura à Disciplina</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginBottom: '12px' }}>
            
            <select
              value={formVinculo.leituraId}
              onChange={(e) => setFormVinculo({ ...formVinculo, leituraId: e.target.value, materiaId: '' })}
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #DDD3C9', fontSize: '13px', backgroundColor: '#fff', color: '#575527', outline: 'none' }}
            >
              <option value="">Selecione a Leitura</option>
              {leituras.map((l) => (
                <option key={l.id} value={l.id}>{l.title} ({l.autor})</option>
              ))}
            </select>

            <select
              value={formVinculo.materiaId}
              onChange={(e) => setFormVinculo({ ...formVinculo, materiaId: e.target.value })}
              disabled={!formVinculo.leituraId || materiasDisponiveis.length === 0}
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #DDD3C9', fontSize: '13px', backgroundColor: '#fff', color: '#575527', outline: 'none' }}
            >
              <option value="">
                {!formVinculo.leituraId
                  ? 'Selecione uma leitura primeiro'
                  : materiasDisponiveis.length === 0
                  ? 'Conectada a todas as disciplinas'
                  : 'Selecione a Disciplina'}
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
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #DDD3C9', fontSize: '13px', color: '#575527', outline: 'none' }}
            />
          </div>

          <button
            type="submit"
            disabled={!formVinculo.leituraId || !formVinculo.materiaId}
            style={{
              backgroundColor: (!formVinculo.leituraId || !formVinculo.materiaId) ? '#DDD3C9' : '#575527',
              color: '#ffffff',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '4px',
              fontWeight: 'bold',
              cursor: (!formVinculo.leituraId || !formVinculo.materiaId) ? 'not-allowed' : 'pointer',
              width: '100%',
            }}
          >
            Criar Conexão
          </button>
        </form>
      )}

      {/* Indicadores */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        <span style={{ color: '#575527', backgroundColor: '#ffffff', padding: '6px 14px', borderRadius: '4px', border: '1px solid #ECC4C3' }}>
          Disciplinas: {materias.length}
        </span>
        <span style={{ color: '#575527', backgroundColor: '#ffffff', padding: '6px 14px', borderRadius: '4px', border: '1px solid #ECC4C3' }}>
          Leituras: {leituras.length}
        </span>
        <span style={{ color: '#575527', backgroundColor: '#ffffff', padding: '6px 14px', borderRadius: '4px', border: '1px solid #ECC4C3' }}>
          Conexões: {vinculos.length}
        </span>
      </div>

      {/* Grafo Interativo */}
      <div style={{ height: '480px', border: '1px solid #B97D7B', borderRadius: '8px', overflow: 'hidden', marginBottom: '35px', backgroundColor: '#ffffff' }}>
        <ForceGraph2D
          key="grafo-estavel"
          graphData={graphData}
          nodeLabel="name"
          nodeColor={(node) => (node.group === 'materia' ? '#928E5E' : '#ECC4C3')}
          linkColor={() => '#B97D7B'}
          linkWidth={2}
          backgroundColor="#ffffff"
        />
      </div>

      {/* Painéis Inferiores */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* Leituras por Autor */}
        <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #ECC4C3' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#575527', fontSize: '15px', borderBottom: '1px solid #DDD3C9', paddingBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Leituras por Autor
          </h3>
          {Object.keys(leiturasPorAutor).length === 0 ? (
            <p style={{ fontSize: '13px', color: '#928E5E' }}>Nenhuma leitura cadastrada.</p>
          ) : (
            Object.entries(leiturasPorAutor).map(([autor, listaObras]) => (
              <div key={autor} style={{ marginBottom: '16px', padding: '12px', borderRadius: '4px', backgroundColor: '#DDD3C9', border: '1px solid #ECC4C3' }}>
                <div style={{ fontWeight: 'bold', color: '#575527', fontSize: '13px', marginBottom: '6px' }}>
                  Autor: {autor}
                </div>
                {listaObras.map((ob) => (
                  <div key={ob.id} style={{ marginLeft: '10px', paddingLeft: '8px', borderLeft: '2px solid #B97D7B', marginTop: '6px' }}>
                    <div style={{ fontSize: '13px', color: '#575527' }}>{ob.title}</div>
                    {ob.comentario && <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#575527', opacity: 0.8 }}>"{ob.comentario}"</p>}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Lista de Vínculos */}
        <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #ECC4C3' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#575527', fontSize: '15px', borderBottom: '1px solid #DDD3C9', paddingBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Conexões Registradas
          </h3>
          {vinculos.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#928E5E' }}>Nenhuma conexão criada.</p>
          ) : (
            vinculos.map((v) => {
              const lei = leituras.find((l) => l.id === (v.source.id || v.source));
              const mat = materias.find((m) => m.id === (v.target.id || v.target));
              return (
                <div key={v.id} style={{ marginBottom: '12px', padding: '10px', borderRadius: '4px', backgroundColor: '#DDD3C9', borderLeft: '3px solid #928E5E' }}>
                  <div style={{ fontSize: '13px', color: '#575527' }}>
                    <b>{lei?.title || 'Leitura'}</b> &rarr; <b>{mat?.name || 'Disciplina'}</b>
                  </div>
                  {v.comentario && (
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#575527', opacity: 0.8 }}>
                      Nota: {v.comentario}
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
