import { z } from "zod";
import { featuresData } from "../../../seeds/feature-data";

// Extract valid feature names from featuresData
const validFeatureNames = featuresData.map((f) => f.name) as [string, ...string[]];

export const AddFeatureUsageSchema = z.object({
  featureName: z.enum(validFeatureNames, {
    required_error: "featureName is required",
    invalid_type_error: "featureName must be one of the predefined features",
  }),
  metadata: z.record(z.any()).optional(),
});

export type AddFeatureUsageType = z.infer<typeof AddFeatureUsageSchema>;
