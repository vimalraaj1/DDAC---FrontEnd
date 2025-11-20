export function PageHeader() {
  return (
    <div
      className="px-6 py-12"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-[#1A1A1A] mb-2 font-bold">Payment History</h1>
        <p className="mt-2" style={{ color: "var(--text-body)" }}>
          Track and review your past payments and outstanding bills.
        </p>
      </div>
    </div>
  );
}
