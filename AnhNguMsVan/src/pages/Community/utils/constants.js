import {
  FiHome,
  FiHeart,
  FiBookOpen,
  FiGlobe,
  FiNavigation,
  FiEdit3,
  FiUsers,
  FiGift,
  FiBriefcase,
  FiBookmark
} from "react-icons/fi";

export const CATEGORY_OPTIONS = [
  { label: "Tất cả", icon: FiHome },
  { label: "Góc chia sẻ", icon: FiHeart },
  { label: "Học tiếng Anh", icon: FiBookOpen },
  { label: "Du học", icon: FiGlobe },
  { label: "Du lịch", icon: FiNavigation },
  { label: "Dịch thuật", icon: FiEdit3 },
  { label: "Tìm bạn học", icon: FiUsers },
  { label: "Tìm gia sư", icon: FiGift },
  { label: "Việc làm", icon: FiBriefcase },
  { label: "Khác", icon: FiBookmark }
];

export const DEFAULT_CATEGORY = CATEGORY_OPTIONS[0].label;
export const PAGE_SIZE = 5;
