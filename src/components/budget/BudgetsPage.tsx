"use client";
import { useEffect, useState } from "react";
import BudgetItemCard from "./BudgetItemCard";
import { useUser } from "@clerk/nextjs";
import { GetBudgets } from "@/app/actions/page";
import { IBudget } from "@/utils/TypesTs";
import Link from "next/link";

const BudgetsPage = () => {
  const { user } = useUser();
  const [Budgets, setBudgets] = useState<IBudget[] | undefined>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getbudgets = async () => {
    try {
      setLoading(true);
      if (user?.primaryEmailAddress?.emailAddress) {
        const data = await GetBudgets(user?.primaryEmailAddress?.emailAddress);
        setBudgets(data);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getbudgets();
  }, [user?.primaryEmailAddress?.emailAddress]);

  if (!loading && !Budgets)
    return (
      <div className="my-16 w-full h-full text-center">
        <h2 className="w-full text-lg">Vous n'avez pas encore de budget</h2>
        <Link href={"/"} className="block py-8 underline underline-offset-8 text-indigo-600 ">
          la Page d'accueil
        </Link>
      </div>
    );
  return (
    <div className="my-16 p-4 flex flex-col gap-8">
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
