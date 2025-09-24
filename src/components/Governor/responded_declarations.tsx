import React from "react";

const RespondedDeclarations: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">الإقرارات التي تم الرد عليها</h2>
      {/* هنا هتعرض اللي اترد عليهم (مقبول / مرفوض) */}
    </div>
  );
};

export default RespondedDeclarations;
