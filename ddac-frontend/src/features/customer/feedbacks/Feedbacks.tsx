import { useContext, useEffect, useState } from "react";
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
import { CustomerContext } from "../CustomerContext";
import {
  addComment,
  getCommentsByPatientId,
} from "../../../services/commentManagementService";
import LoadingOverlay from "../components/LoadingOverlay";
import { convertDateTime } from "../../../../../utils/TimeConversion";

interface PastFeedback {
  id: string;
  doctorId: string;
  staffId: string;
  appointmentId: string;
  doctorName: string;
  doctorSpecialty: string;
  appointmentDate: string;
  appointmentTime: string;
  patientName: string;
  commentTime: string;
  overallRating: number | null;
  staffRating: number | null;
  doctorRating: number | null;
  feedback: string | null;
  tags: string | null;
}

const feedbackTagOptions = [
  "Friendly",
  "Professional",
  "Clean environment",
  "Waiting time was long",
  "Communication issues",
];

export default function Feedbacks() {
  const [comments, setComments] = useState<PastFeedback[]>([]);
  const [allComments, setAllComments] = useState<PastFeedback[]>([]);

  const [sorting, setSorting] = useState("all");
  const [timeFilter, setTimeFilter] = useState("mostRecent");

  const [overallRating, setOverallRating] = useState(0);
  const [doctorRating, setDoctorRating] = useState(0);
  const [staffRating, setStaffRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedComment, setSelectedComment] = useState<PastFeedback | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddFeedbackDialogOpen, setIsAddFeedbackDialogOpen] = useState(false);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [loadingSubmittingComment, setLoadingSubmittingComment] =
    useState(false);

  const { patient, loading } = useContext(CustomerContext);

  useEffect(() => {
    if (patient?.id) {
      fetchCommentsFromDB(patient.id);
    }
  }, [patient?.id]);

  useEffect(() => {
    let filtered = [...allComments];

    // Rating filter
    if (sorting === "feedbackGiven") {
      filtered = filtered.filter((a) => a.overallRating != null);
    } else if (sorting === "feedbackPending") {
      filtered = filtered.filter((a) => a.overallRating === null);
    }

    // Time sorting
    if (timeFilter === "mostRecent") {
      filtered.sort(
        (a, b) =>
          new Date(b.commentTime).getTime() - new Date(a.commentTime).getTime()
      );
    } else if (timeFilter === "oldestFirst") {
      filtered.sort(
        (a, b) =>
          new Date(a.commentTime).getTime() - new Date(b.commentTime).getTime()
      );
    }

    setComments(filtered);
  }, [sorting, timeFilter, allComments]);

  const fetchCommentsFromDB = async (patientId: string) => {
    setIsLoadingFeedback(true);
    try {
      const datas = await getCommentsByPatientId(patientId);

      const formattedComments = datas.map((comment: any) => ({
        id: comment.id,
        doctorId: comment.doctorId,
        staffId: comment.staffId,
        appointmentId: comment.appointmentId,
        doctorName: comment.doctorFirstName + " " + comment.doctorLastName,
        doctorSpecialty: comment.doctorSpecialization,
        appointmentDate: comment.appointmentDate,
        appointmentTime: comment.appointmentTime,
        patientName: comment.patientFirstName + " " + comment.patientLastName,
        commentTime: comment.commentTime,
        overallRating: comment.overallRating,
        staffRating: comment.staffRating,
        doctorRating: comment.doctorRating,
        feedback: comment.commentText,
        tags: comment.tags,
      }));

      setAllComments(formattedComments);
    } catch (err) {
      console.log("Error: ", err);
      toast.error("Error retrieving feedback!", {
        style: {
          background: "var(--accent-danger)",
          color: "#ffffff",
          borderRadius: "10px",
        },
      });
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
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

    // Add comment in DB
    setIsAddFeedbackDialogOpen(false);
    setLoadingSubmittingComment(true);

    try {
      const payload = {
        commentText: feedbackText,
        doctorRating: doctorRating,
        staffRating: staffRating,
        overallRating: overallRating,
        time: new Date().toISOString(),
        tags: selectedTags.join(", "),
      };

      console.log(selectedComment?.id, payload);

      await addComment(selectedComment?.id, payload);

      toast.success("Feedback submitted successfully!", {
        style: {
          background: "#2ECC71",
          color: "#ffffff",
          borderRadius: "10px",
        },
      });
    } catch (err) {
      console.log("Error: ", err);
      toast.error("Error submitting feedback!", {
        style: {
          background: "var(--accent-danger)",
          color: "#ffffff",
          borderRadius: "10px",
        },
      });
    } finally {
      // Reset form
      setLoadingSubmittingComment(false);
      setOverallRating(0);
      setDoctorRating(0);
      setStaffRating(0);

      setFeedbackText("");
      setSelectedTags([]);
      fetchCommentsFromDB(patient.id);
    }
  };

  const handleAddFeedback = (feedback: PastFeedback) => {
    setSelectedComment(feedback);
    setIsAddFeedbackDialogOpen(true);
  };

  const handleViewMore = (feedback: PastFeedback) => {
    try {
      setSelectedComment(feedback);
      setIsDialogOpen(true);
    } catch (err) {
      console.log("Error: ", err);
    }
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
                <Select value={sorting} onValueChange={setSorting}>
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
                      value="feedbackGiven"
                    >
                      Feedback Given
                    </SelectItem>
                    <SelectItem
                      className="hover:bg-[#F5F7FA] cursor-pointer"
                      value="feedbackPending"
                    >
                      Feedback Pending
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sorting Dropdown */}
              <div className="md:col-span-3 bg-white">
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger className="border-[#DCEFFB] focus:ring-[#4EA5D9] rounded-xl hover:bg-[#F5F7FA] cursor-pointer">
                    <Filter className="w-1 h-4 text-[#4EA5D9]" />
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#DCEFFB] rounded-xl">
                    <SelectItem
                      className="hover:bg-[#F5F7FA] cursor-pointer"
                      value="mostRecent"
                    >
                      Most Recent
                    </SelectItem>
                    <SelectItem
                      className="hover:bg-[#F5F7FA] cursor-pointer"
                      value="oldestFirst"
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
                {isLoadingFeedback ? (
                  <div className="bg-white rounded-2xl p-12 text-center border border-[#DCEFFB]">
                    <p className="text-[#7A7A7A]">Retrieving Feedbacks...</p>
                  </div>
                ) : comments.length > 0 ? (
                  comments.map((comment) => (
                    <PastFeedbackCard
                      key={comment.id}
                      {...comment}
                      onViewMore={() => handleViewMore(comment)}
                      onGiveFeedback={() => handleAddFeedback(comment)}
                    />
                  ))
                ) : (
                  <div className="bg-white rounded-2xl p-12 text-center border border-[#DCEFFB]">
                    <p className="text-[#7A7A7A]">No results found</p>
                  </div>
                )}
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
              {selectedComment && (
                <div className="space-y-4">
                  <div className="space-y-3 mt-2 mb-2">
                    <div className="flex items-center gap-3 text-[#3D3D3D]">
                      <Stethoscope className="h-4 w-4 text-[#4EA5D9]" />
                      <span className="text-sm text-black">
                        {selectedComment?.doctorName} (
                        {selectedComment?.doctorSpecialty})
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3 mt-2 mb-2">
                    <div className="flex items-center gap-3 text-[#3D3D3D]">
                      <Calendar className="h-4 w-4 text-[#4EA5D9]" />
                      <span className="text-sm text-black">
                        {selectedComment?.appointmentDate} •{" "}
                        {selectedComment?.appointmentTime}
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
                    <p style={{ color: "var(--text-body)" }}></p>
                  </div>

                  <div className="w-full">
                    <Textarea
                      placeholder="Describe your experience..."
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      className="min-h-32 border-2 rounded-xl w-full focus:ring-[#4EA5D9]"
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

            {selectedComment && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback
                      style={{
                        backgroundColor: "var(--accent-teal)",
                        color: "white",
                      }}
                    >
                      {patient.firstName === "Anonymous"
                        ? "A"
                        : patient.firstName
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p style={{ color: "var(--text-heading)" }}>
                      {patient.firstName}
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Commented at: {convertDateTime(selectedComment.commentTime)}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mt-2 mb-2">
                  <div className="flex items-center gap-3 text-[#3D3D3D]">
                    <Stethoscope className="h-4 w-4 text-[#4EA5D9]" />
                    <span className="text-sm text-black">
                      {selectedComment.doctorName} (
                      {selectedComment.doctorSpecialty})
                    </span>
                  </div>
                </div>
                <div className="space-y-3 mt-2 mb-2">
                  <div className="flex items-center gap-3 text-[#3D3D3D]">
                    <Calendar className="h-4 w-4 text-[#4EA5D9]" />
                    <span className="text-sm text-black">
                      {selectedComment.appointmentDate} •{" "}
                      {selectedComment.appointmentTime}
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
                    rating={selectedComment.overallRating ?? 0}
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
                    rating={selectedComment.doctorRating ?? 0}
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
                    rating={selectedComment.staffRating ?? 0}
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
                    {selectedComment.feedback ?? "No comment"}
                  </p>
                </div>

                {selectedComment?.tags &&
                  selectedComment.tags.trim() !== "" && (
                    <div>
                      <p
                        className="text-sm mb-2"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Tags:
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {selectedComment.tags.split(", ").map((tag) => (
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

        <LoadingOverlay
          isLoading={loadingSubmittingComment}
          message="Submitting feedback..."
        />
      </div>
    </Layout>
  );
}
