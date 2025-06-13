export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const isDateInRange = (dateString, startDate, endDate) => {
  if (!startDate && !endDate) return true;
  
  const date = new Date(dateString);
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  
  if (start && end) {
    return date >= start && date <= end;
  } else if (start) {
    return date >= start;
  } else if (end) {
    return date <= end;
  }
  
  return true;
};

export const getTodaysDate = () => {
  return new Date().toISOString().split('T')[0];
};

export const getDateDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
};