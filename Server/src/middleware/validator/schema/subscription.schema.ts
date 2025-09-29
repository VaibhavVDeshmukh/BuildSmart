import z from "zod";

// ---- validators ----
export const subscriptionListQuerySchema = z.object({
  q: z.string().trim().optional(),
  status: z.enum(["Pending", "Active", "Suspended", "Expired", "Cancelled", "ALL"]).optional(),
  accountId: z.string().uuid().optional(),
  cursor: z.string().uuid().optional(),
  take: z.coerce.number().int().min(1).max(200).optional(),
});
