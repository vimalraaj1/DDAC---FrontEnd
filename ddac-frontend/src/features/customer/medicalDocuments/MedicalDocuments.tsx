import { useContext, useEffect, useState } from "react";
import { Search, Plus, FileText, Loader2 } from "lucide-react";
import { CustomerContext } from "../CustomerContext"; // Verify path
import Layout from "../../../components/Layout"; // Verify path
import FadeInSection from "../components/animations/FadeInSection"; // Verify path
import { Input } from "../components/ui/input"; // Verify path
import { Button } from "../components/ui/button"; // Verify path
import { toast } from "sonner";
import LoadingSpinner from "../components/LoadingSpinner"; // Verify path
import { DocumentCard } from "./DocumentCard";
import { UploadDocumentModal } from "./UploadDocumenModal";
import { EditDocumentModal } from "./EditDocumentModal";
import { DeleteDocumentDialog } from "./DeleteDocumentDialog";
// Import your service (Ensure these export names match your file)
import {
    getMedicalDocumentByPatientId,
    deleteMedicalDocument
} from "../../../services/medicalDocumentManagementService";

export interface MedicalDocument {
    id: string;
    patientId: string;
    fileName: string;
    fileDescription: string;
    uploadedDate: string;
    filePathUrl?: string;
}

export default function MedicalDocuments() {
    const { patient, loading } = useContext(CustomerContext);
    const [documents, setDocuments] = useState<MedicalDocument[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    // Modal States
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<MedicalDocument | null>(null);

    // Loading States
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        if (patient?.id) {
            fetchDocuments();
        }
    }, [patient?.id]);

    const fetchDocuments = async () => {
        try {
            setFetching(true);
            const data = await getMedicalDocumentByPatientId(patient.id);
            // Ensure data is an array
            setDocuments(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load documents");
        } finally {
            setFetching(false);
        }
    };

    const handleDeleteClick = (doc: MedicalDocument) => {
        setSelectedDoc(doc);
        setDeleteDialogOpen(true);
    };

    const handleEditClick = (doc: MedicalDocument) => {
        setSelectedDoc(doc);
        setEditModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedDoc) return;
        try {
            await deleteMedicalDocument(selectedDoc.id);
            toast.success("Document deleted successfully");
            setDocuments(prev => prev.filter(d => d.id !== selectedDoc.id));
            setDeleteDialogOpen(false);
        } catch (err) {
            toast.error("Failed to delete document");
        }
    };

    // Filter documents
    const filteredDocs = documents.filter(doc =>
        doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.fileDescription && doc.fileDescription.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading) return <LoadingSpinner />;

    return (
        <Layout role="customer">
            <div className="min-h-screen">
                <div className="max-w-4xl mx-auto mb-8">
                    {/* Header Section */}
                    <div className="bg-[#dcf0fc] rounded-2xl p-8 mb-8">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h1 className="text-[#1A1A1A] mb-2 text-2xl font-bold">Medical Documents</h1>
                                <p className="text-[#7A7A7A]">
                                    Securely manage and view your uploaded medical records
                                </p>
                            </div>
                            <Button
                                onClick={() => setUploadModalOpen(true)}
                                className="bg-[#4EA5D9] hover:bg-[#3f93c4] text-white rounded-xl flex items-center gap-2 shadow-md"
                            >
                                <Plus className="h-4 w-4" />
                                Upload Document
                            </Button>
                        </div>

                        {/* Search Bar */}
                        <div className="relative mt-6">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#7A7A7A]" />
                            <Input
                                type="text"
                                placeholder="Search by file name or description"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 bg-white border-[#DCEFFB] focus:ring-[#4EA5D9] focus:border-[#4EA5D9] rounded-xl"
                            />
                        </div>
                    </div>

                    {/* Content Section */}
                    <FadeInSection>
                        {fetching ? (
                            <div className="bg-white rounded-2xl p-12 text-center border border-[#DCEFFB]">
                                <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#4EA5D9] mb-4" />
                                <p className="text-[#7A7A7A]">Retrieving documents...</p>
                            </div>
                        ) : filteredDocs.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredDocs.map((doc) => (
                                    <DocumentCard
                                        key={doc.id}
                                        document={doc}
                                        onEdit={() => handleEditClick(doc)}
                                        onDelete={() => handleDeleteClick(doc)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl p-12 text-center border border-[#DCEFFB] flex flex-col items-center">
                                <div className="bg-[#f0f9ff] p-4 rounded-full mb-4">
                                    <FileText className="h-8 w-8 text-[#4EA5D9]" />
                                </div>
                                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">No documents found</h3>
                                <p className="text-[#7A7A7A]">
                                    Upload your prescriptions, reports, or X-rays to keep them safe.
                                </p>
                            </div>
                        )}
                    </FadeInSection>
                </div>

                {/* Modals */}
                <UploadDocumentModal
                    open={uploadModalOpen}
                    onOpenChange={setUploadModalOpen}
                    onSuccess={fetchDocuments}
                    patientId={patient?.id}
                />

                <EditDocumentModal
                    open={editModalOpen}
                    onOpenChange={setEditModalOpen}
                    document={selectedDoc}
                    onSuccess={fetchDocuments}
                />

                <DeleteDocumentDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    onConfirm={handleConfirmDelete}
                />
            </div>
        </Layout>
    );
}