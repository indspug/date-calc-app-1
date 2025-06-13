import React, { useState } from "react";

// 日本語の曜日配列（日曜～土曜）
const japaneseWeekdays = ["日", "月", "火", "水", "木", "金", "土"];

const App: React.FC = () => {
  // 年号（AD/BC）、年、月、日を個別に管理するstate
  const [era, setEra] = useState<"AD" | "BC">("AD");
  const [year, setYear] = useState(""); // 年
  const [month, setMonth] = useState(""); // 月
  const [day, setDay] = useState(""); // 日
  const [offset, setOffset] = useState<number | "">(""); // 加減日数
  const [resultDate, setResultDate] = useState(""); // 計算結果の日付
  const [resultWeekday, setResultWeekday] = useState(""); // 計算結果の曜日

  // 入力された年月日が有効かどうかを判定
  const isDateValid = () => {
    if (!year || !month || !day) return false; // いずれかが未入力なら無効
    const y = Number(year);
    const m = Number(month);
    const d = Number(day);
    if (isNaN(y) || isNaN(m) || isNaN(d)) return false; // 数値でなければ無効
    if (m < 1 || m > 12 || d < 1 || d > 31) return false; // 月日が範囲外なら無効
    return true;
  };

  // グレゴリオ暦のうるう年判定
  function isLeapYear(era: "AD" | "BC", year: number) {
    // BCの場合は西暦に変換（例: 紀元前1年→0年、紀元前2年→-1年）
    let y = era === "BC" ? -year + 1 : year;
    if (y % 4 !== 0) return false;
    if (y % 100 === 0 && y % 400 !== 0) return false;
    return true;
  }
  // 指定した年月の月末日を返す
  function getMonthDays(era: "AD" | "BC", year: number, month: number) {
    if (month === 2) {
      return isLeapYear(era, year) ? 29 : 28; // 2月はうるう年判定
    }
    return [4, 6, 9, 11].includes(month) ? 30 : 31; // 4,6,9,11月は30日、それ以外は31日
  }
  // グレゴリオ暦で日数加減算を行う関数
  function addDays(era: "AD" | "BC", year: number, month: number, day: number, offset: number) {
    let y = year;
    let m = month;
    let d = day;
    let e = era;
    let n = offset; // 加減する日数
    // nが0になるまでループ（正負両対応）
    while (n !== 0) {
      if (n > 0) {
        let mdays = getMonthDays(e, y, m); // 今の月の日数
        if (d + n <= mdays) {
          d += n; // 月内で収まる場合
          n = 0;
        } else {
          n -= (mdays - d + 1); // 月末まで進めてnを減らす
          d = 1; // 翌月1日へ
          m++;
          if (m > 12) {
            m = 1;
            // 年号・年の繰り上げ（紀元前→紀元後の跨ぎも考慮）
            if (e === "BC" && y === 1) {
              e = "AD";
              y = 1;
            } else if (e === "BC") {
              y--;
            } else {
              y++;
            }
          }
        }
      } else {
        // nが負の場合（日付を戻す）
        if (d + n > 0) {
          d += n;
          n = 0;
        } else {
          m--;
          if (m < 1) {
            m = 12;
            // 年号・年の繰り下げ（紀元後→紀元前の跨ぎも考慮）
            if (e === "AD" && y === 1) {
              e = "BC";
              y = 1;
            } else if (e === "AD") {
              y--;
            } else {
              y++;
            }
          }
          let mdays = getMonthDays(e, y, m); // 前月の日数
          n += d; // nに今月分を戻す
          d = mdays; // 前月末日へ
        }
      }
    }
    return { era: e, year: y, month: m, day: d };
  }
  // 曜日計算（グレゴリオ暦のZellerの公式を利用）
  function calcWeekday(era: "AD" | "BC", year: number, month: number, day: number) {
    // BCの場合は西暦に変換
    let y = era === "BC" ? -year + 1 : year;
    let m = month;
    if (m < 3) {
      m += 12;
      y--;
    }
    // Zellerの公式（0:土曜, 1:日曜, ... 6:金曜）
    let w = (day + Math.floor(2.6 * (m + 1)) + y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400)) % 7;
    // 0:日曜, 6:土曜に変換
    w = (w + 6) % 7;
    return w;
  }

  // 日付計算ボタン押下時の処理
  const handleCalculate = () => {
    if (!isDateValid() || offset === "") {
      setResultDate("");
      setResultWeekday("");
      return;
    }
    let y = Number(year);
    let m = Number(month);
    let d = Number(day);
    let e = era;
    // 日付加減算
    const { era: newEra, year: newYear, month: newMonth, day: newDay } = addDays(e, y, m, d, Number(offset));
    // 曜日計算
    const weekday = calcWeekday(newEra, newYear, newMonth, newDay);
    // 結果をstateにセット
    setResultDate(`${newEra === "BC" ? "紀元前" : ""}${newYear}-${String(newMonth).padStart(2, "0")}-${String(newDay).padStart(2, "0")}`);
    setResultWeekday(japaneseWeekdays[weekday]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">日付計算アプリ</h1>
        {/* 年号・年月日入力欄 */}
        <div className="mb-4 flex gap-2 items-end">
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700">年号</label>
            {/* 西暦/紀元前の選択 */}
            <select className="border rounded-xl px-2 py-1" value={era} onChange={e => setEra(e.target.value as "AD" | "BC")}> 
              <option value="AD">西暦</option>
              <option value="BC">紀元前</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700">年</label>
            {/* 年入力欄 */}
            <input type="number" className="border rounded-xl px-2 py-1 w-20" value={year} onChange={e => setYear(e.target.value.replace(/[^0-9]/g, ""))} min="1" placeholder="例: 2024" />
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700">月</label>
            {/* 月入力欄 */}
            <input type="number" className="border rounded-xl px-2 py-1 w-14" value={month} onChange={e => setMonth(e.target.value.replace(/[^0-9]/g, ""))} min="1" max="12" placeholder="1" />
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700">日</label>
            {/* 日入力欄 */}
            <input type="number" className="border rounded-xl px-2 py-1 w-14" value={day} onChange={e => setDay(e.target.value.replace(/[^0-9]/g, ""))} min="1" max="31" placeholder="1" />
          </div>
        </div>
        {/* 日数加減欄 */}
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
        {/* 計算ボタン */}
        <button
          className="w-full bg-blue-600 py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
          onClick={handleCalculate}
          disabled={!isDateValid() || offset === ""}
        >
          計算
        </button>
        {/* 結果表示欄 */}
        {resultDate && (
          <div className="mt-6 text-center">
            <span className="text-gray-700 font-medium">結果日付:</span>
            <span className="ml-2 text-lg font-bold text-blue-700">{resultDate}（{resultWeekday}）</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
