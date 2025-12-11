import { CATEGORY_OPTIONS } from "../utils/constants.js";
import "../styles/CategorySidebar.css";
import "../styles/CommunityLayout.css"

export const CategorySidebar = ({ activeCategory, onSelect }) => (
  <aside className="community-sidebar">
    <div className="sidebar-brand">Ms.Vân</div>
    <h4>Chủ đề</h4>
    <div className="category-list">
      {CATEGORY_OPTIONS.map((c) => {
        const Icon = c.icon;
        return (
          <button
            key={c.label}
            className={`category-item ${activeCategory === c.label ? "active" : ""}`}
            onClick={() => onSelect(c.label)}
          >
            <span className="category-icon">
              <Icon />
            </span>
            <span>{c.label}</span>
          </button>
        );
      })}
    </div>
  </aside>
);
