"use client";
import { useEffect, useState } from "react";
import { GetTransactionsByEmailAndPeriod } from "@/app/actions/page";
import { useUser } from "@clerk/nextjs";
import { Itransaction } from "@/utils/TypesTs";
import SelectOptions from "../select/SelectOptions";
import { GrTransaction } from "react-icons/gr";
import Link from "next/link";
import { Link as Link2 } from "lucide-react";

const TransactionsPage = () => {
  const { user } = useUser();
  const [period, setPeriod] = useState<string>("last7");
  const [transactions, setTransactions] = useState<Itransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  console.log(transactions);

  const getTransactions = async (period: string) => {
    if (user?.primaryEmailAddress?.emailAddress) {
      try {
        setLoading(true);
        const data = await GetTransactionsByEmailAndPeriod(user?.primaryEmailAddress?.emailAddress, period);
        setTransactions(data as Itransaction[]);
      } catch (error) {
        console.error("Erreur lors de la récupération des transactions: ", error);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      getTransactions(period);
    }
  }, [user?.primaryEmailAddress?.emailAddress, period]);

  // if (loading) {
  //   return (
  //     <div className="mt-16 p-4 flex justify-center items-center">
  //       <h3>...loading</h3>
  //     </div>
  //   );
  // }

  return (
    <div className="mt-16 p-4 w-full">
      <div className="max-w-7xl flex justify-end items-center gap-4 m-auto">
        <SelectOptions period={period} setPeriod={setPeriod} />
      </div>
      <div className="max-w-7xl py-16 m-auto">
        <table className="w-full table-auto  divide-y-2 text-sm font-normal">
          <thead>
            <tr className="">
              <th className="p-6"></th>
              <th className="p-6">Montant</th>
              <th className="p-6 capitalize">Budget</th>
              <th className="p-6">Date et Heure</th>
              <th className="p-6">Lien</th>
            </tr>
          </thead>
          <tbody className="divide-y-2">
            {transactions.map((t: Itransaction, i: number) => {
              return (
                <tr key={i} className="text-center">
                  <td className="p-6">
                    <GrTransaction className="" />
                  </td>
                  <td className="p-6">-{t.amount} €</td>
                  <td className="p-6">{t.budgetName}</td>
                  <td className="p-6">
                    {new Date(t.createdAT).toLocaleDateString("fr-FR")} à{" "}
                    {new Date(t.createdAT).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>
                  <td className="p-6">
                    <span>
                      <Link href={`/budgets/${t.budgetId}`} className="w-full flex justify-center items-center gap-2 hover:underline hover:text-indigo-600 underline-offset-8 transition-colors">
                        <Link2 /> Voir Plus
                      </Link>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsPage;
