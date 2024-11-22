"use client";
import { useState } from "react";
import FormModal from "../modal/FormModal";
import { AnimatePresence } from "framer-motion";
import Exemples_Budgets from "@/utils/ExempleCards";
import BudgetItemCard from "../budget/BudgetItemCard";
import { IBudget } from "@/utils/TypesTs";
import { Landmark } from "lucide-react";

const Main = () => {
  const [showFormModal, setShowFormModal] = useState<boolean>(false);

  return (
    <div className="my-[80px] w-full py-16 min-h-[calc(100vh_-_240px)] flex flex-col justify-center items-center md:px-8">
      <div>
        <AnimatePresence>{showFormModal && <FormModal showFormModal={showFormModal} setShowFormModal={setShowFormModal} />}</AnimatePresence>
      </div>
      <h1 className="text-4xl md:text-6xl font-semibold text-center p-10">Prenez Le Contrôle de vos finances </h1>
      <p className="text-center text-xl">Suivez vos budgets et vos dépenses en toute simplicité avec notre application intuitive !</p>
      <div className="w-full flex justify-center items-center gap-8 py-6 "></div>

      {/* modal */}
      <button onClick={() => setShowFormModal(!showFormModal)} className="h-12 px-8 bg-indigo-600 hover:bg-indigo-600/90 transition-opacity text-white rounded-full shadow-xl shadow-indigo-600/30 capitalize active:scale-95 flex justify-center items-center gap-4">
        Creez Un Budget
        <Landmark size={20} />
      </button>
      <div className="py-16 px-8 text-4xl">
        <h2>Exemples de Budgets</h2>
      </div>
      <div className="w-full px-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-16 gap-x-8 ">
        {Exemples_Budgets.map((budget: IBudget, i: number) => {
          return <BudgetItemCard key={i} budget={budget} />;
        })}
      </div>
    </div>
  );
};

export default Main;
