import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Node {
  id: string;
  label: string;
  type: string;
}

interface Edge {
  source: string;
  target: string;
  label: string;
}

const typeColors: Record<string, string> = {
  country: 'hsl(40, 62%, 58%)',
  org: 'hsl(217, 91%, 60%)',
  commodity: 'hsl(142, 60%, 50%)',
  sector: 'hsl(280, 60%, 60%)',
};

const EntityGraph = ({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const positions = useMemo(() => {
    const cx = 400, cy = 250;
    const radius = 180;
    return nodes.reduce((acc, node, i) => {
      const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2;
      acc[node.id] = {
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
      };
      return acc;
    }, {} as Record<string, { x: number; y: number }>);
  }, [nodes]);

  const selectedNode = nodes.find(n => n.id === selected);
  const connectedEdges = edges.filter(e => e.source === selected || e.target === selected);

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <svg viewBox="0 0 800 500" className="w-full h-auto">
            {/* Edges */}
            {edges.map((edge, i) => {
              const s = positions[edge.source];
              const t = positions[edge.target];
              if (!s || !t) return null;
              const isHighlighted = selected === edge.source || selected === edge.target;
              return (
                <g key={i}>
                  <motion.line
                    x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                    stroke={isHighlighted ? 'hsl(40, 62%, 58%)' : 'hsl(224, 25%, 25%)'}
                    strokeWidth={isHighlighted ? 2 : 1}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={mounted ? { pathLength: 1, opacity: 1 } : {}}
                    transition={{ delay: i * 0.05, duration: 0.5 }}
                  />
                  <text
                    x={(s.x + t.x) / 2}
                    y={(s.y + t.y) / 2 - 6}
                    textAnchor="middle"
                    fill="hsl(220, 15%, 45%)"
                    fontSize="9"
                    fontFamily="Inter, sans-serif"
                    opacity={isHighlighted ? 1 : 0.5}
                  >
                    {edge.label}
                  </text>
                </g>
              );
            })}
            {/* Nodes */}
            {nodes.map((node, i) => {
              const pos = positions[node.id];
              const color = typeColors[node.type] || 'hsl(40, 62%, 58%)';
              const isSelected = selected === node.id;
              return (
                <motion.g
                  key={node.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={mounted ? { scale: 1, opacity: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.06, type: 'spring', damping: 15 }}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelected(prev => prev === node.id ? null : node.id)}
                >
                  <circle
                    cx={pos.x} cy={pos.y} r={isSelected ? 28 : 22}
                    fill={color}
                    opacity={isSelected ? 1 : 0.7}
                    stroke={isSelected ? '#fff' : 'none'}
                    strokeWidth={2}
                  />
                  <text
                    x={pos.x} y={pos.y + 38}
                    textAnchor="middle"
                    fill="hsl(40, 20%, 85%)"
                    fontSize="11"
                    fontFamily="Inter, sans-serif"
                    fontWeight="500"
                  >
                    {node.label}
                  </text>
                </motion.g>
              );
            })}
          </svg>
        </div>

        {/* Detail panel */}
        <div className="lg:w-64 min-h-[200px]">
          {selectedNode ? (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: typeColors[selectedNode.type] || 'hsl(40, 62%, 58%)' }} />
                <span className="font-serif font-semibold">{selectedNode.label}</span>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans">{selectedNode.type}</span>
              {connectedEdges.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  <p className="text-xs text-muted-foreground font-sans font-semibold">Connections:</p>
                  {connectedEdges.map((e, i) => {
                    const other = e.source === selected ? e.target : e.source;
                    const otherNode = nodes.find(n => n.id === other);
                    return (
                      <p key={i} className="text-xs font-sans text-foreground/70">
                        {e.label} <span className="text-primary">{otherNode?.label}</span>
                      </p>
                    );
                  })}
                </div>
              )}
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm font-sans">
              Click a node to explore
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EntityGraph;
