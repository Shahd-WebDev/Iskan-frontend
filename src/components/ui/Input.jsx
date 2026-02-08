export default function Input({
  label,
  placeholder,
  type = "text",
  withIcon = false,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>

      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
        />

        {withIcon && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
            👁
          </span>
        )}
      </div>
    </div>
  );
}
