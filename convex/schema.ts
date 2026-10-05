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
    // Arch drawing flattened onto mouth.png (PNG), in Convex storage.
    drawing: v.optional(v.id('_storage')),
    // Scans in Vercel Blob. url/size/contentType are filled in from Blob when
    // the owner email is sent; a scan without a url was never uploaded.
    scans: v.optional(
      v.array(
        v.union(
          v.object({
            pathname: v.string(),
            fileName: v.string(),
            url: v.optional(v.string()),
            size: v.optional(v.number()),
            contentType: v.optional(v.string()),
          }),
          // Early dev test submissions stored scans in Convex storage. Drop
          // this once those rows are cleared (before the phase 10 cutover).
          v.object({
            storageId: v.id('_storage'),
            fileName: v.string(),
            size: v.number(),
            contentType: v.string(),
          })
        )
      )
    ),
    ownerEmailStatus: vEmailStatus,
    ownerEmailId: v.optional(v.string()),
    ownerEmailError: v.optional(v.string()),
    // Doctor confirmation. Optional because early dev rows predate it.
    doctorEmailStatus: v.optional(vEmailStatus),
    doctorEmailId: v.optional(v.string()),
    doctorEmailError: v.optional(v.string()),
  })
    .index('by_ownerEmailId', ['ownerEmailId'])
    .index('by_doctorEmailId', ['doctorEmailId']),

  // Footer contact-form messages, each emailed to the owner.
  contactMessages: defineTable({
    first: v.string(),
    last: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    message: v.string(),
    emailStatus: vEmailStatus,
    emailId: v.optional(v.string()),
    emailError: v.optional(v.string()),
  }).index('by_emailId', ['emailId']),

  // Every scan upload token handed out, so submit only accepts our own
  // uploads and the sweep can delete the ones never submitted.
  scanUploads: defineTable({
    pathname: v.string(),
    fileName: v.string(),
    submissionId: v.optional(v.id('rxSubmissions')),
  })
    .index('by_pathname', ['pathname'])
    .index('by_submissionId', ['submissionId']),
});
