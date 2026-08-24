'use client';

import dynamic from 'next/dynamic';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

const graphData = {
  nodes: [
    // 📗 As 4 Matérias do Curso (Pontos Verde Claro)
    { id: 'm1', name: '📖 Representação Temática da Informação (RTI)', group: 'materia', val: 14 },
    { id: 'm2', name: '📖 Organização do Conhecimento e Taxonomia', group: 'materia', val: 14 },
    { id: 'm3', name: '📖 Fontes de Informação & Recuperação', group: 'materia', val: 14 },
    { id: 'm4', name: '📖 Gestão de Unidades de Informação & Dados', group: 'materia', val: 14 },

    // 🌸 Leituras e Posts (Pontos Pink / Rosa)
    { id: 'p1', name: '🌸 Leitura: Princípios de Classificação Bibliográfica', group: 'post', val: 8 },
    { id: 'p2', name: '🌸 Leitura: Indexação e Linguagens Documentárias', group: 'post', val: 8 },
    { id: 'p3', name: '🌸 Resumo: Taxonomia Aplicada a Dicionários de Dados', group: 'post', val: 8 },
    { id: 'p4', name: '🌸 Artigo: Fontes de Dados Abertos e Transparência', group: 'post', val: 8 },
    { id: 'p5', name: '🌸 Estudo de Caso: Arquitetura da Informação e BI', group: 'post', val: 8 },
  ],
  links: [
    // Conexões das Leituras com as Matérias
    { source: 'p1', target: 'm1' }, // RTI
    { source: 'p1', target: 'm2' }, // Taxonomia

    { source: 'p2', target: 'm1' }, // RTI
    { source: 'p2', target: 'm3' }, // Recuperação

    { source: 'p3', target: 'm2' }, // Taxonomia
    { source: 'p3', target: 'm4' }, // Gestão de Dados

    { source: 'p4', target: 'm3' }, // Fontes de Informação
    { source: 'p4', target: 'm4' }, // Gestão de Dados

    { source: 'p5', target: 'm2' }, // Taxonomia
    { source: 'p5', target: 'm4' }, // Gestão de Dados
  ]
};

export default function Home() {
  return (
    <main style={{ padding: '30px', fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#faf5f7', color: '#2d3748', minHeight: '100vh' }}>
      
      {/* Cabeçalho no estilo Blog/Jardim Digital */}
      <header style={{ marginBottom: '25px', borderBottom: '2px solid #fbcfe8', paddingBottom: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '32px' }}>🌸📚🌿</span>
          <h1 style={{ fontSize: '28px', color: '#9d174d', margin: 0 }}>
            Jardim Digital & Acervo Acadêmico
          </h1>
        </div>
        <p style={{ color: '#047857', marginTop: '8px', fontWeight: '500' }}>
          Conectando as disciplinas de Biblioteconomia & Ciência da Informação com minhas leituras e resumos
        </p>
      </header>

      {/* Legenda dos Nós */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '15px', fontSize: '14px', fontWeight: '600' }}>
        <span style={{ color: '#059669', backgroundColor: '#d1fae5', padding: '4px 12px', borderRadius: '20px', border: '1px solid #a7f3d0' }}>
          📗 Matérias do Curso (Verde)
        </span>
        <span style={{ color: '#be185d', backgroundColor: '#fce7f3', padding: '4px 12px', borderRadius: '20px', border: '1px solid #fbcfe8' }}>
          🌸 Leituras / Posts (Pink)
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

      {/* Seção das Matérias e Leituras */}
      <section style={{ maxWidth: '850px' }}>
        <h2 style={{ fontSize: '22px', color: '#9d174d', borderBottom: '2px solid #a7f3d0', paddingBottom: '8px' }}>
          🌿 Conexões de Leituras por Disciplina
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '16px', marginTop: '20px' }}>
          
          <article style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #fbcfe8', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <span style={{ fontSize: '12px', backgroundColor: '#d1fae5', color: '#047857', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>📗 Matéria</span>
            <h3 style={{ color: '#9d174d', margin: '8px 0' }}>Representação Temática da Informação</h3>
            <p style={{ color: '#4b5563', fontSize: '14px', margin: 0 }}>
              Leituras vinculadas: <i>Princípios de Classificação Bibliográfica</i> e <i>Indexação e Linguagens Documentárias</i>.
            </p>
          </article>

          <article style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #fbcfe8', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <span style={{ fontSize: '12px', backgroundColor: '#d1fae5', color: '#047857', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>📗 Matéria</span>
            <h3 style={{ color: '#9d174d', margin: '8px 0' }}>Organização do Conhecimento e Taxonomia</h3>
            <p style={{ color: '#4b5563', fontSize: '14px', margin: 0 }}>
              Leituras vinculadas: <i>Taxonomia Aplicada a Dicionários de Dados</i> e <i>Arquitetura da Informação e BI</i>.
            </p>
          </article>

        </div>
      </section>
    </main>
  );
}
