import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/layout/Header";
import { getProfileById } from "../services/profile";
import type { Profile } from "../types/profile";
import {
  Star,
  Award,
  MessageCircle,
  Save,
  Clock,
  Briefcase,
  Users,
  Calendar,
  BookOpen,
  Video,
  ChevronRight,
} from "lucide-react";

// Helper to format the "Member Since" date
const formatMemberSince = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  } catch (e) {
    return "N/A";
  }
};

// A component for the stat boxes
const StatBox: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
}> = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 p-4 bg-gray-200/50 rounded-lg">
    <div className="text-gray-600">{icon}</div>
    <div>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-lg font-bold text-gray-900">{value}</div>
    </div>
  </div>
);

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("No profile ID provided.");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProfileById(id);
        setProfile(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="text-center p-12">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="text-center p-12 text-red-600">{error}</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="text-center p-12">Profile not found.</div>
      </div>
    );
  }

  // Render the full profile
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto p-8">
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
          {/* --- Profile Header --- */}
          <div className="p-8 bg-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <img
                src={profile.avatar_url || "https://placehold.co/128"}
                alt={profile.full_name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-md"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {profile.full_name}
                  </h1>
                  {profile.is_verified && (
                    <span className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                      <Award size={14} /> Verified Student
                    </span>
                  )}
                </div>
                <p className="text-lg text-gray-600 mt-1">{profile.major}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <Star size={18} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-lg font-bold text-gray-800">
                    {profile.rating_average.toFixed(1)}
                  </span>
                  <span className="text-gray-500 text-sm">
                    ({profile.rating_count} reviews)
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg font-semibold text-gray-800 hover:bg-gray-50">
                  <Save size={16} /> Save
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
                  <MessageCircle size={16} /> Message
                </button>
              </div>
            </div>
            <p className="text-gray-700 mt-6">{profile.bio}</p>
          </div>

          {/* --- Stats & Services --- */}
          <div className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatBox
                icon={<Briefcase size={20} />}
                label="Items Sold"
                value={profile.items_sold}
              />
              <StatBox
                icon={<Clock size={20} />}
                label="Avg Response"
                value={profile.avg_response_time || "N/A"}
              />
              <StatBox
                icon={<Users size={20} />}
                label="Followers"
                value={profile.followers_count}
              />
              <StatBox
                icon={<Calendar size={20} />}
                label="Member Since"
                value={formatMemberSince(profile.created_at)}
              />
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Services Provided
              </h2>
              <div className="space-y-4">
                {profile.services.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100 mr-4">
                      {service.name.toLowerCase().includes("tutor") ? (
                        <BookOpen className="text-blue-600" />
                      ) : (
                        <Video className="text-purple-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {service.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {service.description}
                      </p>
                    </div>
                    {service.price_per_hour && (
                      <div className="text-right">
                        <span className="font-bold text-gray-900">
                          ${service.price_per_hour}
                        </span>
                        <span className="text-sm text-gray-500">/hour</span>
                      </div>
                    )}
                    <ChevronRight className="ml-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
