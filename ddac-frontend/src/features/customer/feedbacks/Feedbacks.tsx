import { useState } from "react";
import {
  Search,
  Bell,
  Smile,
  Meh,
  Frown,
  Filter,
  Stethoscope,
  Calendar,
  ArrowDownUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { StarRating } from "./components/StarRating";
import { FeedbackTag } from "./components/FeedbackTag";
import { PastFeedbackCard } from "./components/PastFeedbackCard";
import CustNavBar from "../components/CustNavBar";
import FadeInSection from "../components/animations/FadeInSection";
import Layout from "../../../components/Layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Separator } from "../components/ui/separator";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";

interface PastFeedback {
  id: string;
  doctorName: string;
  doctorSpecialty: string;
  appointmentDate: string;
  appointmentTime: string;
  patientName: string;
  commentTime: string;
  overallRating: number;
  staffRating: number;
  doctorRating: number;
  feedback: string;
  tags: string[];
}

const mockPastFeedback: PastFeedback[] = [
  {
    id: "1",
    patientName: "Joachim Wong",
    doctorName: "Tristen Chris",
    doctorSpecialty: "Cardiology",
    appointmentDate: "November 26, 2025",
    appointmentTime: "11:30 AM",
    commentTime: "Nov 15, 2025",
    overallRating: 4,
    staffRating: 5,
    doctorRating: 5,
    feedback:
      "Dr. Johnson was extremely professional and took the time to explain my condition thoroughly. The care I received was exceptional.",
    tags: ["Friendly", "Professional"],
  },
  {
    id: "2",
    patientName: "Joachim Wong",
    doctorName: "Tristen Chris",
    doctorSpecialty: "Cardiology",
    appointmentDate: "November 26, 2025",
    appointmentTime: "11:30 AM",
    commentTime: "",
    overallRating: 0,
    staffRating: 0,
    doctorRating: 0,
    feedback: "",
    tags: ["Friendly", "Professional"],
  },
  {
    id: "3",
    patientName: "Joachim Wong",
    doctorName: "Tristen Chris",
    doctorSpecialty: "Cardiology",
    appointmentDate: "November 26, 2025",
    appointmentTime: "11:30 AM",
    commentTime: "Nov 15, 2025",
    overallRating: 4,
    staffRating: 5,
    doctorRating: 5,
    feedback:
      "Dr. Johnson was extremely professional and took the time to explain my condition thoroughly. The care I received was exceptional.",
    tags: ["Friendly", "Professional"],
  },
];

const feedbackTagOptions = [
  "Friendly",
  "Professional",
  "Clean environment",
  "Waiting time was long",
  "Communication issues",
];

const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

export default function Feedbacks() {
  const [recordTypeFilter, setRecordTypeFilter] = useState("all");
  const [dateRangeFilter, setDateRangeFilter] = useState("all");
  const [overallRating, setOverallRating] = useState(0);
  const [doctorRating, setDoctorRating] = useState(0);
  const [staffRating, setStaffRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState<PastFeedback | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddFeedbackDialogOpen, setIsAddFeedbackDialogOpen] = useState(false);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (overallRating === 0 || doctorRating === 0 || staffRating === 0) {
      toast.error("Please provide a rating for overall, doctor and staff!", {
        style: {
          background: "var(--accent-danger)",
          color: "#ffffff",
          borderRadius: "10px",
        },
      });
      return;
    }

    toast.success("Feedback submitted successfully!", {
      style: {
        background: "#2ECC71",
        color: "#ffffff",
        borderRadius: "10px",
      },
    });

    // Reset form
    setOverallRating(0);
    setDoctorRating(0);
    setStaffRating(0);

    setFeedbackText("");
    setSelectedTags([]);

    setIsAddFeedbackDialogOpen(false);
  };

  const handleAddFeedback = (feedback: PastFeedback) => {
    setSelectedFeedback(feedback);
    setIsAddFeedbackDialogOpen(true);
  };

  const handleViewMore = (feedback: PastFeedback) => {
    setSelectedFeedback(feedback);
    setIsDialogOpen(true);
  };

  const getMoodIcon = (rating: number) => {
    if (rating === 0) return null;
    if (rating <= 2)
      return (
        <Frown className="w-6 h-6" style={{ color: "var(--accent-danger)" }} />
      );
    if (rating === 3)
      return (
        <Meh className="w-6 h-6" style={{ color: "var(--accent-warning)" }} />
      );
    return (
      <Smile className="w-6 h-6" style={{ color: "var(--accent-success)" }} />
    );
  };

  return (
    <Layout role="customer">
      <div
        className="min-h-screen"
        style={{ backgroundColor: "var(--bg-main)" }}
      >
        {/* Main Content */}
        <main className="max-w-5xl mx-auto px-4 md:px-6 space-y-6">
          {/* Search + Filter Bar */}
          <div className="p-6 rounded-xl mb-6 shadow-sm bg-[#dcf0fc]">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Filter Dropdown */}
              <div className="md:col-span-3 bg-white">
                <Select
                  value={recordTypeFilter}
                  onValueChange={setRecordTypeFilter}
                >
                  <SelectTrigger className="border-[#DCEFFB] focus:ring-[#4EA5D9] rounded-xl hover:bg-[#F5F7FA] cursor-pointer">
                    <ArrowDownUp className="w-1 h-4 text-[#4EA5D9]" />
                    <SelectValue placeholder="Record Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#DCEFFB] rounded-xl">
                    <SelectItem
                      className="hover:bg-[#F5F7FA] cursor-pointer"
                      value="all"
                    >
                      All Past Appointments
                    </SelectItem>
                    <SelectItem
                      className="hover:bg-[#F5F7FA] cursor-pointer"
                      value="lab"
                    >
                      Feedback Given
                    </SelectItem>
                    <SelectItem
                      className="hover:bg-[#F5F7FA] cursor-pointer"
                      value="prescriptions"
                    >
                      Feedback Pending
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sorting Dropdown */}
              <div className="md:col-span-3 bg-white">
                <Select
                  value={dateRangeFilter}
                  onValueChange={setDateRangeFilter}
                >
                  <SelectTrigger className="border-[#DCEFFB] focus:ring-[#4EA5D9] rounded-xl hover:bg-[#F5F7FA] cursor-pointer">
                    <Filter className="w-1 h-4 text-[#4EA5D9]" />
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#DCEFFB] rounded-xl">
                    <SelectItem
                      className="hover:bg-[#F5F7FA] cursor-pointer"
                      value="all"
                    >
                      Most Recent
                    </SelectItem>
                    <SelectItem
                      className="hover:bg-[#F5F7FA] cursor-pointer"
                      value="week"
                    >
                      Oldest First
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Past Feedback */}
          <FadeInSection delay={0.9}>
            <section>
              <h3 className="mb-4" style={{ color: "var(--text-heading)" }}>
                Your Past Appointments
              </h3>
              <div className="space-y-4">
                {mockPastFeedback.map((feedback) => (
                  <PastFeedbackCard
                    key={feedback.id}
                    {...feedback}
                    onViewMore={() => handleViewMore(feedback)}
                    onGiveFeedback={() => handleAddFeedback(feedback)}
                  />
                ))}
              </div>
            </section>
          </FadeInSection>
        </main>

        {/* Add Feedback Modal */}
        <Dialog
          open={isAddFeedbackDialogOpen}
          onOpenChange={setIsAddFeedbackDialogOpen}
        >
          <DialogContent className="w-full max-w-md">
            <DialogHeader>
              <DialogTitle>Add Feedback Details</DialogTitle>
            </DialogHeader>

            <div className="max-w-md">
              {selectedFeedback && (
                <div className="space-y-4">
                  <div className="space-y-3 mt-2 mb-2">
                    <div className="flex items-center gap-3 text-[#3D3D3D]">
                      <Stethoscope className="h-4 w-4 text-[#4EA5D9]" />
                      <span className="text-sm text-black">
                        {selectedFeedback.doctorName} (
                        {selectedFeedback.doctorSpecialty})
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3 mt-2 mb-2">
                    <div className="flex items-center gap-3 text-[#3D3D3D]">
                      <Calendar className="h-4 w-4 text-[#4EA5D9]" />
                      <span className="text-sm text-black">
                        {selectedFeedback.appointmentDate} •{" "}
                        {selectedFeedback.appointmentTime}
                      </span>
                    </div>
                  </div>

                  <Separator className="mb-4 bg-[#DCEFFB] " />

                  <div className="flex flex-row gap-2 items-center">
                    <p
                      className="text-sm w-25"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Overall Rating:
                    </p>

                    <StarRating
                      rating={overallRating}
                      onRatingChange={setOverallRating}
                      size="md"
                    />
                    {getMoodIcon(overallRating)}
                  </div>
                  <div className="flex flex-row gap-2 items-center">
                    <p
                      className="text-sm w-25"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Doctor Rating:
                    </p>
                    <StarRating
                      rating={doctorRating}
                      onRatingChange={setDoctorRating}
                      size="md"
                    />
                    {getMoodIcon(doctorRating)}
                  </div>
                  <div className="flex flex-row gap-2 items-center">
                    <p
                      className="text-sm w-25"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Staff Rating:
                    </p>
                    <StarRating
                      rating={staffRating}
                      onRatingChange={setStaffRating}
                      size="md"
                    />
                    {getMoodIcon(staffRating)}
                  </div>

                  <div>
                    <p
                      className="text-sm mb-2"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Give Overall Comment:
                    </p>
                    <p style={{ color: "var(--text-body)" }}>
                      {selectedFeedback.feedback}
                    </p>
                  </div>

                  <div className="w-full">
                    <Textarea
                      placeholder="Describe your experience..."
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      className="min-h-32 border-2 rounded-xl w-full"
                      style={{
                        borderColor: "var(--input-border)",
                        backgroundColor: "white",
                      }}
                    />
                  </div>
                  <p
                    className="text-sm mb-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Optional Tags:
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    {feedbackTagOptions.map((tag) => (
                      <FeedbackTag
                        key={tag}
                        label={tag}
                        isSelected={selectedTags.includes(tag)}
                        onClick={() => handleTagToggle(tag)}
                      />
                    ))}
                  </div>
                  <Button
                    onClick={handleSubmit}
                    className="cursor-pointer w-full py-6 rounded-xl shadow-md hover:shadow-lg transition-all"
                    style={{
                      backgroundColor: "var(--btn-primary)",
                      color: "white",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "var(--btn-primary-hover)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "var(--btn-primary)";
                    }}
                  >
                    Submit Feedback
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Additional Detail Modal */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Feedback Details</DialogTitle>
            </DialogHeader>

            {selectedFeedback && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback
                      style={{
                        backgroundColor: "var(--accent-teal)",
                        color: "white",
                      }}
                    >
                      {selectedFeedback.patientName === "Anonymous"
                        ? "A"
                        : selectedFeedback.patientName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p style={{ color: "var(--text-heading)" }}>
                      {selectedFeedback.patientName}
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Commented at: {selectedFeedback.commentTime}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mt-2 mb-2">
                  <div className="flex items-center gap-3 text-[#3D3D3D]">
                    <Stethoscope className="h-4 w-4 text-[#4EA5D9]" />
                    <span className="text-sm text-black">
                      {selectedFeedback.doctorName} (
                      {selectedFeedback.doctorSpecialty})
                    </span>
                  </div>
                </div>
                <div className="space-y-3 mt-2 mb-2">
                  <div className="flex items-center gap-3 text-[#3D3D3D]">
                    <Calendar className="h-4 w-4 text-[#4EA5D9]" />
                    <span className="text-sm text-black">
                      {selectedFeedback.appointmentDate} •{" "}
                      {selectedFeedback.appointmentTime}
                    </span>
                  </div>
                </div>

                <Separator className="mb-4 bg-[#DCEFFB] " />

                <div className="flex flex-row gap-2 items-center">
                  <p
                    className="text-sm w-25"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Overall Rating:
                  </p>
                  <StarRating
                    rating={selectedFeedback.overallRating}
                    interactive={false}
                    size="md"
                  />
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <p
                    className="text-sm w-25"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Doctor Rating:
                  </p>
                  <StarRating
                    rating={selectedFeedback.overallRating}
                    interactive={false}
                    size="md"
                  />
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <p
                    className="text-sm w-25"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Staff Rating:
                  </p>
                  <StarRating
                    rating={selectedFeedback.overallRating}
                    interactive={false}
                    size="md"
                  />
                </div>

                <div>
                  <p
                    className="text-sm mb-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Comment:
                  </p>
                  <p style={{ color: "var(--text-body)" }}>
                    {selectedFeedback.feedback}
                  </p>
                </div>

                {selectedFeedback.tags.length > 0 && (
                  <div>
                    <p
                      className="text-sm mb-2"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Tags:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedFeedback.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full text-sm"
                          style={{
                            backgroundColor: "var(--btn-secondary)",
                            color: "var(--btn-secondary-text)",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
        <Toaster />
      </div>
    </Layout>
  );
}
