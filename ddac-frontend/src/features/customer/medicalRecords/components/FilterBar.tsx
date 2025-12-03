import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortOrder: string;
  onSortChange: (value: string) => void;
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  sortOrder,
  onSortChange,
}: FilterBarProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="w-[80%] relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-4"
          style={{ color: "var(--text-muted)" }}
        />
        <Input
          type="text"
          placeholder="Search by Record ID or Appointment ID"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 bg-white border-[#DCEFFB] focus:ring-[#4EA5D9] focus:border-[#4EA5D9] rounded-xl"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--input-border)",
            color: "var(--text-body)",
          }}
        />
      </div>

      <div className="flex flex-1 items-center rounded-xl gap-2 bg-white">
        <Select value={sortOrder} onValueChange={onSortChange}>
          <SelectTrigger className="border-[#DCEFFB] focus:ring-[#4EA5D9] rounded-xl hover:bg-[#F5F7FA] cursor-pointer">
            <Filter className="w-1 h-4 text-[#4EA5D9]" />
            <SelectValue placeholder="Sort by Date" />
          </SelectTrigger>
          <SelectContent className="bg-white border-[#DCEFFB] rounded-xl" >
            <SelectItem
              className="hover:bg-[#F5F7FA] cursor-pointer"
              value="newest"
            >
              Newest First
            </SelectItem>
            <SelectItem
              className="hover:bg-[#F5F7FA] cursor-pointer"
              value="oldest"
            >
              Oldest First
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
