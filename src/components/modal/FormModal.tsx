"use client";

import { AddBudget } from "@/app/actions/page";
import { useUser } from "@clerk/nextjs";
import { SetStateAction, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import toast from "react-hot-toast";
import { AiOutlineClose } from "react-icons/ai";
import { motion } from "framer-motion";

interface Imodal {
  showFormModal: boolean;
  setShowFormModal: React.Dispatch<SetStateAction<boolean>>;
}

const FormModal = ({ showFormModal, setShowFormModal }: Imodal) => {
  const { user } = useUser();
  const [mybudget, setMyBudget] = useState<string>("");
  const [myAmount, setMyAmount] = useState<string>("");
  const [emoji, setEmoji] = useState<string>("");
  const [showEmoji, setShowEmoji] = useState<boolean>(false);
  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const amount = parseInt(myAmount);
      console.log(amount);
      if (amount <= 0 || NaN) {
        return toast.error("le montant doit etre un nombe positif");
      }
      if (!mybudget) return toast.error("entrez le nom de votre budget");
      if (!amount) return toast.error("entrez le montant de votre budget");
      await AddBudget({
        email: user?.primaryEmailAddress?.emailAddress as string,
        name: mybudget,
        amount,
        emoji,
      });
      setMyBudget("");
      setMyAmount("");
      setEmoji("");
      setShowFormModal(!showFormModal);

      return toast.success("le budget est ajouté avec succes");
    } catch (error) {
      console.log(error);
      return toast.error("Erreur lors de la creation du budget");
    }
  };

  const handleSelectEmoji = (emojiObject: { emoji: string }) => {
    setEmoji(emojiObject.emoji);
    setShowEmoji(!showEmoji);
  };

  return (
    <motion.div onClick={() => setShowFormModal(!showFormModal)} className="fixed inset-0 w-full h-screen flex justify-center items-center bg-black/80 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} exit={{ opacity: 0, transition: { duration: 0.2 } }}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="xs:max-w-[600px] w-[800px] h-auto rounded-lg overflow-hidden mx-4 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        exit={{ opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } }}
      >
        <span className="top-0 right-0 ">
          <AiOutlineClose className="absolute top-4 right-4 cursor-pointer" onClick={() => setShowFormModal(!showFormModal)} />
        </span>
        <div className="w-full h-full bg-secondary p-8 flex flex-col justify-center items-center gap-4 bg-white text-black">
          <h3 className="py-2 w-full text-lg text-center">Creation d'un budget</h3>
          <p className="py-2">Permer de controler ses dépenses facilement</p>
          <form id="form" onSubmit={handleAction} className="w-full flex flex-col justify-center items-center gap-6">
            <label className="w-full">
              <input name="nom_budget" type="text" className="input w-full h-12 outline-none bg-gray-200 pl-4 rounded-lg duration-300 ease-in-out" placeholder="Nom du Budget" value={mybudget} onChange={(e) => setMyBudget(e.target.value)} />
            </label>
            <label className="w-full">
              <input name="montant" type="number" className="input w-full h-12 outline-none  bg-gray-200 pl-4 rounded-lg duration-300 ease-in-out" placeholder="Montant du Budget" value={myAmount} onChange={(e) => setMyAmount(e.target.value)} />
            </label>
            <div className="w-full flex justify-center items-center">
              {!showEmoji ? (
                <>
                  {emoji ? (
                    <div className="w-full bg-transparent border-2 border-secondary text-center py-4 relative rounded-full">
                      <AiOutlineClose onClick={() => setEmoji("")} className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer" />
                      {emoji}
                    </div>
                  ) : (
                    <button onClick={() => setShowEmoji(!showEmoji)} className="w-full bg-transparent h-12 rounded-lg border-2 border-black/70 shadow-md active:scale-95 ">
                      Ajouter un emoji
                    </button>
                  )}
                </>
              ) : (
                <div className="w-full h-full p-2 mx-auto relative">
                  <button className="px-2">
                    <AiOutlineClose className="absolute top-2 right-2 cursor-pointer" onClick={() => setShowEmoji(!showEmoji)} />
                  </button>
                  <EmojiPicker width={"100%"} height={400} onEmojiClick={handleSelectEmoji}></EmojiPicker>
                </div>
              )}
            </div>
            <div className="w-full py-4">
              <button className="w-full h-12 bg-indigo-600 text-secondary dark:text-primary rounded-full active:scale-95 shadow-md transition-colors">Ajouter Budget</button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FormModal;
