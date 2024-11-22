"use client";

import { getAllCompleteBudgetsAmount, GetLastBudgets, getTotalTransactionsAmount, getTotalTransactionsCount, GetUserDataCharts, Last10transactions } from "@/app/actions/page";
import { useUser } from "@clerk/nextjs";
import { ArrowRightLeft, BadgeEuro, BarChart, Landmark } from "lucide-react";
import { useEffect, useState } from "react";
import { ChartUi } from "../chart/ChartUi";
import { IBudget, IchartData, Itransaction } from "@/utils/TypesTs";
import Link from "next/link";
import LoadingSpinner from "@/utils/loadingSpinner/LoadingSpinner";
import BudgetItemCard from "../budget/BudgetItemCard";
import TransactionsTable from "../transactions/TransactionsTable";

const DashboardPage = () => {
  const { user } = useUser();
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [transactionsCount, setTransactionsCount] = useState<number | null>(null);
  const [completeBudget, setCompleteBudget] = useState<string | null>(null);
  const [chartData, setChartData] = useState<IchartData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastBudgets, setLastBudgets] = useState<IBudget[] | null>(null);
  const [lastTransactions, setLastTransactions] = useState<Itransaction[] | null>(null);
  const email = user?.primaryEmailAddress?.emailAddress as string;

  // console.log(chartData);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data1 = await getTotalTransactionsCount(email);
      setTransactionsCount(data1 as number);
      const data2 = await getTotalTransactionsAmount(email);
      setTotalAmount(data2 as number);
      const data3 = await getAllCompleteBudgetsAmount(email);
      setCompleteBudget(data3 as string);
      const data4 = await GetUserDataCharts(email);
      setChartData(data4 as IchartData[] | null);
      const data5 = await GetLastBudgets(email);
      setLastBudgets(data5 as IBudget[] | null);
      const Data6 = await Last10transactions(email);
      setLastTransactions(Data6 as Itransaction[]);
    } catch (error) {
      console.log("erreur lors de la récupération de la nombre des transactions");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (email) {
      fetchData();
    }
  }, [email]);

  if (loading)
    return (
      <div className="my-[80px] w-full py-16 min-h-screen  ">
        <LoadingSpinner />
      </div>
    );
  if (transactionsCount === 0)
    return (
      <div className="my-[80px] w-full py-16 min-h-screen text-center">
        <h2 className="w-full text-lg">Vous n'avez pas encore de transactions enregistrées</h2>
        <Link href={"/"} className="block py-8 underline underline-offset-8 text-indigo-600 ">
          la Page d'accueil
        </Link>
      </div>
    );

  return (
    <div className="my-[80px] pt-16 pb-32 px-4 w-full min-h-[calc(100vh_-_240px)]">
      <div className="w-full flex-col md:flex-row flex gap-4">
        <div className="w-full md:w-1/3 ">
          <div className="w-full border-[2px] rounded-lg p-4 flex justify-between items-center gap-4 ">
            <div>
              <h3>Total des transactions</h3>
              <p className="py-2 text-4xl">{totalAmount || "N/A"} €</p>
            </div>
            <div>
              <BadgeEuro size={50} />
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/3 ">
          <div className="w-full border-[2px] rounded-lg p-4 flex justify-between items-center gap-4 ">
            <div>
              <h3>Nombre des transaction(s)</h3>
              <p className="py-2 text-4xl flex justify-start items-center gap-2 ">{transactionsCount || "N/A"}</p>
            </div>
            <div>
              <ArrowRightLeft size={50} />
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/3 ">
          <div className="w-full border-[2px] rounded-lg p-4 flex justify-between items-center gap-4 ">
            <div>
              <h3>Budget(s) Atteint(s)</h3>
              <p className="py-2 text-4xl  font-normal">{completeBudget || "N/A"}</p>
            </div>
            <div>
              <Landmark size={50} />
            </div>
          </div>
        </div>
      </div>
      <div className="my-8 w-full flex flex-col md:flex-row gap-8">
        <div className="w-full h-auto md:w-1/2 rounded-lg">
          <div className="w-full border-[2px] rounded-lg">
            <h3 className="px-8 py-8 text-2xl text-center">Les Statistiques en €</h3>
            {chartData ? <ChartUi chart={chartData} /> : null}
          </div>

          <div className="w-full mt-6 overflow-auto">
            <h3 className="px-8 py-8 text-2xl text-center">Les Dernières 10 transactions</h3>
            {lastTransactions && <TransactionsTable transactions={lastTransactions} />}
          </div>
        </div>

        <div className="w-full h-[500px] md:w-1/2 flex flex-col gap-6 ">
          <h3 className="text-center px-4 py-8 md:py-2 text-2xl">Les Derniers Budgets Ajoutés</h3>
          {lastBudgets?.map((b, i) => {
            return (
              <Link key={i} href={`/budgets/${b.id}`}>
                <BudgetItemCard budget={b} />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
