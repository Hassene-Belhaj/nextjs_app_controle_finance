"use client";

interface IbudgetItem {
  budget: IBudget;
}

import { IBudget } from "@/utils/TypesTs";

const BudgetItemCard = ({ budget }: IbudgetItem) => {
  const transactionsTotal =
    budget.transactions && budget.transactions.length > 0
      ? budget?.transactions?.reduce((sum, transaction) => {
          return sum + transaction.amount;
        }, 0)
      : 0;

  const average = (transactionsTotal / budget.amount) * 100;

  const restAmount = budget.amount - transactionsTotal;

  const BG = () => {
    switch (true) {
      case average <= 50:
        return "bg-indigo-600";
      case average > 50 && average <= 75:
        return "bg-gradient-to-r from-indigo-600 to-red-400";
      case average > 75 && average <= 90:
        return "bg-gradient-to-r from-indigo-600 to-red-600";
      case average > 90 && average <= 99:
        return "bg-gradient-to-r from-indigo-600 to-red-500";
      case average === 100:
        return "bg-red-600";
      default:
        return;
    }
  };

  return (
    <div className="xs:max-w-[500px] w-full mx-auto h-full flex flex-col border-2 border-gray-200 dark:border-gray-800 hover:shadow-indigo-400/50 hover:shadow-2xl duration-300 ease-in-out rounded-lg  gap-6 py-8 px-4 cursor-pointer">
      <div className="flex justify-between items-center gap-4">
        <div className="flex justify-center items-center gap-4">
          <span className="w-12 h-12 flex justify-center items-center rounded-full bg-gray-200">{budget.emoji ? budget.emoji : "💰"}</span>
          <span className="flex flex-col gap-2">
            <h2>{budget.name}</h2>
            <h3 className="text-gray-500 text-sm">{budget?.transactions?.length} transaction(s)</h3>
          </span>
        </div>
        <span>{budget.amount} €</span>
      </div>
      <div className="flex justify-between items-center gap-4 text-gray-500 text-sm">
        <h3>{transactionsTotal} € depensés</h3>
        <h3>{restAmount} € restants</h3>
      </div>
      <div className="h-4 w-full relative bg-gray-200 dark:bg-gray-600 rounded-full">
        <div className={`h-full absolute top-0 left-0 rounded-full z-20 ${BG()} duration-300 ease-linear`} style={{ width: `${average}%` }}></div>
      </div>
    </div>
  );
};

export default BudgetItemCard;
