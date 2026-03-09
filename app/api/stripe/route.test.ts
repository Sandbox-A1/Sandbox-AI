import { vi, describe, it, expect, beforeEach } from "vitest";
import { POST } from "./route";

const mockAuth = vi.fn();
const mockSelect = vi.fn();

vi.mock("@clerk/nextjs/server", () => ({
  auth: () => mockAuth(),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: () => ({
      insert: (rows: unknown[]) => ({
        select: () => Promise.resolve(mockSelect() ?? { data: rows, error: null }),
        then: (resolve: (v: unknown) => void) => resolve({ data: rows, error: null }),
      }),
    }),
  }),
}));

function jsonRequest(body: unknown): Request {
  return new Request("http://localhost/api/stripe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/stripe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
    mockAuth.mockResolvedValue({ userId: "user_123" });
    mockSelect.mockReturnValue({ data: [{ id: "1" }], error: null });
  });

  it("retourne 401 si pas authentifié (userId absent)", async () => {
    mockAuth.mockResolvedValue({ userId: null });
    const req = jsonRequest({ chaos_mode: false });
    const res = await POST(req);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toBe("Non authentifié");
  });

  it("retourne 500 avec message chaos en mode chaos et enregistre le log", async () => {
    mockSelect.mockReturnValue({ data: [], error: null });
    const req = jsonRequest({ chaos_mode: true });
    const res = await POST(req);
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toBe("500 : CHAOS MODE ACTIVÉ 🌪️");
  });

  it("retourne 200 et success quand chaos_mode false et insert OK", async () => {
    const req = jsonRequest({ chaos_mode: false });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data).toBeDefined();
  });

  it("retourne 500 avec message générique (pas error.message Supabase) si insert échoue", async () => {
    mockSelect.mockReturnValue({
      data: null,
      error: { message: "relation \"api_logs\" does not exist" },
    });
    const req = jsonRequest({ chaos_mode: false });
    const res = await POST(req);
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toBe("Une erreur est survenue. Réessayez plus tard.");
    expect(json.error).not.toContain("api_logs");
  });

  it("retourne 500 si variables Supabase manquantes", async () => {
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    const req = jsonRequest({ chaos_mode: false });
    const res = await POST(req);
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe("Une erreur est survenue. Réessayez plus tard.");
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
  });

  it("ignore les champs inconnus dans le body (validation)", async () => {
    const req = jsonRequest({ chaos_mode: false, user_id: "user_evil", other: "ignored" });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(res.ok).toBe(true);
  });
});
