// src/components/Agency/Create_decision.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NewDeclarationPage() {
  const [title, setTitle] = useState("");
  const [justification, setJustification] = useState(""); // حيثيات الإقرار
  const [body, setBody] = useState(""); // نص الإقرار
  const [file, setFile] = useState<File | null>(null);
  const [today, setToday] = useState<string>(""); // التاريخ من الـ API
  const navigate = useNavigate();

  // ✅ المستخدم الحالي
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

  // جلب التاريخ من API
  useEffect(() => {
    async function fetchDate() {
      try {
        const res = await fetch("https://worldtimeapi.org/api/timezone/Africa/Cairo");
        const data = await res.json();
        const localDate = new Date(data.datetime).toLocaleDateString("en-CA");
        setToday(localDate);
      } catch (err) {
        console.error("خطأ في جلب التاريخ:", err);
        setToday(new Date().toLocaleDateString("en-CA"));
      }
    }
    fetchDate();
  }, []);

  // 📝 رفع المرفق وتحويله Base64 للتخزين
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      alert("⚠️ لم يتم تسجيل الدخول.");
      return;
    }

    let fileData = null;
    if (file) {
      fileData = await fileToBase64(file); // نخزن الملف كـ base64
    }

    const newDeclaration = {
      id: Date.now(),
      title,
      justification,
      body,
      Fdate: today || new Date().toLocaleDateString("en-CA"),
      status: "معلق" as const,
      Ldate: "",
      userId: Number(currentUser.id),   // ✅ نحوله دايمًا لرقم
      userEmail: currentUser.email,
      attachment: fileData,
    };

    const saved = localStorage.getItem("declarations");
    const existing = saved ? JSON.parse(saved) : [];
    const updated = [...existing, newDeclaration];
    localStorage.setItem("declarations", JSON.stringify(updated));


    alert("تم إرسال القرار بنجاح ✅");
    navigate("/agency-dashboard"); // ← يرجع لصفحة قراراتي
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10" dir="rtl">
      <div className="w-full max-w-2xl mb-6 text-right">
        <button
          onClick={() => navigate("/agency-dashboard")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
        >
          <span>↩️</span>
          <span className="font-medium">العودة إلى قرارتى</span>
        </button>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">إنشاء قرار جديد</h1>
      <p className="text-gray-500 mb-8">املأ البيانات التالية لإنشاء قرار جديد.</p>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl space-y-6"
      >
        {/* العنوان */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">عنوان القرار</label>
          <input
            type="text"
            placeholder="مثال: قرار مالي للربع الثالث 2024"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* حيثيات */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">حيثيات القرار</label>
          <textarea
            placeholder="اكتب هنا حيثيات القرار بالكامل..."
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            rows={4}
            required
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
          ></textarea>
        </div>

        {/* نص القرار */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">نص القرار</label>
          <textarea
            placeholder="اكتب هنا محتوى القرار بالكامل..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            required
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
          ></textarea>
        </div>

        {/* المرفقات */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">المرفقات</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer text-blue-600 hover:underline"
            >
              {file ? `تم اختيار الملف: ${file.name}` : "قم برفع ملف أو اسحب وأفلت هنا"}
            </label>
            <p className="text-gray-400 text-sm mt-2">يدعم PNG, JPG, PDF حتى 10MB</p>
          </div>
        </div>

        {/* زر الإرسال */}
        <div className="text-left">
          <button
            type="submit"
            disabled={!today}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition disabled:opacity-50"
          >
            إرسال القرار
          </button>
        </div>
      </form>
    </div>
  );
}
