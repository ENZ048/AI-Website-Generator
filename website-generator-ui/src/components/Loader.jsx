

export default function Loader({ label = "Loading..." }) {
  return (
    <div className="flex items-center justify-center p-5 text-slate-500">
      <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600"></div>
      {label}
    </div>
  );
}
