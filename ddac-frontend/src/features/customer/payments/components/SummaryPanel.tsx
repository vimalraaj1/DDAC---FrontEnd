import { DollarSign, AlertCircle, TrendingUp, FileText } from "lucide-react";

interface SummaryPanelProps {
  totalRecords: number;
  totalPaidThisYear: number;
  outstandingAmount: number;
}

export function SummaryPanel({
  totalRecords,
  totalPaidThisYear,
  outstandingAmount,
}: SummaryPanelProps) {
  return (
    <div className="space-y-4">
      {/* Total RecordsS */}
      <div
        className="p-6 rounded-xl shadow-sm border "
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--input-border)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#E8F6FD]"
          >
            <FileText
              className="w-5 h-5"
              style={{ color: "var(--btn-primary)" }}
            />
          </div>
          <div>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Total Records
            </p>
            <h3 style={{ color: "var(--btn-primary)" }}>{totalRecords}</h3>
          </div>
        </div>
      </div>
      {/* Total Paid This Year */}
      <div
        className="p-6 rounded-xl shadow-sm border"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--input-border)",
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "#e1f7e8" }}
          >
            <TrendingUp
              className="w-5 h-5"
              style={{ color: "var(--accent-success)" }}
            />
          </div>
          <div>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Total Paid This Year
            </p>
            <h3 style={{ color: "var(--accent-success)" }}>
              RM {totalPaidThisYear.toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      {/* Outstanding Amount */}
      <div
        className="p-6 rounded-xl shadow-sm border"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--input-border)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "#fdf0dd" }}
          >
            <DollarSign
              className="w-5 h-5"
              style={{ color: "var(--accent-warning)" }}
            />
          </div>
          <div>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Outstanding Amount
            </p>
            <h3 style={{ color: "var(--accent-warning)" }}>
              RM {outstandingAmount.toLocaleString()}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
