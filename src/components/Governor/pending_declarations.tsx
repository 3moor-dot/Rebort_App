// src/components/Governor/pending_declarations.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
interface Declaration {
  id: number;
  title: string;
  author: string;
  date: string;
}

const PendingDeclarations = () => {
  const [declarations, setDeclarations] = useState<Declaration[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // بيانات تجريبية
    setDeclarations([
      { id: 1, title: "قرار خاص بضريبة العقار", author: "أحمد علي", date: "2024-01-15" },
      { id: 2, title: "قرار خاص برخصة النشاط", author: "محمد حسن", date: "2024-02-20" },
      { id: 3, title: "قرار خاص بالتوافق البيئي", author: "سارة خالد", date: "2024-03-05" },
      { id: 4, title: "قرار خاص بتصريح البناء", author: "محمود ياسر", date: "2024-04-10" },
      { id: 5, title: "قرار خاص بتصريح التشغيل", author: "فاطمة عمر", date: "2024-05-15" },
    ]);
  }, []);

  // فلترة
  const filtered = declarations.filter((d) => {
    const matchesSearch = d.title.toLowerCase().includes(search.toLowerCase());

    const declarationDate = new Date(d.date);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    const matchesFrom = from ? declarationDate >= from : true;
    const matchesTo = to ? declarationDate <= to : true;

    return matchesSearch && matchesFrom && matchesTo;
  });

  // ترتيب
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "title") return a.title.localeCompare(b.title);
    if (sortBy === "author") return a.author.localeCompare(b.author);
    if (sortBy === "date") return new Date(a.date).getTime() - new Date(b.date).getTime();
    return 0;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans" dir="rtl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3">
        القرارات المعلقة
      </h1>

      {/* البحث والفلاتر */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 text-right">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">ابحث بالعنوان</label>
          <input
            type="text"
            placeholder="ابحث عن قرار..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">من تاريخ</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">إلى تاريخ</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">ترتيب حسب</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">بدون ترتيب</option>
            <option value="title">العنوان</option>
            <option value="author">الكاتب</option>
            <option value="date">تاريخ التقديم</option>
          </select>
        </div>
      </div>

      {/* الجدول */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full text-right border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-3 border-b text-sm font-semibold">العنوان</th>
              <th className="px-6 py-3 border-b text-sm font-semibold">الكاتب</th>
              <th className="px-6 py-3 border-b text-sm font-semibold">تاريخ التقديم</th>
              <th className="px-6 py-3 border-b text-sm font-semibold">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 border-b text-gray-800">{d.title}</td>
                <td className="px-6 py-4 border-b text-gray-600">{d.author}</td>
                <td className="px-6 py-4 border-b text-gray-600">{d.date}</td>
                <td className="px-6 py-4 border-b flex gap-2 justify-end">
                  <button 
                  className="px-3 py-1.5 text-sm bg-gray-500 hover:bg-gray-600 rounded-lg transition"
                  onClick={() => navigate(`/decision`)}
                  >
                    عرض
                  </button>
                  <button className="px-3 py-1.5 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg transition">
                    قبول
                  </button>
                  <button className="px-3 py-1.5 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition">
                    رفض
                  </button>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500 text-sm">
                  لا توجد نتائج مطابقة
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingDeclarations;
