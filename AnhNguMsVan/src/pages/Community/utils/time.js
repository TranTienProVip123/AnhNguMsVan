export function formatRelativeTime(inputTime) {
  if (!inputTime) return "";

  //kiểm tra biến d có phải đối tượng được tạo từ class Date ko -> true trả -> false ép kiểu
  const d = inputTime instanceof Date ? inputTime : new Date(inputTime);
  if (isNaN(d.getTime())) return "";

  //tính chênh lệch mili-giây
  const now = new Date();
  const diffMs = now - d;
  const diffSec = Math.floor(diffMs / 1000); //tính giây
  const diffMin = Math.floor(diffSec / 60); //tính phút
  const diffHour = Math.floor(diffMin / 60); // tính giờ

  //Trạng thái "Vừa xong"
  if (diffSec < 60) return "Vừa xong";

  //Trong vòng 1 giờ
  if (diffMin < 60) return `${diffMin} phút trước`;

  //chuẩn hóa thời điểm và đối tượng cần so sánh
  const sameDay = isSameDay(d, now);
  const isYesterday = isDayBefore(d, now);

  //"Hôm nay"
  if (sameDay) return `Hôm nay lúc ${formatTimeVi(d)}`;

  //"Hôm qua"
  if (isYesterday) return `Hôm qua lúc ${formatTimeVi(d)}`;

  //"Cùng năm"
  const sameYear = d.getFullYear() === now.getFullYear();
  if (sameYear) {
    return `${d.getDate()} tháng ${d.getMonth() + 1} lúc ${formatTimeVi(d)}`;
  }

  //"Khác năm"
  return `${d.getDate()} tháng ${d.getMonth() + 1} ${d.getFullYear()} lúc ${formatTimeVi(d)}`;
}

//format giờ:phút theo kiểu Việt Nam, 24h
function formatTimeVi(date) {
  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit", //giờ 2 số(09,11,12h)
    minute: "2-digit",
    hour12: false,
  });
}

//kiểm tra có cùng ngày không
function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

//kiểm tra a có phải là hôm qua so với b ko
function isDayBefore(a, b) {
  const yesterday = new Date(b);
  yesterday.setDate(b.getDate() - 1);
  return isSameDay(a, yesterday);
}