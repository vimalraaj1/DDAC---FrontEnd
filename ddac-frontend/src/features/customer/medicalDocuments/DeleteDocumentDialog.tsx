import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../components/ui/alert-dialog"; // Ensure path to ui/alert-dialog is correct

interface DeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

export function DeleteDocumentDialog({ open, onOpenChange, onConfirm }: DeleteDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="bg-white rounded-2xl border-none shadow-lg">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-[#1A1A1A] text-xl">Delete Document?</AlertDialogTitle>
                    <AlertDialogDescription className="text-[#7A7A7A]">
                        This action cannot be undone. This will permanently delete the medical document from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4">
                    <AlertDialogCancel className="rounded-xl border-gray-200">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-xl border-none"
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}