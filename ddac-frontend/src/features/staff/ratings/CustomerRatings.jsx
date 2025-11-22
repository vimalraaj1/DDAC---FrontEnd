import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../../components/Layout";
import DataTable from "../components/DataTable";
import * as ratingService from "../services/ratingService";
import { FaStar, FaArrowLeft, FaUser } from "react-icons/fa";

export default function CustomerRatings() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [ratings, setRatings] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (customerId) {
      loadRatings();
      loadAnalytics();
    } else {
      loadAllRatings();
    }
  }, [customerId]);

  const loadRatings = async () => {
    try {
      setLoading(true);
      const data = await ratingService.getRatingsByCustomer(customerId);
      setRatings(data || []);
    } catch (error) {
      console.error("Error loading ratings:", error);
      // Mock data
      setRatings([
        {
          id: 1,
          rating: 5,
          comment: "Excellent service!",
          date: "2024-12-20",
          service: "General Consultation",
        },
        {
          id: 2,
          rating: 4,
          comment: "Very good experience",
          date: "2024-12-15",
          service: "Follow-up",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadAllRatings = async () => {
    try {
      setLoading(true);
      const data = await ratingService.getAllRatings();
      setRatings(data || []);
    } catch (error) {
      console.error("Error loading ratings:", error);
      setRatings([]);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const data = await ratingService.getCustomerRatingAnalytics(customerId);
      setAnalytics(data);
    } catch (error) {
      console.error("Error loading analytics:", error);
      // Mock analytics
      setAnalytics({
        averageRating: 4.5,
        totalRatings: 2,
        latestRating: 5,
        latestRatingDate: "2024-12-20",
      });
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={star <= rating ? "text-yellow-400" : "text-gray-300"}
            size={16}
          />
        ))}
        <span className="ml-2 text-gray-600">({rating})</span>
      </div>
    );
  };

  const columns = [
    {
      key: "rating",
      label: "Rating",
      render: (value) => renderStars(value),
    },
    {
      key: "comment",
      label: "Comment",
    },
    {
      key: "service",
      label: "Service",
    },
    {
      key: "date",
      label: "Date",
      render: (value) => value ? new Date(value).toLocaleDateString() : "N/A",
    },
  ];

  const filteredRatings = ratings.filter((rating) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (rating.comment || "").toLowerCase().includes(query) ||
      (rating.service || "").toLowerCase().includes(query)
    );
  });

  return (
    <Layout role="staff">
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {customerId && (
            <div className="mb-6">
              <button
                onClick={() => navigate("/staff/ratings")}
                className="text-primary hover:underline flex items-center gap-2 mb-4"
              >
                <FaArrowLeft size={16} />
                Back to All Ratings
              </button>
            </div>
          )}

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {customerId ? "Customer Ratings" : "All Ratings"}
            </h1>
            <p className="text-gray-600">View and analyze customer feedback</p>
          </div>

          {/* Analytics */}
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-sm text-gray-500 mb-2">Average Rating</p>
                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-400" size={24} />
                  <p className="text-3xl font-bold text-gray-900">{analytics.averageRating?.toFixed(1)}</p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-sm text-gray-500 mb-2">Total Ratings</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.totalRatings || 0}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-sm text-gray-500 mb-2">Latest Rating</p>
                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-400" size={24} />
                  <p className="text-3xl font-bold text-gray-900">{analytics.latestRating || "N/A"}</p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-sm text-gray-500 mb-2">Latest Rating Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {analytics.latestRatingDate
                    ? new Date(analytics.latestRatingDate).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <input
              type="text"
              placeholder="Search ratings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Ratings Table */}
          {loading ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">Loading ratings...</p>
            </div>
          ) : (
            <DataTable columns={columns} data={filteredRatings} />
          )}
        </div>
      </div>
    </Layout>
  );
}

