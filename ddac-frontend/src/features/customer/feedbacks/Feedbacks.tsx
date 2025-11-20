import { useState } from "react";
import { Search, Bell, Smile, Meh, Frown } from "lucide-react";
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

interface PastFeedback {
  id: string;
  patientName: string;
  date: string;
  rating: number;
  feedback: string;
  tags: string[];
}

const mockPastFeedback: PastFeedback[] = [
  {
    id: "1",
    patientName: "John Smith",
    date: "Nov 15, 2025",
    rating: 5,
    feedback:
      "Dr. Johnson was extremely professional and took the time to explain my condition thoroughly. The care I received was exceptional.",
    tags: ["Friendly", "Professional"],
  },
  {
    id: "2",
    patientName: "Anonymous",
    date: "Nov 12, 2025",
    rating: 4,
    feedback:
      "Nurse Davis was very caring and attentive. However, the waiting time was a bit longer than expected.",
    tags: ["Friendly", "Waiting time was long"],
  },
  {
    id: "3",
    patientName: "Maria Garcia",
    date: "Nov 10, 2025",
    rating: 5,
    feedback:
      "Excellent service! Dr. Chen explained everything clearly and made me feel comfortable during my procedure.",
    tags: ["Professional", "Clean environment"],
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
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState<PastFeedback | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Please provide a rating.");
      return;
    }

    // Mock submission
    alert("Feedback submitted successfully!");

    // Reset form
    setRating(0);
    setFeedbackText("");
    setSelectedTags([]);
  };

  const handleViewMore = (feedback: PastFeedback) => {
    setSelectedFeedback(feedback);
    setIsDialogOpen(true);
  };

  const getMoodIcon = () => {
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
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-main)" }}>
      <CustNavBar />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* Rating Section */}
        <FadeInSection>
          <section
            className="p-6 rounded-xl shadow-sm"
            style={{ backgroundColor: "var(--bg-card)" }}
          >
            <h3 className="mb-4" style={{ color: "var(--text-heading)" }}>
              Rate Your Experience
            </h3>

            <div className="flex items-center gap-4 mb-4">
              <StarRating
                rating={rating}
                onRatingChange={setRating}
                size="lg"
              />
              {getMoodIcon()}
            </div>

            {rating > 0 && (
              <p style={{ color: "var(--text-body)" }}>
                {rating} / 5 – {ratingLabels[rating]}
              </p>
            )}
          </section>
        </FadeInSection>

        {/* Feedback Text */}
        <FadeInSection delay={0.3}>
          <section
            className="p-6 rounded-xl shadow-sm"
            style={{ backgroundColor: "var(--bg-card)" }}
          >
            <h3 className="mb-4" style={{ color: "var(--text-heading)" }}>
              Share Your Feedback
            </h3>
            <Textarea
              placeholder="Describe your experience..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="min-h-32 border-2 rounded-xl resize-none"
              style={{
                borderColor: "var(--input-border)",
                backgroundColor: "white",
              }}
            />
          </section>
        </FadeInSection>

        {/* Feedback Tags */}
        <FadeInSection delay={0.6}>
          <section
            className="p-6 rounded-xl shadow-sm"
            style={{ backgroundColor: "var(--bg-card)" }}
          >
            <h3 className="mb-4" style={{ color: "var(--text-heading)" }}>
              Quick Tags (Optional)
            </h3>
            <div className="flex flex-wrap gap-3">
              {feedbackTagOptions.map((tag) => (
                <FeedbackTag
                  key={tag}
                  label={tag}
                  isSelected={selectedTags.includes(tag)}
                  onClick={() => handleTagToggle(tag)}
                />
              ))}
            </div>
          </section>
        </FadeInSection>

        {/* Submit Button */}
        <FadeInSection delay={.6}>
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
              e.currentTarget.style.backgroundColor = "var(--btn-primary)";
            }}
          >
            Submit Feedback
          </Button>
        </FadeInSection>

        {/* Past Feedback */}
        <FadeInSection delay={0.9}>
          <section>
            <h3 className="mb-4" style={{ color: "var(--text-heading)" }}>
              Your Past Feedback
            </h3>
            <div className="space-y-4">
              {mockPastFeedback.map((feedback) => (
                <PastFeedbackCard
                  key={feedback.id}
                  {...feedback}
                  onViewMore={() => handleViewMore(feedback)}
                />
              ))}
            </div>
          </section>
        </FadeInSection>
      </main>

      {/* Feedback Detail Modal */}
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
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {selectedFeedback.date}
                  </p>
                </div>
              </div>

              <div>
                <p
                  className="text-sm mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  Rating:
                </p>
                <StarRating
                  rating={selectedFeedback.rating}
                  interactive={false}
                  size="md"
                />
              </div>

              <div>
                <p
                  className="text-sm mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  Feedback:
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
    </div>
  );
}
