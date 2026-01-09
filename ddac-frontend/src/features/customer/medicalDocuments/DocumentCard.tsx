import { FileText, Calendar, Edit2, Trash2, Download } from "lucide-react";
import { Button } from "../components/ui/button";
import { MedicalDocument } from "./MedicalDocuments";

interface DocumentCardProps {
    document: MedicalDocument;
    onEdit: () => void;
    onDelete: () => void;
}

export function DocumentCard({ document, onEdit, onDelete }: DocumentCardProps) {
    return (
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                    <div className="bg-[#F1F5F9] p-3 rounded-xl">
                        <FileText className="h-6 w-6 text-[#4EA5D9]" />
                    </div>
                    <div className="overflow-hidden">
                        <h3 className="font-semibold text-[#1A1A1A] truncate w-full" title={document.fileName}>
                            {document.fileName}
                        </h3>
                        <p className="text-sm text-[#7A7A7A] mt-1 line-clamp-2">
                            {document.fileDescription || "No description"}
                        </p>

                        <div className="flex items-center gap-2 mt-3 text-xs text-[#94A3B8]">
                            <Calendar className="h-3 w-3" />
                            <span>Uploaded on {new Date(document.uploadedDate).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#F1F5F9]">
                {/* View/Download Button */}
                <Button
                    variant="outline"
                    className="flex-1 h-9 text-xs border-[#E2E8F0] text-[#1A1A1A] hover:bg-[#F8FAFC] hover:border-[#BBD7EE] hover:cursor-pointer"
                    onClick={() => {
                        if(document.filePathUrl) window.open(document.filePathUrl, '_blank');
                        else alert("File URL not available yet");
                    }}
                >
                    <Download className="h-3 w-3 mr-2" />
                    View
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-[#64748B] hover:text-[#4EA5D9] hover:bg-[#F0F9FF] hover:cursor-pointer"
                    onClick={onEdit}
                >
                    <Edit2 className="h-4 w-4" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-[#64748B] hover:text-[#EF4444] hover:bg-[#FEF2F2] hover:cursor-pointer"
                    onClick={onDelete}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}