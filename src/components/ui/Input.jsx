export default function Input({ placeholder, type = "text" }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="w-full border p-2 rounded-lg"
    />
  );
}
