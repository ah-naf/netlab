import ConnectionIndicator from "./components/ConnectionIndicator";

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-gray-200 px-4 py-2">
        <span className="font-semibold">NetLab</span>
        <ConnectionIndicator />
      </header>
      <main />
    </div>
  );
}
