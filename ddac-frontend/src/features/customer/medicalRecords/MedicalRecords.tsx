import { useState } from "react";
import {
  Search,
  FileText,
  Pill,
  Activity,
  Image as ImageIcon,
  Filter,
} from "lucide-react";
import { PatientNav } from "./components/PatientNav";
import { SummaryCard } from "./components/SummaryCard";
import { RecordsTable, MedicalRecord } from "./components/RecordsTable";
import { RecordDetailDrawer } from "./components/RecordDetailDrawer";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Button } from "../components/ui/button";
import CustNavBar from "../components/CustNavBar";
import FadeInSection from "../components/animations/FadeInSection";
import Layout from "../../../components/Layout";

// Mock data for medical records
const mockRecords: MedicalRecord[] = [
  {
    id: "1",
    type: "Blood Test - CBC",
    date: "Nov 15, 2025",
    doctor: "Dr. Emily Carter",
    department: "Laboratory",
    status: "Normal",
  },
  {
    id: "2",
    type: "Prescription - Amoxicillin",
    date: "Nov 12, 2025",
    doctor: "Dr. Michael Roberts",
    department: "General Medicine",
    status: "Active",
  },
  {
    id: "3",
    type: "X-Ray - Chest",
    date: "Nov 10, 2025",
    doctor: "Dr. Sarah Williams",
    department: "Radiology",
    status: "Completed",
  },
  {
    id: "4",
    type: "Blood Test - Lipid Panel",
    date: "Nov 8, 2025",
    doctor: "Dr. Emily Carter",
    department: "Laboratory",
    status: "Abnormal",
  },
  {
    id: "5",
    type: "MRI - Brain",
    date: "Nov 5, 2025",
    doctor: "Dr. James Anderson",
    department: "Radiology",
    status: "Normal",
  },
  {
    id: "6",
    type: "Prescription - Lisinopril",
    date: "Nov 1, 2025",
    doctor: "Dr. Michael Roberts",
    department: "Cardiology",
    status: "Active",
  },
  {
    id: "7",
    type: "Blood Test - Thyroid Panel",
    date: "Oct 28, 2025",
    doctor: "Dr. Emily Carter",
    department: "Laboratory",
    status: "Pending",
  },
  {
    id: "8",
    type: "Ultrasound - Abdomen",
    date: "Oct 25, 2025",
    doctor: "Dr. Sarah Williams",
    department: "Radiology",
    status: "Completed",
  },
];

