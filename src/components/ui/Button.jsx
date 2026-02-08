export default function Button({ text }) {
  return (
    <button className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
      {text}
    </button>
  );
}
