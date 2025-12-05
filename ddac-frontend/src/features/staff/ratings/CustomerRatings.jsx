import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../../components/Layout";
import * as ratingService from "../services/ratingService";
import { FaStar, FaArrowLeft, FaUser, FaCalendar, FaStethoscope, FaSpinner } from "react-icons/fa";
import { toast } from "sonner";
import { formatStaffDate } from "../utils/dateFormat";
import { getStoredStaffId } from "../utils/staffStorage";

export default function CustomerRatings() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Get current staff ID from storage (id key preferred)
  const staffId = getStoredStaffId();

  useEffect(() => {
    if (customerId) {
      loadRatingsByCustomer();
    } else if (staffId) {
      loadStaffRatings();
    } else {
      loadAllRatings();
    }
  }, [customerId, staffId]);

  const loadStaffRatings = async () => {
    try {
      setLoading(true);
      const data = await ratingService.getStaffRatings(staffId);
      setRatings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading staff ratings:", error);
      toast.error("Failed to load ratings. Please try again.");
      setRatings([]);
    } finally {
      setLoading(false);
    }
  };

  const loadRatingsByCustomer = async () => {
    try {
      setLoading(true);
      const data = await ratingService.getRatingsByCustomer(customerId);
      setRatings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading ratings:", error);
      toast.error("Failed to load ratings. Please try again.");
      setRatings([]);
    } finally {
      setLoading(false);
    }
  };

  const loadAllRatings = async () => {
    try {
      setLoading(true);
      const data = await ratingService.getAllRatings();
      setRatings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading ratings:", error);
      toast.error("Failed to load ratings. Please try again.");
      setRatings([]);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    if (!rating || rating === 0) return <span className="text-muted text-sm">No rating</span>;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
            size={16}
          />
        ))}
        <span className="ml-2 text-body font-medium">({rating})</span>
      </div>
    );
  };

  const formatDate = (dateStr) => formatStaffDate(dateStr);

  const filteredRatings = ratings.filter((rating) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const comment = (rating.comment || rating.feedback || "").toLowerCase();
    const patientName = (rating.patientName || "").toLowerCase();
    const appointmentId = (rating.appointmentId || "").toLowerCase();
    return comment.includes(query) || patientName.includes(query) || appointmentId.includes(query);
  });

  // Calculate analytics
  const analytics = ratings.length > 0
    ? {
        averageRating:
          ratings.reduce((sum, r) => sum + (r.staffRating || r.rating || 0), 0) / ratings.length,
        totalRatings: ratings.length,
        latestRating: ratings[0]?.staffRating || ratings[0]?.rating || 0,
        latestRatingDate: ratings[0]?.time || ratings[0]?.date,
      }
    : null;

  return (
    <Layout role="staff">
      <div className="w-full max-w-full overflow-hidden">
        {customerId && (
          <div className="mb-6">
            <button
              onClick={() => navigate("/staff/ratings")}
              className="flex items-center gap-2 px-4 py-2 text-muted hover:text-heading transition-colors mb-4"
            >
              <FaArrowLeft size={16} />
              <span>Back to All Ratings</span>
            </button>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-heading mb-2">
            {customerId ? "Customer Ratings" : staffId ? "My Ratings" : "All Ratings"}
          </h1>
          <p className="text-muted">View and analyze feedback and ratings</p>
        </div>

        {/* Analytics */}
        {analytics && analytics.totalRatings > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-card rounded-xl shadow-soft p-6">
              <p className="text-sm text-muted mb-2">Average Rating</p>
              <div className="flex items-center gap-2">
                <FaStar className="text-yellow-400 fill-yellow-400" size={24} />
                <p className="text-3xl font-bold text-heading">{analytics.averageRating.toFixed(1)}</p>
              </div>
            </div>
            <div className="bg-card rounded-xl shadow-soft p-6">
              <p className="text-sm text-muted mb-2">Total Ratings</p>
              <p className="text-3xl font-bold text-heading">{analytics.totalRatings}</p>
            </div>
            <div className="bg-card rounded-xl shadow-soft p-6">
              <p className="text-sm text-muted mb-2">Latest Rating</p>
              <div className="flex items-center gap-2">
                <FaStar className="text-yellow-400 fill-yellow-400" size={24} />
                <p className="text-3xl font-bold text-heading">{analytics.latestRating || "N/A"}</p>
              </div>
            </div>
            <div className="bg-card rounded-xl shadow-soft p-6">
              <p className="text-sm text-muted mb-2">Latest Rating Date</p>
              <p className="text-lg font-semibold text-heading">{formatDate(analytics.latestRatingDate)}</p>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="bg-card rounded-xl shadow-soft p-4 mb-6">
          <input
            type="text"
            placeholder="Search ratings by comment, patient name, or appointment ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-body placeholder-muted"
          />
        </div>

        {/* Ratings List */}
        {loading ? (
          <div className="bg-card rounded-xl shadow-soft p-12 text-center">
            <FaSpinner className="animate-spin mx-auto mb-4 text-primary" size={32} />
            <p className="text-muted">Loading ratings...</p>
          </div>
        ) : filteredRatings.length > 0 ? (
          <div className="space-y-4">
            {filteredRatings.map((rating) => (
              <div
                key={rating.id || rating.commentId}
                className="bg-card rounded-xl shadow-soft p-6 border border-color hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* Rating Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary bg-opacity-10 flex items-center justify-center">
                          <FaUser className="text-primary" size={20} />
                        </div>
                        <div>
                          <p className="text-heading font-semibold">
                            {rating.patientName || `Patient ${rating.patientId || "N/A"}`}
                          </p>
                          <p className="text-muted text-sm">{formatDate(rating.time || rating.date)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-muted text-xs mb-1">Staff Rating</p>
                        {renderStars(rating.staffRating || rating.rating)}
                      </div>
                    </div>

                    {/* Appointment Info */}
                    {(rating.appointmentId || rating.appointmentDate) && (
                      <div className="flex items-center gap-4 mb-3 text-sm text-muted">
                        {rating.appointmentId && (
                          <div className="flex items-center gap-2">
                            <FaStethoscope size={14} />
                            <span>Appointment: {rating.appointmentId}</span>
                          </div>
                        )}
                        {rating.appointmentDate && (
                          <div className="flex items-center gap-2">
                            <FaCalendar size={14} />
                            <span>{formatDate(rating.appointmentDate)}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Comment */}
                    {(rating.comment || rating.feedback) && (
                      <div className="mt-4 pt-4 border-t border-color">
                        <p className="text-muted text-sm mb-2">Comment:</p>
                        <p className="text-body">{rating.comment || rating.feedback}</p>
                      </div>
                    )}

                    {/* Overall and Doctor Ratings if available */}
                    {(rating.overallRating || rating.doctorRating) && (
                      <div className="mt-4 pt-4 border-t border-color flex flex-wrap gap-4">
                        {rating.overallRating && (
                          <div>
                            <p className="text-muted text-xs mb-1">Overall Rating</p>
                            {renderStars(rating.overallRating)}
                          </div>
                        )}
                        {rating.doctorRating && (
                          <div>
                            <p className="text-muted text-xs mb-1">Doctor Rating</p>
                            {renderStars(rating.doctorRating)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-xl shadow-soft p-12 text-center">
            <FaStar size={48} className="text-muted opacity-50 mx-auto mb-4" />
            <p className="text-muted text-lg">No ratings found</p>
            <p className="text-muted text-sm mt-2">
              {searchQuery ? "Try adjusting your search query" : "No ratings have been submitted yet"}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
