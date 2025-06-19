/**
 * Typography utilities following PRD specifications
 * Provides consistent font sizing and styling across the application
 */

export const typography = {
  // Headings
  heading1: 'text-[35px] font-medium leading-tight tracking-tight',
  heading2: 'text-[28px] font-medium leading-tight tracking-tight', 
  heading3: 'text-[24px] font-medium leading-snug',
  heading4: 'text-[20px] font-medium leading-snug',
  
  // Body text
  body: 'text-[18px] font-normal leading-relaxed',
  bodyMedium: 'text-[18px] font-medium leading-relaxed',
  
  // Labels
  label: 'text-[16px] font-medium leading-normal',
  labelNormal: 'text-[16px] font-normal leading-normal',
  
  // Captions
  caption: 'text-[14px] font-normal leading-normal',
  captionMedium: 'text-[14px] font-medium leading-normal',
  
  // Interactive elements
  button: 'text-[16px] font-medium leading-normal',
  input: 'text-[18px] font-normal leading-normal',
  
  // Military/tactical styling
  tactical: 'font-mono tracking-wider uppercase',
  classification: 'text-[14px] font-bold tracking-widest uppercase',
} as const

export type TypographyVariant = keyof typeof typography

/**
 * Get typography classes for a specific variant
 */
export function getTypography(variant: TypographyVariant): string {
  return typography[variant]
}

/**
 * Combine typography with custom classes
 */
export function combineTypography(variant: TypographyVariant, customClasses?: string): string {
  return customClasses ? `${typography[variant]} ${customClasses}` : typography[variant]
} 