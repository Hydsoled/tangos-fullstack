import type { GraphNode, GraphResponse } from "../types/api";

export type Point = {
  x: number;
  y: number;
};

export type PositionedNode = {
  node: GraphNode;
  position: Point;
};

const GRAPH_WIDTH = 800;
const GRAPH_HEIGHT = 520;
const NEIGHBOR_RADIUS = 180;

export function getGraphDimensions() {
  return { width: GRAPH_WIDTH, height: GRAPH_HEIGHT };
}

export function layoutGraph(graph: GraphResponse): PositionedNode[] {
  const centerX = GRAPH_WIDTH / 2;
  const centerY = GRAPH_HEIGHT / 2;

  const centerNode = graph.nodes.find((node) => node.is_center);
  const neighborNodes = graph.nodes.filter((node) => !node.is_center);

  const positioned: PositionedNode[] = [];

  if (centerNode) {
    positioned.push({
      node: centerNode,
      position: { x: centerX, y: centerY },
    });
  }

  neighborNodes.forEach((node, index) => {
    const angle = (2 * Math.PI * index) / neighborNodes.length - Math.PI / 2;
    positioned.push({
      node,
      position: {
        x: centerX + NEIGHBOR_RADIUS * Math.cos(angle),
        y: centerY + NEIGHBOR_RADIUS * Math.sin(angle),
      },
    });
  });

  return positioned;
}

export function getNodePosition(
  positionedNodes: PositionedNode[],
  nodeId: string,
): Point | undefined {
  return positionedNodes.find((item) => item.node.id === nodeId)?.position;
}

export function formatRelationType(relationType: string): string {
  return relationType.replaceAll("_", " ");
}

export function truncateLabel(label: string, maxLength = 28): string {
  if (label.length <= maxLength) {
    return label;
  }

  return `${label.slice(0, maxLength - 1)}…`;
}
