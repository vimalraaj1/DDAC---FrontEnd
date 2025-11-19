import { X, Download } from "lucide-react";
import { Button } from "../../components/ui/button";
import { MedicalRecord } from "./RecordsTable";

interface RecordDetailDrawerProps {
  record: MedicalRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RecordDetailDrawer({ record, isOpen, onClose }: RecordDetailDrawerProps) {
  if (!isOpen || !record) return null;

  // Mock detailed data based on record type
  const getRecordDetails = () => {
    if (record.type.includes("Blood Test") || record.type.includes("Lab")) {
      return {
        title: record.type,
        sections: [
          {
            heading: "Test Results",
            items: [
              { label: "White Blood Cells", value: "7.5 × 10³/μL", range: "4.5-11.0 × 10³/μL", status: "Normal" },
              { label: "Red Blood Cells", value: "4.8 × 10⁶/μL", range: "4.5-5.5 × 10⁶/μL", status: "Normal" },
              { label: "Hemoglobin", value: "14.2 g/dL", range: "12.0-16.0 g/dL", status: "Normal" },
              { label: "Platelets", value: "220 × 10³/μL", range: "150-400 × 10³/μL", status: "Normal" }
            ]
          },
          {
            heading: "Notes",
            content: "All blood count values are within normal range. No abnormalities detected. Continue with regular health maintenance.",
            status:"",
          }
        ]
      };
    } else if (record.type.includes("X-Ray") || record.type.includes("MRI")) {
      return {
        title: record.type,
        sections: [
          {
            heading: "Imaging Findings",
            content: "No acute findings. Bone structure appears normal with no signs of fracture or dislocation. Soft tissue is unremarkable.",
            status:"",
          },
          {
            heading: "Radiologist Notes",
            content: "Quality: Good. Technique: Standard AP and lateral views obtained. Impression: Normal chest radiograph.",
            status:"",
          }
        ]
      };
    } else if (record.type.includes("Prescription")) {
      return {
        title: record.type,
        sections: [
          {
            heading: "Medication Details",
            items: [
              { label: "Medication", value: "Amoxicillin 500mg" },
              { label: "Dosage", value: "Take 1 capsule 3 times daily" },
              { label: "Duration", value: "7 days" },
              { label: "Refills", value: "0" }
            ]
          },
          {
            heading: "Instructions",
            content: "Take with food. Complete the full course even if symptoms improve. Avoid alcohol while taking this medication."
          }
        ]
      };
    }

    return {
      title: record.type,
      sections: [
        {
          heading: "Record Information",
          content: "Detailed information about this medical record will be displayed here."
        }
      ]
    };
  };

  const details = getRecordDetails();

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        className="fixed top-0 right-0 h-full w-full sm:w-[500px] shadow-2xl z-50 overflow-y-auto"
        style={{ backgroundColor: '#ffff' }}
      >
        {/* Header */}
        <div 
          className="sticky top-0 z-10 px-6 py-5 border-b"
          style={{ 
            backgroundColor: '#FAFCFF',
            borderColor: '#DCEFFB'
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="font-medium mb-1" style={{ color: '#1A1A1A' }}>
                {details.title}
              </h2>
              <p className="text-sm" style={{ color: '#7A7A7A' }}>
                {record.date} • {record.doctor}
              </p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 rounded-lg hover:opacity-[50%] cursor-pointer transition-colors"
              style={{ backgroundColor: '#dcf0fc' }}
            >
              <X className="w-5 h-5" style={{ color: '#7A7A7A' }} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Record Info */}
          <div 
            className="p-4 rounded-lg"
            style={{ backgroundColor: 'var(--healthcare-bg-main)' }}
          >
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: '#7A7A7A' }}>Department:</span>
                <span style={{ color: '#1A1A1A' }}>{record.department}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#7A7A7A' }}>Status:</span>
                <span style={{ color: '#1A1A1A' }}>{record.status}</span>
              </div>
            </div>
          </div>

          {/* Dynamic Sections */}
          {details.sections.map((section, index) => (
            <div key={index}>
              <h3 className="mb-3" style={{ color: '#1A1A1A' }}>
                {section.heading}
              </h3>
              
              {section.items ? (
                <div className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <div 
                      key={itemIndex}
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: '#F5F7FA' }}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm" style={{ color: '#7A7A7A' }}>
                          {item.label}
                        </span>
                        
                        { "status" in item && item.status && (
                          <span 
                            className="text-xs px-2 py-1 rounded-full"
                            style={{ 
                              backgroundColor: item.status === 'Normal' ? '#d4f4dd' : '#fde2e2',
                              color: item.status === 'Normal' ? '#2ECC7' : '#E74C3C'
                            }}
                          >
                            {item.status}
                          </span>
                        )}
                      </div>
                      <div className="font-medium" style={{ color: '#1A1A1A' }}>
                        {item.value}
                      </div>
                      {"range" in item && item.range && (
                        <div className="text-xs mt-1" style={{ color: '#7A7A7A' }}>
                          Reference range: {item.range}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p 
                  className="p-4 rounded-lg leading-relaxed"
                  style={{ 
                    backgroundColor: '#F5F7FA',
                    color: '#3D3D3D'
                  }}
                >
                  {section.content}
                </p>
              )}
            </div>
          ))}

          {/* Download Button */}
          <Button
            className="w-full rounded-lg cursor-pointer hover:opacity-[50%]"
            style={{ 
              backgroundColor: '#4EA5D9',
              color: 'white'
            }}
            onClick={() => alert('Downloading PDF...')}
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF Report
          </Button>
        </div>
      </div>
    </>
  );
}
