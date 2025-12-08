export type Guest = {
  id: string;
  full_name: string;
  email: string | null;
  guest_plus_one: string | null;
  invited_to_friday: boolean;
  invited_to_saturday: boolean;
};

