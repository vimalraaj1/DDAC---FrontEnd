export function PageHeader() {
  return (
    <div
      className="px-10 py-10"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      <div className="max-w-7xl mx-auto ">
        <h1 className="text-[#1A1A1A] mb-2 font-bold text-2xl">Payment Records</h1>
        <p className="mt-2" style={{ color: "var(--text-body)" }}>
          View and manage your payment history and receipts.
        </p>
      </div>
    </div>
  );
}
