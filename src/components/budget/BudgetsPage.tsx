"use client";
import { useEffect, useState } from "react";
import BudgetItemCard from "./BudgetItemCard";
import { useUser } from "@clerk/nextjs";
import { GetBudgets } from "@/app/actions/page";
import Link from "next/link";
import { IBudget } from "@/utils/TypesTs";
import { Landmark } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import FormModal from "../modal/FormModal";

const BudgetsPage = () => {
  const { user } = useUser();
  const [Budgets, setBudgets] = useState<IBudget[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showFormModal, setShowFormModal] = useState<boolean>(false);

  const email = user?.primaryEmailAddress?.emailAddress;

  const getbudgets = async () => {
    try {
      setLoading(true);
      if (email) {
        const data = await GetBudgets(email);
        setBudgets(data as IBudget[]);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (email) {
      getbudgets();
    }
  }, [email]); //re-fetch budgets if open model

  if (!loading && !Budgets?.length)
    return (
      <div className="mt-[100px] py-16 w-full h-full text-center">
        <h2 className="w-full text-lg">Vous n'avez pas encore ajouter un budget</h2>
        <Link href={"/"} className="block py-8 underline underline-offset-8 text-indigo-600 ">
          la Page d'accueil
        </Link>
      </div>
    );
  return (
    <div className="my-[80px] w-full py-16 px-4 min-h-[calc(100vh_-_240px)] flex flex-col gap-8">
      <div>
        <AnimatePresence>{showFormModal && <FormModal showFormModal={showFormModal} setShowFormModal={setShowFormModal} />}</AnimatePresence>
      </div>
      <div className="pb-8 w-full flex justify-center items-center">
        <button onClick={() => setShowFormModal(!showFormModal)} className="h-12 px-8 bg-indigo-600 hover:bg-indigo-600/90 transition-opacity text-white rounded-full shadow-xl shadow-indigo-600/30 capitalize active:scale-95 flex justify-center items-center gap-4">
          Creez Un Budget
          <Landmark size={20} />
        </button>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-16 gap-x-8">
        {Budgets &&
          Budgets.map((budget: IBudget, i: number) => {
            return (
              <Link href={`/budgets/${budget.id}`} key={i}>
                <BudgetItemCard budget={budget} />
              </Link>
            );
          })}
      </div>
    </div>
  );
};

export default BudgetsPage;
