const Input = ({ 
  label, 
  error, 
  className = '', 
  type = 'text',
  min,
  max,
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`
          w-full px-3 py-2 border rounded-lg transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${className}
        `}
        min={min}
        max={max}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}

export default Input
