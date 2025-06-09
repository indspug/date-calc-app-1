import React, { useState } from "react";

const App: React.FC = () => {
  const [startDate, setStartDate] = useState("");
  const [offset, setOffset] = useState<number | "">("");
  const [resultDate, setResultDate] = useState("");

  const handleCalculate = () => {
    if (!startDate || offset === "") {
      setResultDate("");
      return;
    }
    const date = new Date(startDate);
    date.setDate(date.getDate() + Number(offset));
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    setResultDate(`${yyyy}-${mm}-${dd}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">日付計算アプリ</h1>
        <div className="mb-4">
          <label className="block text-sm mb-1 font-medium text-gray-700">起点日付</label>
          <input
            type="date"
            className="w-full border rounded-xl px-3 py-2"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm mb-1 font-medium text-gray-700">加減日数（±）</label>
          <input
            type="number"
            className="w-full border rounded-xl px-3 py-2"
            value={offset}
            onChange={(e) => setOffset(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="例: 5 または -3"
          />
        </div>
        <button
          className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
          onClick={handleCalculate}
          disabled={!startDate || offset === ""}
        >
          計算
        </button>

        {resultDate && (
          <div className="mt-6 text-center">
            <span className="text-gray-700 font-medium">結果日付:</span>
            <span className="ml-2 text-lg font-bold text-blue-700">{resultDate}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
