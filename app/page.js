'use client';

import { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export default function Home() {
  const [materias, setMaterias] = useState([]);
  const [leituras, setLeituras] = useState([]);
  const [vinculos, setVinculos] = useState([]);
  const [carregado, setCarregado] = useState(false);

  const [formMateria, setFormMateria] = useState({ name: '', code: '' });
  const [formLeitura, setFormLeitura] = useState({ title: '', autorSelect: '', autorNovo: '', comentario: '' });
  const [formVinculo, setFormVinculo] = useState({ leituraId: '', materiaId: '', comentario: '' });

  // Carregar dados salvos no localStorage
  useEffect(() => {
    const matSalvas = localStorage.getItem('jardim_materias');
    const leiSalvas = localStorage.getItem('jardim_leituras');
    const vinSalvos = localStorage.getItem('jardim_vinculos');

    if (matSalvas) setMaterias(JSON.parse(matSalvas));
    if (leiSalvas) setLeituras(JSON.parse(leiSalvas));
    if (vinSalvos) setVinculos(JSON.parse(vinSalvos));

    setCarregado(true);
  }, []);

  // Salvar no localStorage sempre que houver mudanças
  useEffect(() => {
    if (carregado) {
      localStorage.setItem('jardim_materias', JSON.stringify(materias));
      localStorage.setItem('jardim_leituras', JSON.stringify(leituras));
      localStorage.setItem('jardim_vinculos', JSON.stringify(vinculos));
    }
  }, [materias, leituras, vinculos, carregado]);

  // Lista única de autores cadastrados
  const autoresCadastrados = useMemo(() => {
    const lista = leituras
      .map((l) => l.autor)
      .filter((a) => a && a !== 'Autor não informado');
    return Array.from(new Set(lista)).sort();
  }, [leituras]);

  const handleAddMateria = (e) => {
    e.preventDefault();
    const nomeLimpo = formMateria.name.trim();
    if (!nomeLimpo) return;

    if (materias.some((m) => m.name.toLowerCase() === nomeLimpo.toLowerCase())) {
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

    let autorFinal = 'Autor não informado';
    if (formLeitura.autorSelect === '__NOVO__') {
      autorFinal = formLeitura.autorNovo.trim() || 'Autor não informado';
    } else if (formLeitura.autorSelect) {
      autorFinal = formLeitura.autorSelect;
    }

    const novaLeitura = {
      id: `l-${Date.now()}`,
      title: formLeitura.title.trim(),
      autor: autorFinal,
      comentario: formLeitura.comentario.trim(),
    };

    setLeituras((prev) => [...prev, novaLeitura]);
    setFormLeitura({ title: '', autorSelect: '', autorNovo: '', comentario: '' });
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

  // Funções de Exclusão
  const handleDeleteMateria = (id) => {
    if (confirm('Tem certeza que deseja excluir esta disciplina? As conexões associadas também serão removidas.')) {
      setMaterias((prev) => prev.filter((m) => m.id !== id));
      setVinculos((prev) => prev.filter((v) => (v.target.id || v.target) !== id));
    }
  };

  const handleDeleteLeitura = (id) => {
    if (confirm('Tem certeza que deseja excluir esta leitura? As conexões associadas também serão removidas.')) {
      setLeituras((prev) => prev.filter((l) => l.id !== id));
      setVinculos((prev) => prev.filter((v) => (v.source.id || v.source) !== id));
    }
  };

  const handleDeleteVinculo = (id) => {
    setVinculos((prev) => prev.filter((v) => v.id !== id));
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
        name: `${m.name} (${m.code})`,
        group: 'materia',
      })),
      ...leituras.map((l) => ({
        id: l.id,
        name: `${l.title}\n${l.autor}`,
        group: 'leitura',
      })),
    ];

    const links = vinculos.map((v) => ({
      source: v.source,
      target: v.target,
      label: v.comentario || '',
    }));

    return { nodes, links };
  }, [materias, leituras, vinculos]);

  // Função para desenhar as flores rosas e brancas com miolo amarelo
  const drawFlowerNode = (node, ctx, globalScale) => {
    const x = node.x;
    const y = node.y;
    const isMateria = node.group === 'materia';

    // Matéria = flor branca | Leitura = flor rosa
    const petalColor = isMateria ? '#ffffff' : '#f4a6bc';
    const centerColor = '#fcd34d'; // Amarelo vibrante/suave
    const numPetals = 5;
    const petalDistance = 6;
    const petalRadius = 4.5;

    // Pétalas
    ctx.fillStyle = petalColor;
    for (let i = 0; i < numPetals; i++) {
      const angle = (i * 2 * Math.PI) / numPetals;
      const px = x + petalDistance * Math.cos(angle);
      const py = y + petalDistance * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(px, py, petalRadius, 0, 2 * Math.PI, false);
      ctx.fill();
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = '#d1d5db';
      ctx.stroke();
    }

    // Miolo Amarelo
    ctx.beginPath();
    ctx.arc(x, y, 4.5, 0, 2 * Math.PI, false);
    ctx.fillStyle = centerColor;
    ctx.fill();
    ctx.lineWidth = 0.8;
    ctx.strokeStyle = '#f59e0b';
    ctx.stroke();

    // Rótulo/Texto do nó
    const fontSize = 11 / globalScale;
    ctx.font = `${fontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#2d4a3e';
    ctx.fillText(node.name.split('\n')[0], x, y + 10);
  };

  return (
    <main
      style={{
        padding: '30px 20px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: '#eaf3ed', // Verde bem claro
        color: '#2d4a3e',
        minHeight: '100vh',
      }}
    >
      {/* Cabeçalho */}
      <header style={{ marginBottom: '30px', borderBottom: '2px solid #b2d8c3', paddingBottom: '15px' }}>
        <h1 style={{ fontSize: '34px', color: '#2d4a3e', margin: 0, fontWeight: '700', letterSpacing: '-0.5px' }}>
          🌸 Jardim de Leituras 📚
        </h1>
        <p style={{ color: '#4a7c59', marginTop: '8px', fontSize: '15px', fontWeight: '500' }}>
          Cadastre suas disciplinas, leituras e organize suas conexões conceituais
        </p>
      </header>

      {/* Formulários de Cadastro */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '25px' }}>
        
        {/* Cadastro de Disciplina */}
        <form style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }} onSubmit={handleAddMateria}>
          <h3 style={{ margin: '0 0 14px 0', color: '#4a7c59', fontSize: '15px', fontWeight: 'bold' }}>📗 1. Cadastrar Disciplina</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="text"
              placeholder="Nome da disciplina"
              value={formMateria.name}
              onChange={(e) => setFormMateria({ ...formMateria, name: e.target.value })}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #b2d8c3', fontSize: '13px', color: '#333', outline: 'none' }}
            />
            <input
              type="text"
              placeholder="Sigla / Código"
              value={formMateria.code}
              onChange={(e) => setFormMateria({ ...formMateria, code: e.target.value })}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #b2d8c3', fontSize: '13px', color: '#333', outline: 'none' }}
            />
            <button type="submit" style={{ backgroundColor: '#4a7c59', color: '#ffffff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '4px' }}>
              + Salvar Disciplina
            </button>
          </div>
        </form>

        {/* Cadastro de Leitura */}
        <form style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }} onSubmit={handleAddLeitura}>
          <h3 style={{ margin: '0 0 14px 0', color: '#d97792', fontSize: '15px', fontWeight: 'bold' }}>📖 2. Cadastrar Leitura</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="text"
              placeholder="Título da leitura ou artigo"
              value={formLeitura.title}
              onChange={(e) => setFormLeitura({ ...formLeitura, title: e.target.value })}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #f4a6bc', fontSize: '13px', color: '#333', outline: 'none' }}
            />

            {/* Select Box de Autores */}
            <select
              value={formLeitura.autorSelect}
              onChange={(e) => setFormLeitura({ ...formLeitura, autorSelect: e.target.value })}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #f4a6bc', fontSize: '13px', backgroundColor: '#fff', color: '#333', outline: 'none' }}
            >
              <option value="">👤 Selecione um Autor (opcional)</option>
              {autoresCadastrados.map((autor) => (
                <option key={autor} value={autor}>
                  {autor}
                </option>
              ))}
              <option value="__NOVO__">➕ Outro autor / Digitar novo...</option>
            </select>

            {/* Campo para novo autor se selecionar "__NOVO__" ou se não houver autores salvos */}
            {(formLeitura.autorSelect === '__NOVO__' || autoresCadastrados.length === 0) && (
              <input
                type="text"
                placeholder="Nome do novo autor"
                value={formLeitura.autorNovo}
                onChange={(e) => setFormLeitura({ ...formLeitura, autorNovo: e.target.value })}
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #f4a6bc', fontSize: '13px', color: '#333', outline: 'none' }}
              />
            )}

            <textarea
              placeholder="Anotações sobre a leitura (opcional)..."
              value={formLeitura.comentario}
              onChange={(e) => setFormLeitura({ ...formLeitura, comentario: e.target.value })}
              rows={2}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #f4a6bc', fontSize: '13px', color: '#333', resize: 'vertical', outline: 'none' }}
            />
            <button type="submit" style={{ backgroundColor: '#f4a6bc', color: '#2d4a3e', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              + Salvar Leitura
            </button>
          </div>
        </form>

      </section>

      {/* Conectar Vínculo */}
      {(materias.length > 0 && leituras.length > 0) && (
        <form style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', marginBottom: '25px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }} onSubmit={handleAddVinculo}>
          <h3 style={{ margin: '0 0 14px 0', color: '#2d4a3e', fontSize: '15px', fontWeight: 'bold' }}>🔗 3. Conectar Leitura à Disciplina</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginBottom: '12px' }}>
            
            <select
              value={formVinculo.leituraId}
              onChange={(e) => setFormVinculo({ ...formVinculo, leituraId: e.target.value, materiaId: '' })}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #f4a6bc', fontSize: '13px', backgroundColor: '#fff', color: '#333', outline: 'none' }}
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
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #b2d8c3', fontSize: '13px', backgroundColor: '#fff', color: '#333', outline: 'none' }}
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
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #b2d8c3', fontSize: '13px', color: '#333', outline: 'none' }}
            />
          </div>

          <button
            type="submit"
            disabled={!formVinculo.leituraId || !formVinculo.materiaId}
            style={{
              backgroundColor: (!formVinculo.leituraId || !formVinculo.materiaId) ? '#e2e8f0' : '#4a7c59',
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
        <span style={{ color: '#2d4a3e', backgroundColor: '#ffffff', padding: '6px 14px', borderRadius: '20px' }}>
          📗 Disciplinas: {materias.length}
        </span>
        <span style={{ color: '#2d4a3e', backgroundColor: '#f4a6bc', padding: '6px 14px', borderRadius: '20px' }}>
          📚 Leituras: {leituras.length}
        </span>
        <span style={{ color: '#ffffff', backgroundColor: '#4a7c59', padding: '6px 14px', borderRadius: '20px' }}>
          🔗 Conexões: {vinculos.length}
        </span>
      </div>

      {/* Grafo Interativo com Flores */}
      <div style={{ height: '480px', borderRadius: '16px', overflow: 'hidden', marginBottom: '35px', backgroundColor: '#ffffff', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
        <ForceGraph2D
          key="grafo-estavel"
          graphData={graphData}
          nodeCanvasObject={drawFlowerNode}
          linkColor={() => '#4a7c59'}
          linkWidth={2}
          backgroundColor="#ffffff"
        />
      </div>

      {/* Painéis Inferiores */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* Lista de Disciplinas (com opção de exclusão) */}
        <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#4a7c59', fontSize: '16px', borderBottom: '2px solid #b2d8c3', paddingBottom: '8px', fontWeight: 'bold' }}>
            📗 Disciplinas
          </h3>
          {materias.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#888' }}>Nenhuma disciplina cadastrada.</p>
          ) : (
            materias.map((m) => (
              <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', padding: '8px 12px', backgroundColor: '#f4f9f5', borderRadius: '6px', border: '1px solid #b2d8c3' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#2d4a3e' }}>
                  {m.name} ({m.code})
                </span>
                <button
                  onClick={() => handleDeleteMateria(m.id)}
                  style={{ backgroundColor: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}
                  title="Excluir disciplina"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Leituras por Autor (com opção de exclusão) */}
        <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#d97792', fontSize: '16px', borderBottom: '2px solid #f4a6bc', paddingBottom: '8px', fontWeight: 'bold' }}>
            ✍️ Leituras por Autor
          </h3>
          {Object.keys(leiturasPorAutor).length === 0 ? (
            <p style={{ fontSize: '13px', color: '#888' }}>Nenhuma leitura cadastrada ainda.</p>
          ) : (
            Object.entries(leiturasPorAutor).map(([autor, listaObras]) => (
              <div key={autor} style={{ marginBottom: '16px', padding: '12px', borderRadius: '8px', backgroundColor: '#fff8fa', border: '1px solid #f4a6bc' }}>
                <div style={{ fontWeight: 'bold', color: '#2d4a3e', fontSize: '14px', marginBottom: '6px' }}>
                  👤 Autor: {autor}
                </div>
                {listaObras.map((ob) => (
                  <div key={ob.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginLeft: '10px', paddingLeft: '8px', borderLeft: '3px solid #f4a6bc', marginTop: '6px' }}>
                    <div>
                      <div style={{ fontSize: '13px', color: '#333', fontWeight: '600' }}>📚 {ob.title}</div>
                      {ob.comentario && <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#666', fontStyle: 'italic' }}>"{ob.comentario}"</p>}
                    </div>
                    <button
                      onClick={() => handleDeleteLeitura(ob.id)}
                      style={{ backgroundColor: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', marginLeft: '8px' }}
                      title="Excluir leitura"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Lista de Vínculos (com opção de exclusão) */}
        <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#4a7c59', fontSize: '16px', borderBottom: '2px solid #b2d8c3', paddingBottom: '8px', fontWeight: 'bold' }}>
            🔗 Conexões Registradas
          </h3>
          {vinculos.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#888' }}>Nenhuma conexão criada ainda.</p>
          ) : (
            vinculos.map((v) => {
              const lei = leituras.find((l) => l.id === (v.source.id || v.source));
              const mat = materias.find((m) => m.id === (v.target.id || v.target));
              return (
                <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '10px', borderRadius: '8px', backgroundColor: '#f4f9f5', borderLeft: '4px solid #4a7c59' }}>
                  <div>
                    <div style={{ fontSize: '13px', color: '#333' }}>
                      <b>📚 {lei?.title || 'Leitura'}</b> &rarr; <b>📗 {mat?.name || 'Disciplina'}</b>
                    </div>
                    {v.comentario && (
                      <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#2d4a3e' }}>
                        💬 Nota: {v.comentario}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteVinculo(v.id)}
                    style={{ backgroundColor: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', marginLeft: '8px' }}
                    title="Excluir conexão"
                  >
                    ✕
                  </button>
                </div>
              );
            })
          )}
        </div>

      </section>

    </main>
  );
}
