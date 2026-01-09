import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateMedicalDocument } from "../../../services/medicalDocumentManagementService";
import { MedicalDocument } from "./MedicalDocuments";

interface EditModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    document: MedicalDocument | null;
    onSuccess: () => void;
}

export function EditDocumentModal({ open, onOpenChange, document, onSuccess }: EditModalProps) {
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (document) {
            setFileName(document.fileName);
            setDescription(document.fileDescription || "");
        }
    }, [document]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!document) return;

        setLoading(true);
        try {
            // Adjust payload based on what your backend expects
            const payload = {
                id: document.id,
                fileName,
                fileDescription: description,
                patientId: document.patientId
            };

            await updateMedicalDocument(document.id, payload);

            toast.success("Document updated");
            onSuccess();
            onOpenChange(false);
        } catch (err) {
            toast.error("Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Edit Document</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    <div className="space-y-2">
                        <Label>File Name</Label>
                        <Input
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                            className="rounded-xl border-[#E2E8F0] focus:ring-[#4EA5D9]"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="resize-none h-24 rounded-xl border-[#E2E8F0] focus:ring-[#4EA5D9]"
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4 ">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl hover:bg-[#F8FAFC]  hover:cursor-pointer">
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-[#4EA5D9] hover:bg-[#3f93c4] text-white rounded-xl hover:cursor-pointer"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}