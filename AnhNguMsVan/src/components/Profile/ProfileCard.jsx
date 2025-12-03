import PropTypes from "prop-types";
import "./ProfileCard.css";

const ProfileCard = ({ profile, loading, error, onChangePassword }) => {
  if (loading) {
    return (
      <div className="profile-card skeleton">
        <div className="skeleton-avatar" />
        <div className="skeleton-lines">
          <div />
          <div />
          <div />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-card error">
        <p>{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-card empty">
        <p>Không có dữ liệu hồ sơ.</p>
      </div>
    );
  }

  return (
    <div className="profile-card">
      <div className="profile-main">
        <div className="profile-avatar">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={profile.name}
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = ''; }}
            />
          ) : (
            (profile.name?.[0] || profile.email?.[0] || "U").toUpperCase()
          )}
        </div>
        <div className="profile-meta">
          <h2>{profile.name || "Người dùng"}</h2>
          <p className="profile-email">{profile.email}</p>
          <span className="role-pill">{profile.role || "user"}</span>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-field">
          <p className="label">User ID</p>
          <p className="value">{profile.id || profile._id}</p>
        </div>
        <div className="profile-field">
          <p className="label">Trạng thái</p>
          <p className="value value-strong">Đang hoạt động</p>
        </div>
        <div className="profile-field">
          <p className="label">Đăng nhập bằng</p>
          <p className="value">{profile.authProvider || "Tài khoản"}</p>
        </div>
        <div className="profile-field">
          <p className="label">Đổi mật khẩu gần nhất</p>
          <p className="value">
            {profile.passwordChangedAt
              ? new Date(profile.passwordChangedAt).toLocaleString("vi-VN")
              : "Chưa có dữ liệu"}
          </p>
        </div>
      </div>

      {onChangePassword && profile.authProvider !== "google" && (
        <div className="profile-actions-row">
          <button className="profile-change-btn" onClick={onChangePassword}>
            Đổi mật khẩu
          </button>
        </div>
      )}

      {profile.authProvider === "google" && (
        <p className="profile-note">Bạn đăng nhập bằng Google, đổi mật khẩu tại Google Account.</p>
      )}
    </div>
  );
};

ProfileCard.propTypes = {
  profile: PropTypes.object,
  loading: PropTypes.bool,
  error: PropTypes.string,
  onChangePassword: PropTypes.func,
};

export default ProfileCard;
