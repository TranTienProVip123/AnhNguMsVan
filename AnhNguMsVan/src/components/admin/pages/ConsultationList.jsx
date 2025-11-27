import React, { useEffect, useState } from "react";
import { FaComments, FaEdit, FaTrashAlt } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import "../styles/ConsultationList.css";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const ConsultationList = () => {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/admin/consultations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Tải danh sách tư vấn thất bại");
        setItems(data.data?.items || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchConsultations();
  }, [token]);

  const handleChangeStatus = async (id, status) => {
    if (editingId !== id) return;
    setItems((prev) => prev.map((c) => (c._id === id ? { ...c, status } : c)));
    setSavingId(id);
    try {
      const res = await fetch(`${BASE_URL}/api/admin/consultations/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Cập nhật trạng thái thất bại");

      const updated = data?.data?.items;
      if (updated) {
        setItems((prev) => prev.map((c) => (c._id === id ? updated : c)));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa yêu cầu tư vấn này không?")) return;

    try {
      const res = await fetch(`${BASE_URL}/api/admin/consultations/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Xóa yêu cầu tư vấn thất bại");

      setItems((prev) => prev.filter((c) => c._id !== id));
      alert("Đã xóa yêu cầu tư vấn thành công!");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="loading">Đang tải danh sách yêu cầu tư vấn...</p>;
  if (error) return <p className="error">{error}</p>;

  const list = Array.isArray(items) ? items : [];

  return (
    <div className="admin-section">
      <h2>
        <FaComments /> Danh sách yêu cầu tư vấn
      </h2>
      {list.length === 0 ? (
        <p>Chưa có yêu cầu tư vấn nào.</p>
      ) : (
        <div className="consult-table-container">
          <table className="consult-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Họ tên</th>
                <th>Số điện thoại</th>
                <th>Trạng thái</th>
                <th>Ngày gửi</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c, idx) => (
                <tr key={c._id}>
                  <td>{idx + 1}</td>
                  <td>{c.name}</td>
                  <td>{c.phone}</td>
                  <td>
                    {editingId === c._id ? (
                      <select
                        value={c.status || 'new'}
                        onChange={(e) => handleChangeStatus(c._id, e.target.value)}
                        disabled={savingId === c._id}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                      </select>
                    ) : (
                      <span className={`status-badge ${c.status || 'new'}`}>
                        {c.status || 'new'}
                      </span>
                    )}
                  </td>
                  <td>{new Date(c.createdAt).toLocaleDateString("vi-VN")}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => setEditingId(editingId === c._id ? null : c._id)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(c._id)}
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ConsultationList;
