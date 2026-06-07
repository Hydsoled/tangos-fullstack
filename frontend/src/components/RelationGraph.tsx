import type { GraphResponse } from "../types/api";
import {
  formatRelationType,
  getGraphDimensions,
  getNodePosition,
  layoutGraph,
  truncateLabel,
} from "../utils/graphLayout";

type RelationGraphProps = {
  graph: GraphResponse;
};

const NODE_COLORS: Record<string, string> = {
  person: "var(--color-person)",
  organization: "var(--color-organization)",
  vessel: "var(--color-vessel)",
};

export default function RelationGraph({ graph }: RelationGraphProps) {
  const { width, height } = getGraphDimensions();
  const positionedNodes = layoutGraph(graph);

  const centerNode = graph.nodes.find((node) => node.is_center);

  return (
    <svg
      className="relation-graph"
      viewBox={`0 0 ${width} ${height}`}
      aria-label={
        centerNode
          ? `Relationship graph for ${centerNode.name}`
          : "Relationship graph"
      }
    >
      {graph.edges.map((edge) => {
        const source = getNodePosition(positionedNodes, edge.source_id);
        const target = getNodePosition(positionedNodes, edge.target_id);

        if (!source || !target) {
          return null;
        }

        const labelX = (source.x + target.x) / 2;
        const labelY = (source.y + target.y) / 2;
        const label = formatRelationType(edge.type);

        return (
          <g key={`${edge.source_id}-${edge.target_id}-${edge.type}`}>
            <line
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke="#94a3b8"
              strokeWidth={1.5}
            />
            <rect
              x={labelX - label.length * 3.2}
              y={labelY - 10}
              width={label.length * 6.4}
              height={16}
              fill="#fafafa"
              opacity={0.95}
            />
            <text
              x={labelX}
              y={labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={11}
              fill="#475569"
            >
              {label}
            </text>
          </g>
        );
      })}

      {positionedNodes.map(({ node, position }) => {
        const radius = node.is_center ? 36 : 28;
        const fill = node.is_center
          ? "var(--color-center)"
          : (NODE_COLORS[node.type] ?? "#64748b");

        return (
          <g key={node.id} transform={`translate(${position.x}, ${position.y})`}>
            <circle r={radius} fill={fill} opacity={0.15} />
            <circle
              r={node.is_center ? 10 : 8}
              fill={fill}
              stroke="#fff"
              strokeWidth={2}
            />
            <text
              y={radius + 14}
              textAnchor="middle"
              fontSize={12}
              fontWeight={node.is_center ? 600 : 400}
              fill="#1e293b"
            >
              {truncateLabel(node.name)}
            </text>
            <text y={radius + 28} textAnchor="middle" fontSize={10} fill="#64748b">
              {node.type}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
