import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortOrder: string;
  onSortChange: (value: string) => void;
}

export function FilterBar({ searchQuery, onSearchChange, sortOrder, onSortChange }: FilterBarProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex-1 relative">
        <Search 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" 
          style={{ color: "var(--text-muted)" }}
        />
        <Input
          type="text"
          placeholder="Search by Record ID or Appointment ID"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 rounded-lg border"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--input-border)",
            color: "var(--text-body)"
          }}
        />
      </div>

      <div className="flex items-center gap-2">
        <SlidersHorizontal className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
        <Select value={sortOrder} onValueChange={onSortChange}>
          <SelectTrigger 
            className="w-48 rounded-lg border"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--input-border)",
              color: "var(--text-body)"
            }}
          >
            <SelectValue placeholder="Sort by Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
