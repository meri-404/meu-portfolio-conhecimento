'use client';

import dynamic from 'next/dynamic';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

// Dados baseados no seu post da pasta content/posts/
const graphData = {
  nodes: [
    { id: 'post-1', name: 'A Ciência da Informação na Governança de Dados', group: 'post', val: 10 },
    { id: 'tag-1', name: 'Ciência da Informação', group: 'tag', val: 5 },
    { id: 'tag-2', name: 'Governança', group: 'tag', val: 5 },
    { id: 'tag-3', name: 'SQL', group: 'tag', val: 5 },
  ],
  links: [
    { source: 'post-1', target: 'tag-1' },
    { source: 'post-1', target: 'tag-2' },
    { source: 'post-1', target: 'tag-3' },
  ]
};

export default function Home() {
  return (
    <main style={{ padding: '30px', fontFamily: 'sans-serif', backgroundColor: '#0f172a', color: 'white', minHeight: '100vh' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', color: '#f8fafc' }}>🌐 Meu Grafo de Conhecimento</h1>
        <p style={{ color: '#94a3b8' }}>Blog & Portfólio de Ciência da Informação e Análise de Dados</p>
      </header>
      
      <div style={{ height: '450px', border: '1px solid #334155', borderRadius: '12px', overflow: 'hidden', marginBottom: '40px' }}>
        <ForceGraph2D
          graphData={graphData}
          nodeLabel="name"
          nodeColor={(node) => (node.group === 'post' ? '#ef4444' : '#3b82f6')}
          backgroundColor="#0f172a"
        />
      </div>

      <section>
        <h2 style={{ fontSize: '22px', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>Publicações Recentes</h2>
        
        <article style={{ marginTop: '20px', padding: '16px', backgroundColor: '#1e293b', borderRadius: '8px' }}>
          <h3 style={{ color: '#38bdf8', margin: '0 0 8px 0' }}>A Ciência da Informação na Governança de Dados</h3>
          <p style={{ color: '#cbd5e1', fontSize: '14px' }}>
            Como conceitos clássicos de CI ajudam a organizar dicionários de dados e metadados em BI.
          </p>
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <span style={{ backgroundColor: '#1e3a8a', color: '#93c5fd', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>#Ciência da Informação</span>
            <span style={{ backgroundColor: '#1e3a8a', color: '#93c5fd', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>#Governança</span>
            <span style={{ backgroundColor: '#1e3a8a', color: '#93c5fd', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>#SQL</span>
          </div>
        </article>
      </section>
    </main>
  );
}
