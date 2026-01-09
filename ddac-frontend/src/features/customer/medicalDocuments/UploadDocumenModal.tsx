import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Upload, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { addMedicalDocument } from "../../../services/medicalDocumentManagementService";

interface UploadModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    patientId: string;
}

export function UploadDocumentModal({ open, onOpenChange, onSuccess, patientId }: UploadModalProps) {
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [description, setDescription] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            toast.error("Please select a file");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("patientId", patientId);
            formData.append("fileName", file.name);
            formData.append("fileDescription", description);

            // This function from your service must accept FormData
            await addMedicalDocument(formData);

            toast.success("Document uploaded successfully");
            setFile(null);
            setDescription("");
            onSuccess();
            onOpenChange(false);
        } catch (err) {
            console.error(err);
            toast.error("Upload failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-[#1A1A1A]">Upload Document</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    {/* File Drop Zone (Visual) */}
                    <div className="border-2 border-dashed border-[#CBD5E1] rounded-xl p-8 text-center hover:bg-[#F8FAFC] transition-colors relative group">
                        <Input
                            type="file"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            accept=".pdf,.jpg,.png,.doc,.docx"
                        />
                        <div className="flex flex-col items-center gap-2">
                            <div className="bg-[#F1F5F9] p-3 rounded-full group-hover:bg-[#E2E8F0] transition-colors">
                                <Upload className="h-6 w-6 text-[#4EA5D9]" />
                            </div>
                            {file ? (
                                <div className="text-sm">
                                    <p className="font-semibold text-[#4EA5D9]">{file.name}</p>
                                    <p className="text-[#94A3B8]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            ) : (
                                <div className="text-sm">
                                    <p className="font-medium text-[#1A1A1A]">Click to upload or drag and drop</p>
                                    <p className="text-[#94A3B8]">PDF, JPG, PNG up to 10MB</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Description (Optional)</Label>
                        <Textarea
                            placeholder="e.g., Blood test results from Jan 2024"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="resize-none h-24 rounded-xl border-[#E2E8F0] focus:ring-[#4EA5D9]"
                        />
                    </div>

                    <div className="flex gap-3 justify-end pt-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || !file}
                            className="bg-[#4EA5D9] hover:bg-[#3f93c4] text-white rounded-xl min-w-[100px]"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Upload"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}