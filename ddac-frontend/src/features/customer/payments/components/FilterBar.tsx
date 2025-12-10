import { useState } from "react";
import { Search, Calendar } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

interface FilterBarProps {
  onFilter: (filters: {
    startDate: string;
    endDate:string;
    status: string;
    search: string;
  }) => void;
}

export function FilterBar({ onFilter }: FilterBarProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  const handleFilter = () => {
    onFilter({ startDate, endDate, status, search });
  };

  return (
    <div className="px-6 pt-10 pb-4 -mt-6 relative z-10">
      <div className="max-w-8xl mx-auto">
        <div
          className="p-6 rounded-xl shadow-sm border"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--input-border)",
          }}
        >
          <div className="flex flex-nowrap items-center gap-4">
            {/* Date Range Picker */}
            <div>
              <label
                className="block mb-2 text-sm"
                style={{ color: "var(--text-body)" }}
              >
                Date Range
              </label>

              <div className="flex items-center gap-3">
                {/* Start Date */}
                <div className="relative w-full">
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      const newStart = e.target.value;
                      setStartDate(newStart);

                      // If endDate is earlier, automatically fix it
                      if (endDate && endDate < newStart) {
                        setEndDate(newStart);
                      }
                    }}
                    style={{ borderColor: "var(--input-border)" }}
                  />
                </div>

                <span
                  className="text-lg"
                  style={{ color: "var(--text-muted)" }}
                >
                  –
                </span>

                {/* End Date */}
                <div className="relative w-full ">
                  <Input
                    type="date"
                    value={endDate}
                    min={startDate || undefined} // Disable earlier dates
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{ borderColor: "var(--input-border)" }}
                  />
                </div>
              </div>
            </div>

            {/* Payment Status Dropdown */}
            <div className="w-[20%] mx-5">
              <label
                className="block mb-2 text-sm"
              >
                Payment Status
              </label>

              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="border-[#DCEFFB] focus:ring-[#4EA5D9] rounded-xl hover:bg-[#F5F7FA] cursor-pointer">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#DCEFFB] rounded-xl ">
                  <SelectItem
                    value="all"
                    className="hover:bg-[#F5F7FA] cursor-pointer"
                  >
                    All Status
                  </SelectItem>
                  <SelectItem
                    value="Succeed"
                    className="hover:bg-[#F5F7FA] cursor-pointer"
                  >
                    Succeed
                  </SelectItem>
                  <SelectItem
                    value="Pending"
                    className="hover:bg-[#F5F7FA] cursor-pointer"
                  >
                    Pending
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Input */}
            <div>
              <label
                className="block mb-2 text-sm"
                style={{ color: "var(--text-body)" }}
              >
                Search
              </label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Bill ID or service..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                  style={{ borderColor: "var(--input-border)" }}
                />
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: "var(--text-muted)" }}
                />
              </div>
            </div>

            {/* Filter Button */}
            <div className="flex items-end mx-5">
              <Button
                onClick={handleFilter}
                className="w-[100%] hover:opacity-[50%] cursor-pointer"
                style={{
                  backgroundColor: "var(--btn-primary)",
                  color: "var(--text-on-dark)",
                }}
              >
                Filter
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
