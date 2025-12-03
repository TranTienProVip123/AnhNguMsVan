import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ProfileCard from "../../components/Profile/ProfileCard";
import Header from "../../components/Header/Header";
import ResetPasswordModal from "../../components/Auth/ResetPasswordModal";
import "./Profile.css";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

const Profile = () => {
  const { token, user } = useAuth();
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReset, setShowReset] = useState(false);

  const fetchProfile = async () => {
    if (!token) {
      setError("Bạn chưa đăng nhập.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Không thể tải hồ sơ");
      }
      setProfile(data.data?.user || data.user);
    } catch (err) {
      setError(err.message || "Có lỗi khi tải hồ sơ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  return (
    <>
      <Header />
      <div className="profile-page">
        <div className="profile-wrapper">
          <div className="profile-header">
            <div>
              <h1>Hồ sơ cá nhân</h1>
              <p>Xem thông tin tài khoản của bạn.</p>
            </div>
            <button className="profile-refresh" onClick={fetchProfile} disabled={loading}>
              {loading ? "Đang tải..." : "Làm mới"}
            </button>
          </div>

          <ProfileCard
            profile={profile}
            loading={loading}
            error={error}
            onChangePassword={() => setShowReset(true)}
          />
          {showReset && profile && (
            <ResetPasswordModal
              email={profile.email}
              apiBaseUrl={API_BASE_URL}
              onClose={() => setShowReset(false)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
