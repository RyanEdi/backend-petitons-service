export const sanitizeText = (value: string | undefined | null): string => {
  return (value || '').trim();
};
