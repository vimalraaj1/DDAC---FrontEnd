import { useContext, useEffect, useState } from "react";
import { FilterBar } from "./components/FilterBar";
import {
  MedicalRecordCard,
  MedicalRecord,
  Medication,
} from "./components/MedicalRecordCard";
import Layout from "../../../components/Layout";
import { getConsultationsByPatientId } from "../../../services/consultationManagementService";
import { formatDate } from "../../../../../utils/DateConversion";
import { toast, Toaster } from "sonner";
import { CustomerContext } from "../CustomerContext";

export default function App() {
  const { patient, loading } = useContext(CustomerContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);

  useEffect(() => {
    fetchMedicalRecordsFromDB(patient.id);
    toast.success("Medical Records retrieved!", {
      style: {
        background: "#2ECC71",
        color: "#ffffff",
        borderRadius: "10px",
      },
    });
  }, []);

  const fetchMedicalRecordsFromDB = async (patientId: string) => {
    setIsLoadingRecords(true);
    try {
      const datas = await getConsultationsByPatientId(patientId);

      const formattedRecords = datas.map((d: any) => ({
        id: d.id,
        appointmentId: d.appointmentId,
        appointmentDate: formatDate(d.appointmentDate),
        appointmentTime: d.appointmentTime,
        doctorName: d.doctorFirstName + " " + d.doctorLastName,
        feedbackNotes: d.feedbackNotes,
        prescriptions: convertToPrescriptions(d.prescriptionNotes),
      }));

      setMedicalRecords(formattedRecords);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong!", {
        style: {
          background: "var(--accent-danger)",
          color: "#ffffff",
          borderRadius: "10px",
        },
      });
    } finally {
      setIsLoadingRecords(false);
    }
  };

  const convertToPrescriptions = (raw: string): Medication[] => {
    return raw.split(" | ").map((p) => {
      const parts = p.split(", ").map((x) => x.trim());

      const nameAndDosage = parts[0]; // "Atorvastatin 20mg"
      const instructions = parts[1] || ""; // "1 tablet after dinner"
      const duration = parts[2] || ""; // "30 days"

      // if you want to split name and dosage
      const [name, dosage] =
        nameAndDosage.split(" ").length > 1
          ? [
              nameAndDosage.split(" ").slice(0, -1).join(" "), // "Atorvastatin"
              nameAndDosage.split(" ").slice(-1)[0], // "20mg"
            ]
          : [nameAndDosage, ""];

      return {
        name,
        dosage,
        instructions,
        duration,
      };
    });
  };

  // Filter and sort records
  const filteredRecords = medicalRecords
    .filter((record) => {
      const search = searchQuery.toLowerCase();
      return (
        record.id.toLowerCase().includes(search) ||
        record.appointmentId.toLowerCase().includes(search)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.appointmentDate);
      const dateB = new Date(b.appointmentDate);
      return sortOrder === "newest"
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
    });

  return (
    <Layout role="customer">
      <div
        className="flex min-h-screen"
        style={{ backgroundColor: "var(--bg-main)" }}
      >
        <div className="flex-1 flex flex-col">
          <main className="flex-1 px-8 ">
            <div className="max-w-4xl mx-auto ">
              <div className="bg-[#dcf0fc] rounded-2xl pt-8 pb-4 px-8 mb-8">
                <div className="mb-6 ">
                  <p style={{ color: "var(--text-muted)" }}>
                    View and manage all your medical records and prescriptions
                  </p>
                </div>

                <FilterBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  sortOrder={sortOrder}
                  onSortChange={setSortOrder}
                />
              </div>

              <div className="space-y-6">
                {isLoadingRecords ? (
                  <div className="bg-white rounded-2xl p-12 text-center border border-[#DCEFFB]">
                    <p className="text-[#7A7A7A]">
                      Retrieving medical records...
                    </p>
                  </div>
                ) : filteredRecords && filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <MedicalRecordCard key={record.id} record={record} />
                  ))
                ) : (
                  <div
                    className="text-center py-16 rounded-xl"
                    style={{ backgroundColor: "var(--bg-card)" }}
                  >
                    <p style={{ color: "var(--text-muted)" }}>
                      No medical records found matching your search.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>

      </div>
    </Layout>
  );
}
