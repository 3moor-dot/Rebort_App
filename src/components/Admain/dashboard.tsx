import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Declaration {
  id: number;
  title: string;
  justification: string;
  body: string;
  Fdate: string;
  status: "معلق" | "مقبول" | "مرفوض";
  Ldate: string;
  userId: number;
  userEmail: string;
}

interface User {
  id: number;
  email: string;
  password: string;
  role: "agency" | "admin" | "governor";
  agencyName?: string;
}

export default function AdminDashboard() {
  const [declarations, setDeclarations] = useState<Declaration[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    role: "agency",
    agencyName: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [expandedUser, setExpandedUser] = useState<number | null>(null);
  const [error, setError] = useState("");

  // 🟢 تحميل البيانات
  useEffect(() => {
    const savedDec = localStorage.getItem("declarations");
    const savedUsers = localStorage.getItem("users");

    const decs: Declaration[] = savedDec
      ? JSON.parse(savedDec).map((d: any) => ({
        ...d,
        userId: Number(d.userId), // ✅ دايمًا رقم
        id: Number(d.id),         // ✅ حتى id نخليه رقم
      }))
      : [];
    let loadedUsers: User[] = savedUsers
      ? JSON.parse(savedUsers).map((u: any) => ({
        ...u,
        id: Number(u.id), // ✅ توحيد
      }))
      : [];

    // ✅ الأدمن الأساسي
    const defaultAdmin: User = {
      id: 1,
      email: "3moor192218@gmail.com",
      password: "654321",
      role: "admin",
    };

    // لو مفيش أي مستخدمين محفوظين → نحط الأدمن الأساسي فقط
    if (loadedUsers.length === 0) {
      loadedUsers = [defaultAdmin];
      localStorage.setItem("users", JSON.stringify(loadedUsers));
    }

    setUsers(loadedUsers);
    setDeclarations(decs);
  }, []);

  // 🟢 حفظ أي تعديل
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem("users", JSON.stringify(users));
    }
  }, [users]);

  useEffect(() => {
    localStorage.setItem("declarations", JSON.stringify(declarations));
  }, [declarations]);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const exists = users.some((u) => u.email === newUser.email);
    if (exists) {
      setError("❌ هذا البريد مستخدم بالفعل!");
      return;
    }

    const user: User = {
      id: Date.now(),
      email: newUser.email,
      password: newUser.password,
      role: newUser.role as User["role"],
      agencyName: newUser.role === "agency" ? newUser.agencyName : undefined,
    };

    setUsers((prev) => [...prev, user]);

    setNewUser({ email: "", password: "", role: "agency", agencyName: "" });
    setShowForm(false);
    setShowPassword(false);
    alert("✅ تم إنشاء المستخدم بنجاح");
  };

  const handleDeleteUser = (id: number, _email: string) => {
    if (id === 1) {
      alert("❌ لا يمكن حذف الأدمن الأساسي!");
      return;
    }

    // تحديث البيانات
    const updatedUsers = users.filter((u) => Number(u.id) !== Number(id));
    const updatedDeclarations = declarations.filter((d) => Number(d.userId) !== Number(id));


    setUsers(updatedUsers);
    setDeclarations(updatedDeclarations);

    alert(`🗑️ تم حذف المستخدم (ID: ${id}) وجميع قرارته.`);
  };

  const translateRole = (role: string) => {
    switch (role) {
      case "admin":
        return "أدمن";
      case "agency":
        return "جهة";
      case "governor":
        return "محافظ";
      default:
        return role;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10" dir="rtl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">لوحة تحكم الإدمن</h1>

      {/* الإحصائيات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="إجمالي القرارات" value={declarations.length} color="blue" />
        <StatCard title="المقبولة" value={declarations.filter((d) => d.status === "مقبول").length} color="green" />
        <StatCard title="المرفوضة" value={declarations.filter((d) => d.status === "مرفوض").length} color="red" />
        <StatCard title="المعلقة" value={declarations.filter((d) => d.status === "معلق").length} color="yellow" />
      </div>

      {/* إنشاء مستخدم */}
      <div className="bg-white shadow rounded-lg p-6 max-w-lg mb-10">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          {showForm ? "✖️ إغلاق" : "➕ إنشاء مستخدم جديد"}
        </button>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    placeholder="مثال: agency@example.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="border rounded-lg px-3 py-2 w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="أدخل كلمة المرور"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      className="border rounded-lg px-3 py-2 w-full pl-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-blue-600 hover:underline"
                    >
                      {showPassword ? "إخفاء" : "إظهار"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الدور</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="border rounded-lg px-3 py-2 w-full"
                  >
                    <option value="agency">جهة</option>
                    <option value="governor">محافظ</option>
                    <option value="admin">أدمن</option>
                  </select>
                </div>

                {newUser.role === "agency" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">اسم الوكالة</label>
                    <input
                      type="text"
                      placeholder="أدخل اسم الجهة"
                      value={newUser.agencyName}
                      onChange={(e) => setNewUser({ ...newUser, agencyName: e.target.value })}
                      className="border rounded-lg px-3 py-2 w-full"
                      required
                    />
                  </div>
                )}

                {error && <p className="text-red-600 text-sm">{error}</p>}

                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  إنشاء
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* قائمة المستخدمين */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">👥 قائمة المستخدمين</h2>
        {users.length === 0 ? (
          <p className="text-gray-500">لا يوجد مستخدمين بعد.</p>
        ) : (
          <ul className="space-y-2">
            {users.map((u) => (
              <li key={u.id} className="border-b py-2">
                <div
                  onClick={() => setExpandedUser(expandedUser === u.id ? null : u.id)}
                  className="flex justify-between items-center cursor-pointer"
                >
                  <span>
                    {u.email} - <span className="text-gray-500">({translateRole(u.role)})</span>
                    {u.role === "agency" && u.agencyName && (
                      <span className="ml-2 text-blue-600">[{u.agencyName}]</span>
                    )}
                  </span>
                  {u.id !== 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteUser(u.id, u.email);
                      }}
                      className="text-red-600 hover:underline"
                    >
                      حذف
                    </button>
                  )}
                </div>

                <AnimatePresence>
                  {expandedUser === u.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gray-50 rounded-lg p-3 mt-2 text-sm text-gray-700"
                    >
                      <p><strong>📧 الإيميل:</strong> {u.email}</p>
                      <p><strong>🔑 كلمة المرور:</strong> {u.password}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  const colors: any = {
    blue: "text-blue-600",
    green: "text-green-600",
    red: "text-red-600",
    yellow: "text-yellow-600",
  };
  return (
    <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center">
      <span className="text-sm text-gray-500">{title}</span>
      <span className={`mt-2 text-3xl font-bold ${colors[color]}`}>{value}</span>
    </div>
  );
}
