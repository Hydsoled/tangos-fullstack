import { describe, expect, it } from "vitest";
import type { GraphResponse } from "../types/api";
import {
  formatRelationType,
  getGraphDimensions,
  getNodePosition,
  layoutGraph,
  truncateLabel,
} from "./graphLayout";

const sampleGraph: GraphResponse = {
  center_id: "SDN-10011",
  nodes: [
    {
      id: "SDN-10011",
      name: "Ivan Petrovich Volkov",
      type: "person",
      is_center: true,
    },
    {
      id: "SDN-10012",
      name: "Igor Petrovich Volkov",
      type: "person",
      is_center: false,
    },
  ],
  edges: [
    {
      source_id: "SDN-10011",
      target_id: "SDN-10012",
      type: "sibling",
      note: null,
    },
  ],
};

describe("graphLayout", () => {
  it("returns fixed graph dimensions", () => {
    expect(getGraphDimensions()).toEqual({ width: 800, height: 520 });
  });

  it("places the center node at the canvas center", () => {
    const positioned = layoutGraph(sampleGraph);
    const center = positioned.find((item) => item.node.is_center);

    expect(center?.position).toEqual({ x: 400, y: 260 });
  });

  it("positions neighbors around the center", () => {
    const positioned = layoutGraph(sampleGraph);
    const center = positioned.find((item) => item.node.is_center);
    const neighbor = positioned.find((item) => !item.node.is_center);

    expect(center).toBeDefined();
    expect(neighbor).toBeDefined();

    const dx = (neighbor?.position.x ?? 0) - (center?.position.x ?? 0);
    const dy = (neighbor?.position.y ?? 0) - (center?.position.y ?? 0);
    const distance = Math.hypot(dx, dy);

    expect(distance).toBeGreaterThan(0);
  });

  it("looks up node positions by id", () => {
    const positioned = layoutGraph(sampleGraph);

    expect(getNodePosition(positioned, "SDN-10011")).toEqual({ x: 400, y: 260 });
    expect(getNodePosition(positioned, "MISSING")).toBeUndefined();
  });

  it("formats relation types for display", () => {
    expect(formatRelationType("beneficial_owner_of")).toBe("beneficial owner of");
  });

  it("truncates long labels", () => {
    const label = "A".repeat(40);
    expect(truncateLabel(label)).toHaveLength(28);
    expect(truncateLabel(label).endsWith("…")).toBe(true);
  });
});
