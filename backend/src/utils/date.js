export const getTodayDateString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const formatDate = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};
