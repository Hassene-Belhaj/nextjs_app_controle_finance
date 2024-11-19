"use client";

interface Iperiod {
  period: string;
  setPeriod: React.Dispatch<React.SetStateAction<string>>;
}

const SelectOptions = ({ period, setPeriod }: Iperiod) => {
  return (
    <select onChange={(e) => setPeriod(e.target.value)} defaultValue="last7" className="w-[200px] py-2 px-2 border-2 rounded-md outline-offset-4">
      <option value="last7">Derniers 7 jours</option>
      <option value="last30">Derniers 30 jours</option>
      <option value="last90">Derniers 90 jours</option>
      <option value="last365">Derniers 365 jours</option>
    </select>
  );
};

export default SelectOptions;
