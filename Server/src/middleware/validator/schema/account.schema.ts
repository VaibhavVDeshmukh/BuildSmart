import { z } from "zod";

const subscriptionType = z.enum(["trial", "paid"], {
  message: "Invalid subscription type",
});

export const createAccountSchema = z.object({
  account: z.object({
    companyName: z.string().min(1, "Company name is required"),
    accountName: z.string().min(1, "Account name is required"),
    billingAddress: z.string().min(1, "Billing address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(1, "Country is required"),
    zipCode: z.string().min(1, "Zip code is required"),
    phone: z.string().optional(),
    phoneCode: z.string().optional(), // e.g., "91"
    phoneNumber: z.string().optional(), // e.g., "9876543210"
    countryCode: z.string().optional(), // e.g., "IN"
    billingAddressId: z.number().optional(),
    companyType: z.string().min(1, "Country type is missing"),
  }),
  subscription: z.object({
    subscriptionType: subscriptionType,
    selectedModules: z.array(z.string()).nonempty("At least one module must be selected"),
    dataSize: z.coerce
      .number()
      .min(1073741824, "Data size must be at least 1GB (1073741824 bytes)") // 1GB minimum in bytes
      .max(10995116277760, "Data size cannot exceed 10TB (10995116277760 bytes)"), // 10TB maximum in bytes
    maxUser: z.coerce.number().min(1, "Max user count must be at least 1"),
    billingCycle: z.enum(["Yearly", "Monthly"]),
  }),
});

export const CompanyAccountSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID for id" }),
  name: z.string().min(1, { message: "Name cannot be empty" }),
  isDeleted: z.boolean(),
});

export const SubscriptionSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID for id" }),
  name: z.string().min(1, { message: "Name cannot be empty" }),
  expirationDate: z
    .union([z.date(), z.null(), z.string()])
    .nullable()
    .refine((value) => value === null || value > new Date() || typeof value === "string", { message: "Expiration date must be in the future or null" }),
  subscriptionStatus: z.enum(["Active", "Suspended", "Expired"], {
    message: "Invalid subscription status",
  }),
  type: z.enum(["trial", "paid"], { message: "Type must be either 'trial' or 'paid'" }),
  account: CompanyAccountSchema,
});
export type SubscriptionT = z.infer<typeof SubscriptionSchema>;

export const OrgAccountSchema = z.object({
  subscription: SubscriptionSchema,
});

export const ReserveStorageSchema = z.object({
  expected_size_bytes: z.number().positive({ message: "Expected size must be a positive number" }),
});

export const updateAccountNameSchema = z.object({
  id: z.string().min(1, { message: "Id is required" }),
  accountName: z.string().min(1, { message: "Account name is required" }),
  subscriptionId: z.string().min(1, { message: "Subscription id is required" }),
});

export const updateBillingAddressSchema = z.object({
  id: z.string().min(1, { message: "Id is required" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  state: z.string().min(1, { message: "State is required" }),
  city: z.string().min(1, { message: "City is required" }),
  zip: z
    .string()
    .min(5, { message: "ZIP code must be at least 5 characters long" })
    .max(10, { message: "ZIP code must be at most 10 characters long" })
    .regex(/^\d+$/, { message: "Phone number must contain only digits" }),
  phone: z.string().regex(/^\+\d{1,3}\d{10}$/, {
    message: "Phone number must include country code (e.g., +11234567890)",
  }),
  phoneCode: z.string().optional(),
  phoneNumber: z.string().optional(),
  countryCode: z.string().optional(),
});

export const upgradeSubscriptionRequestSchema = z.object({
  requestedBilling: z.enum(["MONTHLY", "YEARLY"]).optional(),
  requestedMaxUser: z.coerce.number().int().min(1, "Max user must be at least 1").optional(),
  // BYTES POLICY: always bytes in payload
  requestedMaxDataSize: z.coerce.number().min(1_073_741_824, "Data size must be at least 1 GiB (1073741824 bytes)").optional(),
  requestedModules: z.array(z.string()).optional().default([]),
  // Optional snapshot of intended charge for the upgrade; used to make a Quotation
  quotedAmount: z.coerce.number().min(0).optional(),
});
export const cancelSubscriptionRequestSchema = z.object({
  reason: z.string().max(500).optional(), // keep for future audit/email
});

export type UpgradeSubscriptionRequestT = z.infer<typeof upgradeSubscriptionRequestSchema>;
export type CancelSubscriptionRequestT = z.infer<typeof cancelSubscriptionRequestSchema>;
export type UpdateBillingAddressType = z.infer<typeof updateBillingAddressSchema>;
export type UpdateAccountNameType = z.infer<typeof updateAccountNameSchema>;
export type ReserveStorageType = z.infer<typeof ReserveStorageSchema>;
export type OrgAccountT = z.infer<typeof OrgAccountSchema>;
export type CreateAccountT = z.infer<typeof createAccountSchema>;
export type SubscriptionType = z.infer<typeof subscriptionType>;
export type CompanyAccountT = z.infer<typeof CompanyAccountSchema>;
