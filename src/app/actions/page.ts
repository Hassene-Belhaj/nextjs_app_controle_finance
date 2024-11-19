"use server";
import prisma from "../lib/prisma";
import { revalidatePath } from "next/cache";
import transactions from "../transactions/page";

interface IformAddBudget {
  email: string;
  name: string;
  amount: number;
  emoji: string | null;
}

export async function CheckUserAndAdd(email: string | undefined) {
  if (!email) return;
  try {
    const isExistingUser = await prisma.user.findUnique({ where: { email } });
    if (!isExistingUser) {
      await prisma.user.create({
        data: { email },
      });
      console.log("nouvel utilisateur ajouté dans la base de données");
    }
    return;
  } catch (error) {
    console.log("erreur lors de verification dans la base de données", error);
  }
}

export async function AddBudget({ email, name, amount, emoji }: IformAddBudget) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error("utilisateur non trouvé");
    }
    await prisma.budget.create({
      data: {
        name,
        amount,
        userId: user.id,
        emoji,
      },
    });
  } catch (error) {
    console.log("erreur lors de l'ajout du budget", error);
  }
}

export async function GetBudgets(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        budget: {
          include: {
            transactions: true,
          },
        },
      },
    });
    if (!user) {
      throw new Error("l'utilisateur est introuvable");
    }
    return user.budget;
  } catch (error) {
    console.log("erreur lors de la récupération des budgets", error);
  }
}

export async function GetSingleBudget(id: string) {
  try {
    const budgetId = await prisma.budget.findUnique({
      where: {
        id,
      },
      include: {
        transactions: true,
      },
    });
    return budgetId;
  } catch (error) {
    console.log("erreur lors de la récupération des budgets", error);
  }
}

export async function AddTransaction({ description, amount, emoji, budgetId }: { description: string; amount: number; emoji: string; budgetId: string }) {
  try {
    const isExistBudget = await prisma.budget.findUnique({
      where: { id: budgetId },
      include: { transactions: true },
    });
    if (!isExistBudget) throw new Error("le budget n'existe pas");

    const totalTransactions = isExistBudget.transactions.reduce((accu, transaction) => {
      return accu + transaction.amount;
    }, 0);

    if (amount + totalTransactions > isExistBudget.amount) throw new Error("cette transaction dépasse le budget");
    const transactionBudget = await prisma.transaction.create({
      data: {
        description,
        amount,
        emoji,
        budgetId,
      },
    });
    revalidatePath("/");
    return transactionBudget;
  } catch (error) {
    console.log("erreur lors de l'ajout de la transaction", error);
  }
}

export async function DeleteDudgetId(id: string) {
  try {
    await prisma.transaction.deleteMany({ where: { budgetId: id } });
    await prisma.budget.delete({ where: { id } });
  } catch (error) {
    console.log("error lors de la suppression du Budget et ses transactions", error);
  }
}

export async function DeleteTransactionId(id: string) {
  try {
    const isExist = await prisma.transaction.delete({ where: { id } });
    if (!isExist) throw new Error("cette transaction n'existe pas");
    revalidatePath("/");
  } catch (error) {
    console.log("error lors de la suppression de la transaction", error);
  }
}

export async function GetTransactionsByEmailAndPeriod(email: string, period: string) {
  try {
    const now = new Date();
    let dateLimit;

    switch (period) {
      case "last30":
        dateLimit = new Date(now);
        dateLimit.setDate(now.getDate() - 30);
        break;
      case "last90":
        dateLimit = new Date(now);
        dateLimit.setDate(now.getDate() - 90);
        break;
      case "last7":
        dateLimit = new Date(now);
        dateLimit.setDate(now.getDate() - 7);
        break;
      case "last365":
        dateLimit = new Date(now);
        dateLimit.setFullYear(now.getFullYear() - 1);
        break;
      default:
        throw new Error("Période invalide.");
    }
    const allTransactionsUser = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        budget: {
          include: {
            transactions: {
              where: {
                createdAT: {
                  gte: dateLimit,
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    if (!allTransactionsUser) throw new Error("l'utilisateur n'existe pas");

    const data = allTransactionsUser.budget.flatMap((budget) =>
      budget.transactions.map((transaction) => ({
        ...transaction,
        budgetName: budget.name,
        budgetId: budget.id,
      }))
    );
    return data;
  } catch (error) {
    console.log("error lors de la téléchargement des transactions", error);
  }
}
