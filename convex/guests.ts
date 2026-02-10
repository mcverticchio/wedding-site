import { v } from 'convex/values';
import { query } from './_generated/server';

export const search = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const { searchTerm } = args;
    if (!searchTerm.trim()) return [];

    const results = await ctx.db
      .query('guests')
      .withSearchIndex('search_name', (q) => q.search('searchText', searchTerm))
      .take(10);

    // Strip the internal searchText field from results
    return results.map(({ searchText, ...guest }) => guest);
  },
});
