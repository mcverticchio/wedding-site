import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  guests: defineTable({
    full_name: v.string(),
    email: v.union(v.string(), v.null()),
    guest_plus_one: v.union(v.string(), v.null()),
    invited_to_friday: v.boolean(),
    invited_to_saturday: v.boolean(),
    searchText: v.string(),
  }).searchIndex('search_name', {
    searchField: 'searchText',
  }),

  guest_rsvps: defineTable({
    guest_id: v.id('guests'),
    attending_friday: v.union(v.boolean(), v.null()),
    attending_saturday: v.boolean(),
    plus_one_attending: v.union(v.boolean(), v.null()),
    additional_guests: v.number(),
    additional_guest_names: v.union(v.array(v.string()), v.null()),
    email: v.string(),
    notes: v.union(v.string(), v.null()),
  }),
});
