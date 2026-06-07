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
  person: "#2563eb",
  organization: "#7c3aed",
  vessel: "#0d9488",
};

const CENTER_NODE_COLOR = "#b45309";

export default function RelationGraph({ graph }: RelationGraphProps) {
  const { width, height } = getGraphDimensions();
  const positionedNodes = layoutGraph(graph);

  const centerNode = graph.nodes.find((node) => node.is_center);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      style={{
        maxWidth: `${width}px`,
        border: "1px solid #ddd",
        borderRadius: "4px",
        background: "#fafafa",
      }}
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
              stroke="#999"
              strokeWidth={1.5}
            />
            <rect
              x={labelX - label.length * 3.2}
              y={labelY - 10}
              width={label.length * 6.4}
              height={16}
              fill="#fafafa"
              opacity={0.9}
            />
            <text
              x={labelX}
              y={labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={11}
              fill="#444"
            >
              {label}
            </text>
          </g>
        );
      })}

      {positionedNodes.map(({ node, position }) => {
        const radius = node.is_center ? 36 : 28;
        const fill = node.is_center
          ? CENTER_NODE_COLOR
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
              fill="#222"
            >
              {truncateLabel(node.name)}
            </text>
            <text y={radius + 28} textAnchor="middle" fontSize={10} fill="#666">
              {node.type}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
