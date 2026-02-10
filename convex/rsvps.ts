import { v } from 'convex/values';
import { mutation } from './_generated/server';

export const submit = mutation({
  args: {
    guest_id: v.id('guests'),
    attending_friday: v.union(v.boolean(), v.null()),
    attending_saturday: v.boolean(),
    primary_attending: v.optional(v.boolean()),
    plus_one_attending: v.union(v.boolean(), v.null()),
    additional_guests: v.number(),
    additional_guest_names: v.union(v.array(v.string()), v.null()),
    plus_one_name: v.optional(v.union(v.string(), v.null())),
    email: v.string(),
    notes: v.union(v.string(), v.null()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('guest_rsvps', {
      ...args,
      primary_attending: args.primary_attending ?? true,
      plus_one_name: args.plus_one_name ?? null,
    });
  },
});
