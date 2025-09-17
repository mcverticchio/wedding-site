import { z } from 'zod';

/**
 * Validation schema for RSVP form submission
 */
export const rsvpSchema = z.object({
  full_name: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .trim(),

  email: z
    .string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),

  attending: z
    .enum(['yes', 'no'], {
      required_error: 'Please select whether you will be attending',
    }),

  guest_names: z
    .array(
      z
        .string()
        .min(1, 'Guest name cannot be empty')
        .min(2, 'Guest name must be at least 2 characters')
        .max(100, 'Guest name must be less than 100 characters')
        .trim()
    )
    .optional(),

  notes: z
    .string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional()
    .or(z.literal('')),
});

/**
 * TypeScript type inferred from the Zod schema
 */
export type RsvpFormData = z.infer<typeof rsvpSchema>;

/**
 * Validation result type with field-specific errors
 */
export type FieldErrors = {
  [K in keyof RsvpFormData]?: string;
} & {
  guest_0?: string;
  guest_1?: string;
  guest_2?: string;
};

/**
 * Validate RSVP form data and return formatted errors
 */
export function validateRsvpForm(
  formData: FormData,
  guestCount: number
): { success: true; data: RsvpFormData } | { success: false; errors: FieldErrors } {
  const full_name = String(formData.get('full_name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const attending = String(formData.get('attending') || '');
  const notes = String(formData.get('notes') || '').trim();

  // Validate each field individually first for better error handling
  const fieldErrors: FieldErrors = {};

  // Validate full name
  try {
    rsvpSchema.shape.full_name.parse(full_name);
  } catch (error) {
    if (error instanceof z.ZodError) {
      fieldErrors.full_name = error.errors[0]?.message;
    }
  }

  // Validate email
  if (email) {
    try {
      rsvpSchema.shape.email.parse(email);
    } catch (error) {
      if (error instanceof z.ZodError) {
        fieldErrors.email = error.errors[0]?.message;
      }
    }
  }

  // Validate attending
  try {
    rsvpSchema.shape.attending.parse(attending);
  } catch (error) {
    if (error instanceof z.ZodError) {
      fieldErrors.attending = error.errors[0]?.message;
    }
  }

  // Validate notes
  if (notes) {
    try {
      rsvpSchema.shape.notes.parse(notes);
    } catch (error) {
      if (error instanceof z.ZodError) {
        fieldErrors.notes = error.errors[0]?.message;
      }
    }
  }

  // Validate guest names individually
  const guest_names: string[] = [];
  for (let i = 0; i < guestCount; i++) {
    const guestName = String(formData.get(`guest_${i}`) || '').trim();

    // If there's a guest input field, it should be validated
    if (guestName.length > 0) {
      try {
        // Validate the guest name
        z.string()
          .min(2, 'Guest name must be at least 2 characters')
          .max(100, 'Guest name must be less than 100 characters')
          .parse(guestName);
        guest_names.push(guestName);
      } catch (error) {
        if (error instanceof z.ZodError) {
          fieldErrors[`guest_${i}` as keyof FieldErrors] = error.errors[0]?.message;
        }
      }
    } else if (guestCount > i) {
      // If guest field exists but is empty, that's an error
      fieldErrors[`guest_${i}` as keyof FieldErrors] = 'Guest name is required';
    }
  }

  // If there are any field errors, return them
  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, errors: fieldErrors };
  }

  // If validation passes, create the data object
  const data = {
    full_name,
    email: email || undefined,
    attending: attending as 'yes' | 'no',
    guest_names: guest_names.length > 0 ? guest_names : undefined,
    notes: notes || undefined,
  };

  return { success: true, data };
}