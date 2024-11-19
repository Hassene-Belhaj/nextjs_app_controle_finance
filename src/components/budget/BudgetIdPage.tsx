"use client";
import { IBudget, Itransaction } from "@/utils/TypesTs";
import BudgetItemCard from "./BudgetItemCard";
import { FaTrash } from "react-icons/fa";
import { FormEvent, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import EmojiPicker from "emoji-picker-react";
import { GrTransaction } from "react-icons/gr";
import {
  AddTransaction,
  DeleteDudgetId,
  DeleteTransactionId,
} from "@/app/actions/page";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const BudgetIdPage = ({ budget }: { budget: IBudget }) => {
  const navigate = useRouter();
  const [myTransaction, setMytransaction] = useState<string>("");
  const [myAmount, setMyAmount] = useState<string>("");
  const [emoji, setEmoji] = useState<string>("");
  const [showEmoji, setShowEmoji] = useState<boolean>(false);
  const handleSelectEmoji = (emojiObject: { emoji: string }) => {
    setEmoji(emojiObject.emoji);
    setShowEmoji(!showEmoji);
  };

  const handleSubmitTransaction = async (e: FormEvent) => {
    e.preventDefault();
    if (!myTransaction)
      return toast.error("veuillez remplir le champ : nom de la transaction");
    if (!myAmount)
      return toast.error(
        "veuillez  remplir le champ : montant de la transaction"
      );
    if (!emoji) return toast.error("ajouter un emoji");
    const amount = parseInt(myAmount);
    if (budget.transactions) {
      const totalTransactions = budget.transactions.reduce(
        (accu, transaction) => {
          return accu + transaction.amount;
        },
        0
      );
      if (amount + totalTransactions > budget.amount) {
        return toast.error(
          "le montant de votre transaction dépasse votre budget"
        );
      }
    }
    try {
      await AddTransaction({
        description: myTransaction,
        amount,
        emoji,
        budgetId: budget.id,
      });
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    const confirmDeleteTransaction = window.confirm(
      "Etes vous sure de vouloir suprrimer cette transaction ?"
    );
    try {
      if (confirmDeleteTransaction) {
        await DeleteTransactionId(id);
        return toast.success("la transaction est supprimée");
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteBudget = async () => {
    const confirmDeleteBudget = window.confirm(
      "Etes vous sure de vouloir suprrimer ce budget ?"
    );
    try {
      if (confirmDeleteBudget) {
        await DeleteDudgetId(budget.id);
        navigate.push("/budgets");
        return toast.success("le Budget est supprimé");
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="my-16 p-4 flex flex-col lg:flex-row lg:gap-4 gap-16">
      <div className="w-full lg:w-1/2">
        <div>
          <BudgetItemCard budget={budget} />
          <div className="py-8 xs:max-w-[500px] w-full flex justify-end items-center m-auto">
            <button
              onClick={handleDeleteBudget}
              className="px-4 h-12 bg-indigo-600 text-white shadow-xl rounded-full shadow-indigo-600/30  hover:bg-indigo-600/90 flex justify-center items-center gap-4 transition-opacity active:scale-95"
            >
              Supprimer le budget <FaTrash />
            </button>
          </div>
        </div>
        <div className="py-8 max-w-[500px] flex flex-col mx-auto gap-4 border-2 rounded-lg p-4">
          <h2 className="py-4 text-center text-xl">Ajoutez votre dépense</h2>
          <div className="flex justify-end items-center gap-4"></div>
          <form
            onSubmit={handleSubmitTransaction}
            className="py-4 w-full flex flex-col justify-center items-center gap-6"
          >
            <label className="w-full">
              <input
                name="nom_transaction"
                type="text"
                className="bg-gray-200 text-black w-full h-12 outline-none border-2 border-secondary focus:border-tertiary pl-4 rounded-lg duration-300 ease-in-out"
                placeholder="Nom de Transaction"
                value={myTransaction}
                onChange={(e) => setMytransaction(e.target.value)}
              />
            </label>
            <label className="w-full">
              <input
                name="montant_transaction"
                type="number"
                className="bg-gray-200 text-black w-full h-12 outline-none border-2 border-secondary focus:border-tertiary pl-4 rounded-lg duration-300 ease-in-out"
                placeholder="Montant de Transaction"
                value={myAmount}
                onChange={(e) => setMyAmount(e.target.value)}
              />
            </label>
            <div className="w-full flex justify-center items-center">
              {!showEmoji ? (
                <>
                  {emoji ? (
                    <div className="w-full bg-transparent border-2 border-secondary text-center py-4 relative rounded-full">
                      <AiOutlineClose
                        onClick={() => setEmoji("")}
                        className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer"
                      />
                      {emoji}
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowEmoji(!showEmoji)}
                      className="w-full bg-gray-200 text-black h-12 rounded-lg border-2 shadow-md active:scale-95"
                    >
                      Ajouter un emoji
                    </button>
                  )}
                </>
              ) : (
                <div className="w-full h-full p-2 mx-auto relative">
                  <button className="px-2">
                    <AiOutlineClose
                      className="absolute top-2 right-2 cursor-pointer"
                      onClick={() => setShowEmoji(!showEmoji)}
                    />
                  </button>
                  <EmojiPicker
                    width={"100%"}
                    height={400}
                    onEmojiClick={handleSelectEmoji}
                  ></EmojiPicker>
                </div>
              )}
            </div>
            <div className="w-full py-4">
              <button className="w-full h-12 bg-indigo-600 text-white shadow-xl rounded-full  shadow-indigo-600/30  hover:bg-indigo-600/90 transition-opacity active:scale-95">
                Ajoutez votre dépense
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="w-full lg:w-1/2 px-4 overflow-auto">
        {budget.transactions?.length === 0 ? (
          <div className="w-full text-center">
            <h2>Il n'y a pas encore de dépenses.</h2>
          </div>
        ) : (
          <table className="w-full table-auto text-sm tracking-tight mx-auto divide-y-2">
            <thead>
              <tr className="text-tertiary">
                <th></th>
                <th className="p-4">Montant</th>
                <th className="p-4">Description</th>
                <th className="p-4">Date</th>
                <th className="p-4">heure</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="w-full text-center divide-y-2">
              {budget.transactions?.map((t: Itransaction, i: number) => {
                return (
                  <tr key={i}>
                    <td>
                      <GrTransaction className="" />
                    </td>
                    <td className="p-4">-{t.amount} €</td>
                    <td className="p-4 capitalize">{t.description}</td>
                    <td className="p-4">
                      {new Date(t.createdAT).toLocaleDateString("fr-FR", {
                        dateStyle: "medium",
                      })}
                    </td>
                    <td className="p-4">
                      {/* {new Date(t.createdAT).getHours()}:{new Date(t.createdAT).getMinutes()} */}
                      {new Date(t.createdAT).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => handleDeleteTransaction(t.id)}
                        className="active:scale-95"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BudgetIdPage;
