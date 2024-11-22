"use client";

import { Itransaction } from "@/utils/TypesTs";
import { ArrowLeftRight, Link as Link2 } from "lucide-react";

import Link from "next/link";
interface ItransactionsProps {
  transactions: Itransaction[];
}

const TransactionsTable = ({ transactions }: ItransactionsProps) => {
  return (
    <table className="w-full table-auto divide-y-2 text-sm font-normal">
      <thead>
        <tr className="">
          <th className="p-4"></th>
          <th className="p-4"></th>
          <th className="p-4">Montant</th>
          <th className="p-4 capitalize">Budget</th>
          <th className="p-4">Date et Heure</th>
          <th className="p-4">Lien</th>
        </tr>
      </thead>
      <tbody className="divide-y-2">
        {transactions.map((t: Itransaction, i: number) => {
          return (
            <tr key={i} className="text-center">
              <td>{i + 1}</td>
              <td className="p-4">
                <ArrowLeftRight />
              </td>
              <td className="p-4">-{t.amount} €</td>
              <td className="p-4">{t.budgetName}</td>
              <td className="p-4">
                {new Date(t.createdAT).toLocaleDateString("fr-FR")} à{" "}
                {new Date(t.createdAT).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </td>
              <td className="p-4">
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
  );
};

export default TransactionsTable;
