import { vi, describe, it, expect, beforeEach } from "vitest";
import { GET } from "./route";

const mockAuth = vi.fn();
const mockSelect = vi.fn();

vi.mock("@clerk/nextjs/server", () => ({
  auth: () => mockAuth(),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: () => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: () => Promise.resolve(mockSelect()),
          }),
        }),
      }),
    }),
  }),
}));

describe("GET /api/logs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
    mockAuth.mockResolvedValue({ userId: "user_123" });
    mockSelect.mockResolvedValue({
      data: [
        {
          id: "1",
          action: "Paiement Stripe simulé",
          status: "success",
          agent: "Agent IA",
          created_at: "2025-01-01T12:00:00Z",
        },
      ],
      error: null,
    });
  });

  it("retourne 401 si pas authentifié (userId absent)", async () => {
    mockAuth.mockResolvedValue({ userId: null });
    const res = await GET();
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe("Non authentifié");
  });

  it("retourne 200 et logs filtrés par user_id si authentifié", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(Array.isArray(json.logs)).toBe(true);
    expect(json.logs[0].action).toBe("Paiement Stripe simulé");
    expect(json.logs[0].status).toBe("success");
  });

  it("retourne 500 avec message générique si erreur Supabase", async () => {
    mockSelect.mockResolvedValue({
      data: null,
      error: { message: "permission denied for table api_logs" },
    });
    const res = await GET();
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe("Erreur lors de la récupération des logs");
    expect(json.error).not.toContain("permission");
  });

  it("retourne 500 si variables Supabase manquantes", async () => {
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    const res = await GET();
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe("Erreur serveur");
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
  });
});
