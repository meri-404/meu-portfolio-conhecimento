'use client';

import dynamic from 'next/dynamic';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

// Dados com os 3 posts e todas as suas conexões por Tags
const graphData = {
  nodes: [
    // Posts (Pontos Vermelhos)
    { id: 'post-1', name: 'A Ciência da Informação na Governança de Dados', group: 'post', val: 10 },
    { id: 'post-2', name: 'Tratamento de Dados Corporativos com Python', group: 'post', val: 10 },
    { id: 'post-3', name: 'Construindo Dicionários de Dados com Taxonomia', group: 'post', val: 10 },

    // Tags / Conceitos (Pontos Azuis)
    { id: 'tag-1', name: 'Ciência da Informação', group: 'tag', val: 6 },
    { id: 'tag-2', name: 'Governança', group: 'tag', val: 5 },
    { id: 'tag-3', name: 'SQL', group: 'tag', val: 6 },
    { id: 'tag-4', name: 'Python', group: 'tag', val: 6 },
    { id: 'tag-5', name: 'Análise de Dados', group: 'tag', val: 6 },
  ],
  links: [
    // Conexões do Post 1
    { source: 'post-1', target: 'tag-1' },
    { source: 'post-1', target: 'tag-2' },
    { source: 'post-1', target: 'tag-3' },

    // Conexões do Post 2
    { source: 'post-2', target: 'tag-3' }, // Conecta ao SQL (mesma do Post 1!)
    { source: 'post-2', target: 'tag-4' },
    { source: 'post-2', target: 'tag-5' },

    // Conexões do Post 3
    { source: 'post-3', target: 'tag-1' }, // Conecta à Ciência da Informação (Post 1!)
    { source: 'post-3', target: 'tag-4' }, // Conecta ao Python (Post 2!)
    { source: 'post-3', target: 'tag-5' },
  ]
};

export default function Home() {
  return (
    <main style={{ padding: '30px', fontFamily: 'sans-serif', backgroundColor: '#0f172a', color: 'white', minHeight: '100vh' }}>
      <header style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', color: '#f8fafc' }}>🌐 Grafo do Meu Acervo de Conhecimento</h1>
        <p style={{ color: '#94a3b8' }}>Visualização de intersecção entre Ciência da Informação, Dados e Programação</p>
      </header>
      
      <div style={{ height: '480px', border: '1px solid #334155', borderRadius: '12px', overflow: 'hidden', marginBottom: '40px' }}>
        <ForceGraph2D
          graphData={graphData}
          nodeLabel="name"
          nodeColor={(node) => (node.group === 'post' ? '#ef4444' : '#3b82f6')}
          backgroundColor="#0f172a"
        />
      </div>

      <section style={{ maxWidth: '800px' }}>
        <h2 style={{ fontSize: '22px', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>Publicações no Acervo</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
          <article style={{ padding: '16px', backgroundColor: '#1e293b', borderRadius: '8px' }}>
            <h3 style={{ color: '#38bdf8', margin: '0 0 8px 0' }}>A Ciência da Informação na Governança de Dados</h3>
            <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0 }}>Como conceitos clássicos de CI ajudam a organizar dicionários de dados e metadados em BI.</p>
          </article>

          <article style={{ padding: '16px', backgroundColor: '#1e293b', borderRadius: '8px' }}>
            <h3 style={{ color: '#38bdf8', margin: '0 0 8px 0' }}>Tratamento de Dados Corporativos com Python e Pandas</h3>
            <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0 }}>Como usar bibliotecas de Python para limpar e padronizar listas de materiais antes da carga no banco de dados.</p>
          </article>

          <article style={{ padding: '16px', backgroundColor: '#1e293b', borderRadius: '8px' }}>
            <h3 style={{ color: '#38bdf8', margin: '0 0 8px 0' }}>Construindo Dicionários de Dados com Princípios de Taxonomia</h3>
            <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0 }}>Aplicação da classificação bibliográfica na padronização de metadados para projetos de Business Intelligence.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
