import React, { useEffect, useState } from "react";
import { FaTrashAlt, FaEdit, FaUser } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import "../styles/UserList.css";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const UserList = () => {
    const { token } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [savingId, setSavingId] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${BASE_URL}/api/admin/users`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Không thể tải danh sách người dùng");
                }

                setUsers(data.data?.items || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [token]);

    const handleFieldChange = async (id, field, value) => {
        setUsers((prev) => prev.map(u => u._id === id ? { ...u, [field]: value } : u));
        setSavingId(id);
        try {
            const res = await fetch(`${BASE_URL}/api/admin/users/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ [field]: value })
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message || 'Cập nhật thất bại');
            setUsers((prev) => prev.map(u => u._id === id ? json.data.user : u));
        } catch (err) {
            alert(err.message);
            setUsers((prev) => prev.map(u => u._id === id ? { ...u, [field]: u[field] } : u));
        } finally {
            setSavingId(null);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;

        try {
            const res = await fetch(`${BASE_URL}/api/admin/users/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Không thể xóa người dùng");

            setUsers((prev) => prev.filter((u) => u._id !== id));
            alert("Đã xóa người dùng thành công!");
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <p>Đang tải danh sách người dùng...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    const list = Array.isArray(users) ? users : [];
    return (
        <div className="admin-section">
            <h2>
                <FaUser /> Danh sách người dùng
            </h2>

            {users.length === 0 ? (
                <p>Không có người dùng nào.</p>
            ) : (
                <div className="table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Email</th>
                                <th>Tên</th>
                                <th>Vai trò</th>
                                <th>Xác thực</th>
                                <th>Ngày tạo</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.map((user, index) => (
                                <tr key={user._id}>
                                    <td>{index + 1}</td>
                                    <td>{user.email}</td>
                                    <td>{editingId === user._id ? (
                                        <input
                                            value={user.name}
                                            onChange={(e) => handleFieldChange(user._id, 'name', e.target.value)}
                                            disabled={savingId === user._id}
                                        />
                                    ) : user.name}
                                    </td>
                                    <td>
                                        {editingId === user._id ? (
                                            <select className="select-role"
                                                value={user.role}
                                                onChange={(e) => handleFieldChange(user._id, 'role', e.target.value)}
                                                disabled={savingId === user._id}
                                            >
                                                <option value="user">user</option>
                                                <option value="admin">admin</option>
                                            </select>
                                        ) : user.role}
                                    </td>
                                    <td>
                                        {editingId === user._id ? (
                                            <label className="checkbox-inline">
                                                <input
                                                    type="checkbox"
                                                    checked={user.isVerified}
                                                    onChange={(e) => handleFieldChange(user._id, 'isVerified', e.target.checked)}
                                                    disabled={savingId === user._id}
                                                />
                                                Đã xác thực
                                            </label>
                                        ) : (
                                            <span className={`verify-badge ${user.isVerified ? 'verified' : 'unverified'}`}>
                                                {user.isVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        {new Date(user.createdAt).toLocaleDateString("vi-VN", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                        })}
                                    </td>
                                    <td>
                                        <button
                                            className="edit-btn"
                                            onClick={() => setEditingId(editingId === user._id ? null : user._id)}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(user._id)}
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

export default UserList;
