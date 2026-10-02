import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export const vEmailStatus = v.union(
  v.literal('pending'),
  v.literal('queued'),
  v.literal('sent'),
  v.literal('delivered'),
  v.literal('delivery_delayed'),
  v.literal('bounced'),
  v.literal('complained'),
  v.literal('failed')
);

export default defineSchema({
  rxSubmissions: defineTable({
    first: v.string(),
    last: v.string(),
    email: v.string(),
    phone: v.string(),
    street: v.optional(v.string()),
    city: v.optional(v.string()),
    zip: v.optional(v.string()),
    patient: v.string(),
    deliveryDate: v.optional(v.string()),
    appliance: v.string(),
    position: v.optional(v.string()),
    clasp: v.optional(v.string()),
    spring: v.optional(v.string()),
    color: v.optional(v.string()),
    instructions: v.optional(v.string()),
    // Filled in by later phases (drawing on the arch, scan uploads).
    drawing: v.optional(v.id('_storage')),
    scans: v.optional(
      v.array(
        v.object({
          storageId: v.id('_storage'),
          fileName: v.string(),
          size: v.number(),
          contentType: v.string(),
        })
      )
    ),
    ownerEmailStatus: vEmailStatus,
    ownerEmailId: v.optional(v.string()),
    ownerEmailError: v.optional(v.string()),
  }).index('by_ownerEmailId', ['ownerEmailId']),
});
