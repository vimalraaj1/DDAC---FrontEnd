import { Eye } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

export interface MedicalRecord {
  id: string;
  type: string;
  date: string;
  doctor: string;
  department: string;
  status: "Normal" | "Abnormal" | "Completed" | "Active" | "Pending";
}

interface RecordsTableProps {
  records: MedicalRecord[];
  onViewRecord: (record: MedicalRecord) => void;
}

export function RecordsTable({ records, onViewRecord }: RecordsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Normal":
      case "Completed":
        return { bg: '#d4f4dd', text: 'var(--healthcare-success)' };
      case "Abnormal":
        return { bg: '#fde2e2', text: 'var(--healthcare-danger)' };
      case "Pending":
      case "Active":
        return { bg: '#fef3cd', text: 'var(--healthcare-warning)' };
      default:
        return { bg: 'var(--healthcare-bg-blue)', text: 'var(--healthcare-primary)' };
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: '2px solid #DCEFFB' }}>
            <th className="text-left py-4 px-4" style={{ color: '#3D3D3D' }}>
              Record Type
            </th>
            <th className="text-left py-4 px-4" style={{ color: '#3D3D3D' }}>
              Date
            </th>
            <th className="text-left py-4 px-4" style={{ color: '#3D3D3D' }}>
              Doctor's Name
            </th>
            <th className="text-left py-4 px-4" style={{ color: '#3D3D3D' }}>
              Department
            </th>
            <th className="text-left py-4 px-4" style={{ color: '#3D3D3D' }}>
              Status
            </th>
            <th className="text-left py-4 px-4" style={{ color: '#3D3D3D' }}>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => {
            const statusColor = getStatusColor(record.status);
            return (
              <tr 
                key={record.id}
                className="border-b transition-colors hover:bg-opacity-50"
                style={{ 
                  borderColor: '#DCEFFB',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#dcf0fc';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <td className="py-4 px-4" style={{ color: '#1A1A1A' }}>
                  {record.type}
                </td>
                <td className="py-4 px-4" style={{ color: '#3D3D3D' }}>
                  {record.date}
                </td>
                <td className="py-4 px-4" style={{ color: '#3D3D3D' }}>
                  {record.doctor}
                </td>
                <td className="py-4 px-4" style={{ color: '#3D3D3D' }}>
                  {record.department}
                </td>
                <td className="py-4 px-4">
                  <Badge 
                    className="rounded-full px-3 py-1 border-0"
                    style={{ 
                      backgroundColor: statusColor.bg, 
                      color: statusColor.text
                    }}
                  >
                    {record.status}
                  </Badge>
                </td>
                <td className="py-4 px-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onViewRecord(record)}
                    className="rounded-lg hover:opacity-[50%] bg-[#4EA5D9] cursor-pointer text-white"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Record
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
