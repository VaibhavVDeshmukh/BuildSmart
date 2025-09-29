// middleware/validator/schema/subscriptionRequest.schema.ts
import { z } from "zod";
import * as Client from "../../../generated/client";
// ^ This import gives you runtime enums that z.nativeEnum can consume.

const StatusEnum = Client.SubscriptionRequestStatus;
const TypeEnum = Client.SubscriptionRequestType;

export const listQuerySchema = z.object({
  q: z.string().trim().min(1).optional(),
  status: z.union([z.literal("ALL"), z.nativeEnum(StatusEnum)]).optional(),
  type: z.union([z.literal("ALL"), z.nativeEnum(TypeEnum)]).optional(),
  cursor: z.string().uuid().optional(),
  take: z.coerce.number().int().min(1).max(100).optional(),
});

// Single source of truth for the list params type
export type ListParams = z.infer<typeof listQuerySchema>;

export const rejectBodySchema = z.object({
  reason: z.string().trim().min(1, "Reason is required"),
});

export const cancelBodySchema = z.object({
  reason: z.string().trim().min(1).max(500).optional(),
});

export const upgradeBodySchema = z.object({
  subscriptionId: z.string().optional(), // if upgrading an existing sub
  requestedBilling: z.enum(["MONTHLY", "YEARLY"]).optional(),
  requestedMaxUser: z.number().int().positive().optional(),
  requestedMaxDataSize: z.number().int().positive().optional(),
  requestedModules: z.array(z.string()).optional(),
  note: z.string().max(1000).optional(),
});

export type UpgradeBody = z.infer<typeof upgradeBodySchema>;
export type CancelBody = z.infer<typeof cancelBodySchema>;
