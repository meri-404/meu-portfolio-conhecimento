'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export default function Home() {
  // Estados principais
  const [materias, setMaterias] = useState([]);
  const [leituras, setLeituras] = useState([]);
  const [vinculos, setVinculos] = useState([]);

  // Estados dos formulários
  const [formMateria, setFormMateria] = useState({ name: '', code: '' });
  const [formLeitura, setFormLeitura] = useState({ title: '', autor: '', comentario: '' });
  const [formVinculo, setFormVinculo] = useState({ leituraId: '', materiaId: '', comentario: '' });

  // 1. Adicionar Matéria
  const handleAddMateria = (e) => {
    e.preventDefault();
    const nomeLimpo = formMateria.name.trim();
    if (!nomeLimpo) return;

    const jaExiste = materias.some((m) => m.name.toLowerCase() === nomeLimpo.toLowerCase());
    if (jaExiste) {
      alert('Esta matéria já está cadastrada!');
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

  // 2. Adicionar Leitura
  const handleAddLeitura = (e) => {
    e.preventDefault();
    if (!formLeitura.title.trim()) return;

    const novaLeitura = {
      id: `l-${Date.now()}`,
      title: formLeitura.title.trim(),
      autor: formLeitura.autor.trim() || 'Autor Desconhecido',
      comentario: formLeitura.comentario.trim(),
    };

    setLeituras((prev) => [...prev, novaLeitura]);
    setFormLeitura({ title: '', autor: '', comentario: '' });
  };

  // 3. Adicionar Vínculo (com validação anti-duplicidade)
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

  // 4. Filtrar disciplinas disponíveis para a leitura selecionada (evita repetir conexões)
  const materiasDisponiveis = useMemo(() => {
    if (!formVinculo.leituraId) return materias;

    // Obtém os IDs de matérias que já possuem vínculo com a leitura escolhida
    const materiasJaConectadas = vinculos
      .filter((v) => (v.source.id || v.source) === formVinculo.leituraId)
      .map((v) => v.target.id || v.target);

    return materias.filter((m) => !materiasJaConectadas.includes(m.id));
  }, [formVinculo.leituraId, materias, vinculos]);

  // 5. Agrupar leituras por Autor
  const leiturasPorAutor = useMemo(() => {
    const grupos = {};
    leituras.forEach((l) => {
      const autor = l.autor || 'Autor Desconhecido';
      if (!grupos[autor]) grupos[autor] = [];
      grupos[autor].push(l);
    });
    return grupos;
  }, [leituras]);

  // 6. Estrutura do Grafo memoizada
  const graphData = useMemo(() => {
    const nodes = [
      ...materias.map((m) => ({
        id: m.id,
        name: `📗 ${m.name} (${m.code})`,
        group: 'materia',
        val: 14,
      })),
      ...leituras.map((l) => ({
        id: l.id,
        name: `🌸 ${l.title}\n✍️ ${l.autor}`,
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
    <main style={{ padding: '25px', fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#faf5f7', color: '#2d3748', minHeight: '100vh' }}>
      
      {/* Cabeçalho */}
      <header style={{ marginBottom: '25px', borderBottom: '2px solid #fbcfe8', paddingBottom: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '32px' }}>🌸📚🌿</span>
          <h1 style={{ fontSize: '26px', color: '#9d174d', margin: 0 }}>
            Jardim Digital & Acervo de Leituras
          </h1>
        </div>
        <p style={{ color: '#047857', marginTop: '6px', fontWeight: '500', fontSize: '14px' }}>
          Cadastre suas disciplinas, leituras e conecte ideias sem repetir dados
        </p>
      </header>

      {/* Formatos de Cadastro */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '20px', marginBottom: '25px' }}>
        
        {/* Form 1: Disciplinas */}
        <form onSubmit={handleAddMateria} style={{ backgroundColor: '#ffffff', padding: '18px', borderRadius: '12px', border: '1px solid #a7f3d0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#047857', fontSize: '15px' }}>📗 1. Cadastrar Disciplina</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="text"
              placeholder="Nome da matéria (Ex: Representação Temática)"
              value={formMateria.name}
              onChange={(e) => setFormMateria({ ...formMateria, name: e.target.value })}
              style={{ padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
            />
            <input
              type="text"
              placeholder="Sigla / Código (Ex: RTI)"
              value={formMateria.code}
              onChange={(e) => setFormMateria({ ...formMateria, code: e.target.value })}
              style={{ padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
            />
            <button type="submit" style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '4px' }}>
              + Salvar Disciplina
            </button>
          </div>
        </form>

        {/* Form 2: Leituras */}
        <form onSubmit={handleAddLeitura} style={{ backgroundColor: '#ffffff', padding: '18px', borderRadius: '12px', border: '1px solid #fbcfe8', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#be185d', fontSize: '15px' }}>🌸 2. Cadastrar Leitura</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="text"
              placeholder="Título da Leitura / Artigo / Livro"
              value={formLeitura.title}
              onChange={(e) => setFormLeitura({ ...formLeitura, title: e.target.value })}
              style={{ padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
            />
            <input
              type="text"
              placeholder="Autor(es) (Ex: Lancaster, F. W.)"
              value={formLeitura.autor}
              onChange={(e) => setFormLeitura({ ...formLeitura, autor: e.target.value })}
              style={{ padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
            />
            <textarea
              placeholder="Comentário ou anotações sobre a leitura (opcional)..."
              value={formLeitura.comentario}
              onChange={(e) => setFormLeitura({ ...formLeitura, comentario: e.target.value })}
              rows={2}
              style={{ padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', resize: 'vertical' }}
            />
            <button type="submit" style={{ backgroundColor: '#ec4899', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              + Salvar Leitura
            </button>
          </div>
        </form>

      </section>

      {/* Form 3: Vínculos (Sem opções repetidas) */}
      {(materias.length > 0 && leituras.length > 0) && (
        <form onSubmit={handleAddVinculo} style={{ backgroundColor: '#ffffff', padding: '18px', borderRadius: '12px', border: '2px dashed #f472b6', marginBottom: '25px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#9d174d', fontSize: '15px' }}>🔗 3. Conectar Leitura à Disciplina</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginBottom: '10px' }}>
            
            {/* Seleção de Leitura */}
            <select
              value={formVinculo.leituraId}
              onChange={(e) => setFormVinculo({ ...formVinculo, leituraId: e.target.value, materiaId: '' })}
              style={{ padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', backgroundColor: '#fff' }}
            >
              <option value="">-- 1º Selecione a Leitura --</option>
              {leituras.map((l) => (
                <option key={l.id} value={l.id}>🌸 {l.title} ({l.autor})</option>
              ))}
            </select>

            {/* Seleção de Matéria (só exibe matérias não conectadas ainda) */}
            <select
              value={formVinculo.materiaId}
              onChange={(e) => setFormVinculo({ ...formVinculo, materiaId: e.target.value })}
              disabled={!formVinculo.leituraId || materiasDisponiveis.length === 0}
              style={{ padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', backgroundColor: '#fff' }}
            >
              <option value="">
                {!formVinculo.leituraId
                  ? '-- Selecione uma leitura primeiro --'
                  : materiasDisponiveis.length === 0
                  ? '⚠️ Já conectada a todas disciplinas!'
                  : '-- 2º Selecione a Disciplina Disponível --'}
              </option>
              {materiasDisponiveis.map((m) => (
                <option key={m.id} value={m.id}>📗 {m.name}</option>
              ))}
            </select>

            {/* Comentário do Vínculo */}
            <input
              type="text"
              placeholder="Comentário do vínculo (ex: P1 / Cap. 2)"
              value={formVinculo.comentario}
              onChange={(e) => setFormVinculo({ ...formVinculo, comentario: e.target.value })}
              style={{ padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
            />
          </div>

          <button
            type="submit"
            disabled={!formVinculo.leituraId || !formVinculo.materiaId}
            style={{
              backgroundColor: (!formVinculo.leituraId || !formVinculo.materiaId) ? '#cbd5e1' : '#be185d',
              color: 'white',
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

      {/* Indicadores de Total */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', fontSize: '13px', fontWeight: '600' }}>
        <span style={{ color: '#059669', backgroundColor: '#d1fae5', padding: '4px 12px', borderRadius: '20px' }}>
          📗 Disciplinas: {materias.length}
        </span>
        <span style={{ color: '#be185d', backgroundColor: '#fce7f3', padding: '4px 12px', borderRadius: '20px' }}>
          🌸 Leituras: {leituras.length}
        </span>
        <span style={{ color: '#9d174d', backgroundColor: '#fbcfe8', padding: '4px 12px', borderRadius: '20px' }}>
          🔗 Vínculos: {vinculos.length}
        </span>
      </div>

      {/* Grafo Interativo */}
      <div style={{ height: '480px', border: '2px solid #fbcfe8', borderRadius: '16px', overflow: 'hidden', marginBottom: '35px', boxShadow: '0 8px 20px -4px rgba(244, 114, 182, 0.15)' }}>
        <ForceGraph2D
          key="grafo-estavel"
          graphData={graphData}
          nodeLabel="name"
          nodeColor={(node) => (node.group === 'materia' ? '#10b981' : '#ec4899')}
          linkColor={() => '#f472b6'}
          linkWidth={2.5}
          backgroundColor="#fcf8fa"
        />
      </div>

      {/* Painéis Inferiores: Leituras Agrupadas por Autor & Conexões */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* Painel por Autores */}
        <div style={{ backgroundColor: '#fff', padding: '18px', borderRadius: '12px', border: '1px solid #fbcfe8' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#be185d', fontSize: '16px', borderBottom: '1px solid #fbcfe8', paddingBottom: '8px' }}>
            ✍️ Leituras Agrupadas por Autor
          </h3>
          {Object.keys(leiturasPorAutor).length === 0 ? (
            <p style={{ fontSize: '13px', color: '#94a3b8' }}>Nenhuma leitura cadastrada ainda.</p>
          ) : (
            Object.entries(leiturasPorAutor).map(([autor, listaObras]) => (
              <div key={autor} style={{ marginBottom: '16px', padding: '12px', borderRadius: '8px', backgroundColor: '#fdf2f8', border: '1px solid #fbcfe8' }}>
                <div style={{ fontWeight: 'bold', color: '#9d174d', fontSize: '14px', marginBottom: '6px' }}>
                  👤 Autor: {autor} <span style={{ fontSize: '11px', fontWeight: 'normal', color: '#be185d' }}>({listaObras.length} obra{listaObras.length > 1 ? 's' : ''})</span>
                </div>
                {listaObras.map((ob) => (
                  <div key={ob.id} style={{ marginLeft: '10px', paddingLeft: '8px', borderLeft: '2px solid #ec4899', marginTop: '6px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>🌸 {ob.title}</div>
                    {ob.comentario && <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>"{ob.comentario}"</p>}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Lista de Vínculos / Conexões */}
        <div style={{ backgroundColor: '#fff', padding: '18px', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#047857', fontSize: '16px', borderBottom: '1px solid #a7f3d0', paddingBottom: '8px' }}>
            🔗 Conexões & Notas dos Vínculos
          </h3>
          {vinculos.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#94a3b8' }}>Nenhum vínculo criado ainda.</p>
          ) : (
            vinculos.map((v) => {
              const lei = leituras.find((l) => l.id === (v.source.id || v.source));
              const mat = materias.find((m) => m.id === (v.target.id || v.target));
              return (
                <div key={v.id} style={{ marginBottom: '12px', padding: '10px', borderRadius: '8px', backgroundColor: '#ecfdf5', borderLeft: '3px solid #10b981' }}>
                  <div style={{ fontSize: '13px', color: '#065f46' }}>
                    <b>🌸 {lei?.title || 'Leitura'}</b> ➔ <b>📗 {mat?.name || 'Disciplina'}</b>
                  </div>
                  {v.comentario && (
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#047857' }}>
                      💬 <b>Nota:</b> {v.comentario}
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
