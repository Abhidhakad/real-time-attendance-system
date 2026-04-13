export const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const formatTime = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

export const formatDateTime = (date) => {
  if (!date) return ''
  return `${formatDate(date)} ${formatTime(date)}`
}

export const getTodayDateString = () => {
  return new Date().toISOString().split('T')[0]
}

export const getDateString = (date) => {
  return new Date(date).toISOString().split('T')[0]
}
