import type { Id } from '../../convex/_generated/dataModel';

export type Guest = {
  _id: Id<'guests'>;
  _creationTime: number;
  full_name: string;
  email: string | null;
  guest_plus_one: string | null;
  invited_to_friday: boolean;
  invited_to_saturday: boolean;
};
