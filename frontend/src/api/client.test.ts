import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, apiGet } from "./client";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("apiGet", () => {
  it("returns parsed JSON on success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ status: "ok" }),
      }),
    );

    await expect(apiGet<{ status: string }>("/api/health")).resolves.toEqual({
      status: "ok",
    });
  });

  it("throws ApiError with backend detail message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
        json: async () => ({ detail: "Entity 'UNKNOWN' not found" }),
      }),
    );

    await expect(apiGet("/api/entities/UNKNOWN/graph")).rejects.toMatchObject({
      name: "ApiError",
      status: 404,
      message: "Entity 'UNKNOWN' not found",
    } satisfies Partial<ApiError>);
  });

  it("falls back to status text when error body is not JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: async () => {
          throw new Error("invalid json");
        },
      }),
    );

    await expect(apiGet("/api/health")).rejects.toMatchObject({
      status: 500,
      message: "Internal Server Error",
    });
  });
});
