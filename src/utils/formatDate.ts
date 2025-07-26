export const formatDate = (date: Date | string | undefined): string => {
  if (!date) return '';
  
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};