export default function MedicalRecords() {
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(
    null
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [recordTypeFilter, setRecordTypeFilter] = useState("all");
  const [dateRangeFilter, setDateRangeFilter] = useState("all");

  const handleViewRecord = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedRecord(null), 300);
  };

  // Filter records based on search and filters
  const filteredRecords = mockRecords.filter((record) => {
    const matchesSearch =
      searchQuery === "" ||
      record.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      recordTypeFilter === "all" ||
      (recordTypeFilter === "lab" && record.type.includes("Blood Test")) ||
      (recordTypeFilter === "prescriptions" &&
        record.type.includes("Prescription")) ||
      (recordTypeFilter === "diagnoses" &&
        record.department === "General Medicine") ||
      (recordTypeFilter === "radiology" &&
        (record.type.includes("X-Ray") ||
          record.type.includes("MRI") ||
          record.type.includes("Ultrasound")));

    return matchesSearch && matchesType;
  });

  // Calculate summary statistics
  const labResultsCount = mockRecords.filter((r) =>
    r.type.includes("Blood Test")
  ).length;
  const prescriptionsCount = mockRecords.filter(
    (r) => r.type.includes("Prescription") && r.status === "Active"
  ).length;
  const diagnosesCount = mockRecords.filter(
    (r) => r.department === "General Medicine"
  ).length;
  const radiologyCount = mockRecords.filter(
    (r) =>
      r.type.includes("X-Ray") ||
      r.type.includes("MRI") ||
      r.type.includes("Ultrasound")
  ).length;

  return (
    <Layout role="customer">
      <div
        className="min-h-screen"
      >
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          {/* Page Header */}
          <div className="p-8 rounded-xl mb-6 mt-0 shadow-sm">
            <h1 className="mb-2 font-semibold">My Medical Records</h1>
            <p className="color-[#7A7A7A]">
              View your diagnoses, lab results, prescriptions, and visit history
              all in one place.
            </p>
          </div>

          {/* Search + Filter Bar */}
          <div className="p-6 rounded-xl mb-6 shadow-sm bg-[#dcf0fc]">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Search Input */}
              <div className="md:col-span-5 relative bg-white">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 " />
                <Input
                  placeholder="Search records, keywords, or hospital visits..."
                  className="pl-10 rounded-lg border-0 bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Record Type Dropdown */}
              <div className="md:col-span-3 bg-white">
                <Select
                  value={recordTypeFilter}
                  onValueChange={setRecordTypeFilter}
                >
                  <SelectTrigger className="border-[#DCEFFB] focus:ring-[#4EA5D9] rounded-xl hover:bg-[#F5F7FA] cursor-pointer">
                    <SelectValue placeholder="Record Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#DCEFFB] rounded-xl">
                    <SelectItem
                      className="hover:bg-[#F5F7FA] cursor-pointer"
                      value="all"
                    >
                      All Records
                    </SelectItem>
                    <SelectItem
                      className="hover:bg-[#F5F7FA] cursor-pointer"
                      value="lab"
                    >
                      Lab Results
                    </SelectItem>
                    <SelectItem
                      className="hover:bg-[#F5F7FA] cursor-pointer"
                      value="prescriptions"
                    >
                      Prescriptions
                    </SelectItem>
                    <SelectItem
                      className="hover:bg-[#F5F7FA] cursor-pointer"
                      value="diagnoses"
                    >
                      Diagnoses
                    </SelectItem>
                    <SelectItem
                      className="hover:bg-[#F5F7FA] cursor-pointer"
                      value="radiology"
                    >
                      Radiology
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range Dropdown */}
              <div className="md:col-span-3 bg-white">
                <Select
                  value={dateRangeFilter}
                  onValueChange={setDateRangeFilter}
                >
                  <SelectTrigger className="border-[#DCEFFB] focus:ring-[#4EA5D9] rounded-xl hover:bg-[#F5F7FA] cursor-pointer">
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#DCEFFB] rounded-xl">
                    <SelectItem
                      className="hover:bg-[#F5F7FA] cursor-pointer"
                      value="all"
                    >
                      All Time
                    </SelectItem>
                    <SelectItem
                      className="hover:bg-[#F5F7FA] cursor-pointer"
                      value="week"
                    >
                      Last Week
                    </SelectItem>
                    <SelectItem
                      className="hover:bg-[#F5F7FA] cursor-pointer"
                      value="month"
                    >
                      Last Month
                    </SelectItem>
                    <SelectItem
                      className="hover:bg-[#F5F7FA] cursor-pointer"
                      value="3months"
                    >
                      Last 3 Months
                    </SelectItem>
                    <SelectItem
                      className="hover:bg-[#F5F7FA] cursor-pointer"
                      value="year"
                    >
                      Last Year
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filter Button */}
              <div className="md:col-span-1">
                <Button
                  className="w-full rounded-lg"
                  style={{
                    backgroundColor: "var(--healthcare-primary)",
                    color: "white",
                  }}
                >
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <FadeInSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <SummaryCard
                icon={FileText}
                value={labResultsCount}
                label="Lab Results"
                iconColor="#3f93c4"
              />
              <SummaryCard
                icon={Pill}
                value={prescriptionsCount}
                label="Active Prescriptions"
                iconColor="#45AAB8"
              />
              <SummaryCard
                icon={Activity}
                value={diagnosesCount}
                label="Diagnoses"
                iconColor="#2ECC71"
              />
              <SummaryCard
                icon={ImageIcon}
                value={radiologyCount}
                label="Radiology Reports"
                iconColor="#F39C12"
              />
            </div>
          </FadeInSection>

          {/* Records Table */}
          <FadeInSection delay={0.6}>
            <div
              className="rounded-xl shadow-sm overflow-hidden"
              style={{ backgroundColor: "var(--healthcare-bg-white)" }}
            >
              <div
                className="p-6 border-b"
                style={{ borderColor: "var(--healthcare-border)" }}
              >
                <h1 className="font-extrabold">Medical Records</h1>
                <p
                  className="text-sm mt-1"
                  style={{ color: "var(--healthcare-text-light)" }}
                >
                  {filteredRecords.length}{" "}
                  {filteredRecords.length === 1 ? "record" : "records"} found
                </p>
              </div>

              <RecordsTable
                records={filteredRecords}
                onViewRecord={handleViewRecord}
              />
            </div>
          </FadeInSection>
        </main>

        {/* Record Detail Drawer */}
        <RecordDetailDrawer
          record={selectedRecord}
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
        />
      </div>
    </Layout>
  );
}
