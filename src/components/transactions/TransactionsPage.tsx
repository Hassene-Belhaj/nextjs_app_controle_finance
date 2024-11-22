"use client";
import { useEffect, useState } from "react";
import { GetTransactionsByEmailAndPeriod } from "@/app/actions/page";
import { useUser } from "@clerk/nextjs";
import { Itransaction } from "@/utils/TypesTs";
import SelectOptions from "../select/SelectOptions";
import Link from "next/link";
import TransactionsTable from "./TransactionsTable";
import LoadingSpinner from "@/utils/loadingSpinner/LoadingSpinner";

const TransactionsPage = () => {
  const { user } = useUser();
  const [period, setPeriod] = useState<string>("last7");
  const [transactions, setTransactions] = useState<Itransaction[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // console.log(transactions);

  const email = user?.primaryEmailAddress?.emailAddress;

  const getTransactions = async (period: string) => {
    if (email) {
      try {
        setLoading(true);
        const data = await GetTransactionsByEmailAndPeriod(email, period);
        setTransactions(data as Itransaction[]);
      } catch (error) {
        console.error("Erreur lors de la récupération des transactions: ", error);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (email) {
      getTransactions(period);
    }
  }, [email, period]);

  if (loading)
    return (
      <div className="my-[80px] w-full py-16 min-h-screen ">
        <LoadingSpinner />
      </div>
    );

  if (!transactions?.length)
    return (
      <div className="my-[80px] w-full py-16 min-h-screen text-center">
        <h2 className="w-full text-lg">Vous n'avez pas encore de transactions enregistrées</h2>
        <Link href={"/"} className="block py-8 underline underline-offset-8 text-indigo-600 ">
          la Page d'accueil
        </Link>
      </div>
    );
  return (
    <div className="my-[80px] w-full py-16 min-h-[calc(100vh_-_240px)] ">
      {transactions && (
        <>
          <div className="w-full flex justify-end items-center gap-4 m-auto">
            <SelectOptions period={period} setPeriod={setPeriod} />
          </div>
          <div className="py-16">
            <div className="max-w-7xl m-auto overflow-auto rounded-lg border-[1px]">
              <TransactionsTable transactions={transactions} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionsPage;
