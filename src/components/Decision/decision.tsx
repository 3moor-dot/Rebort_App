// src/components/UniversityDecision.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface Declaration {
  id: number;
  title: string;
  justification: string;
  body: string;
  Fdate: string;
  status: string;
  Ldate: string;
  userId: number;
  userEmail: string;
  attachment?: string;
}

interface User {
  id: number;
  email: string;
  password: string;
  role: "admin" | "agency" | "governor";
  agencyName?: string;
}

const UniversityDecision = () => {
  const { id } = useParams(); // 👈 هتجيب ID القرار من URL
  const [decision, setDecision] = useState<Declaration | null>(null);
  const [agencyName, setAgencyName] = useState<string>(".....................");
  const [openMenu, setOpenMenu] = useState(false);
  const [signatureType, setSignatureType] = useState<null | "electronic" | "real">(null);

  useEffect(() => {
    // جلب القرارات من localStorage
    const saved = localStorage.getItem("declarations");
    if (saved) {
      const parsed: Declaration[] = JSON.parse(saved);
      const found = parsed.find((d) => d.id === Number(id));
      if (found) {
        setDecision(found);

        // جلب اسم الجهة من users
        const users = localStorage.getItem("users");
        if (users) {
          const parsedUsers: User[] = JSON.parse(users);
          const foundUser = parsedUsers.find((u) => u.id === found.userId);
          if (foundUser && foundUser.agencyName) {
            setAgencyName(foundUser.agencyName);
          }
        }
      }
    }
  }, [id]);

  if (!decision) {
    return (
      <div dir="rtl" className="p-10 text-center text-red-600">
        ⚠️ لم يتم العثور على هذا القرار
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="bg-white min-h-screen p-10 flex flex-col items-center"
      style={{ fontFamily: "Sakkal Majalla, serif" }}
    >
      {/* الهيدر */}
      <div className="w-full grid grid-cols-3 items-center border-b pb-4 mb-6 text-center">
        <div>
          <h2 className="text-xl font-bold">جامعة جنوب الوادي</h2>
          <h3 className="text-lg">رئيس الجامعة</h3>
          <h4 className="text-md">قنا</h4>
        </div>
        <div className="flex justify-center">
          <img
            src="../images/SouthVally.png"
            alt="شعار الجامعة"
            className="h-40 w-40 object-contain"
          />
        </div>
        <div>
          <h2 className="text-xl font-bold">SOUTH VALLEY UNIVERSITY</h2>
          <h3 className="text-lg">PRESIDENT UNIVERSITY</h3>
          <h4 className="text-md">QENA</h4>
        </div>
      </div>

      {/* عنوان القرار */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold underline">{decision.title}</h1>
        <p className="text-lg mt-2">الصادر بتاريخ {decision.Fdate}</p>
      </div>

      {/* نص القرار */}
      <div className="w-full leading-relaxed text-justify text-lg space-y-4">
        <p>رئيس الجامعة:</p>

        {/* حيثيات القرار */}
        <p>{decision.justification}</p>

        <p className="font-bold text-center">قرر</p>

        {/* نص القرار */}
        <div className="whitespace-pre-line">{decision.body}</div>
      </div>

      {/* قسم الموافقة/الرفض */}
      <div className="w-full mt-10 p-6 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-bold mb-4 text-center">قرار المسؤول</h3>
        <div className="flex justify-center gap-4 flex-wrap">
          {/* موافقة مع منيو بالضغط */}
          <div className="relative">
            <button
              onClick={() => setOpenMenu((prev) => !prev)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              ✅ الموافقة
            </button>

            {openMenu && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    setSignatureType("electronic");
                    setOpenMenu(false);
                  }}
                  className="w-full text-right px-4 py-2 hover:bg-gray-100 text-black"
                >
                  ✍️ إمضاء إلكتروني
                </button>
                <button
                  onClick={() => {
                    setSignatureType("real");
                    setOpenMenu(false);
                  }}
                  className="w-full text-right px-4 py-2 hover:bg-gray-100 text-black"
                >
                  🖊️ إمضاء واقعي
                </button>
              </div>
            )}
          </div>

          <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            ❌ الرفض
          </button>
          <button className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
            ✏️ التعديل
          </button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            💬 تعليق
          </button>
        </div>
      </div>

      {/* التوقيع */}
      <div className="w-full mt-10 grid grid-cols-2">
        <div className="text-center ml-auto">
          <p className="font-bold">الجهة المعدة للقرار</p>
          <div className="mt-16">{agencyName}</div>
        </div>
        <div className="text-center mr-auto">
          <p className="font-bold">رئيس الجامعة</p>
          <div className="mt-16">
            {signatureType === "electronic" ? (
              <span className="text-black font-bold text-lg">د/ أحمد عكاوي</span>
            ) : (
              "....................."
            )}
          </div>
        </div>
      </div>

      {/* الفوتر */}
      <div className="w-full text-center border-t pt-4 mt-10 text-sm text-gray-600">
        <p>جامعة جنوب الوادي - مركز المعلومات ودعم اتخاذ القرار</p>
        <p>📞 (+20) 0965211279 | ✉️ psv@svu.edu.eg | PO Box 83523 - Qena</p>
      </div>
    </div>
  );
};

export default UniversityDecision;
