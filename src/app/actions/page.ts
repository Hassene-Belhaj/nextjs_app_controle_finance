"use server";
import prisma from "../lib/prisma";
import { revalidatePath } from "next/cache";

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
    revalidatePath("/");
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
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
    if (!user) {
      throw new Error("Utilisateur non trouvé");
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
        transactions: {
          orderBy: {
            createdAT: "desc",
          },
        },
      },
    });
    return budgetId;
  } catch (error) {
    console.log("erreur lors de la récupération des budgets", error);
  }
}

export async function AddTransaction({ description, amount, budgetId }: { description: string; amount: number; budgetId: string }) {
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
              orderBy: {
                createdAT: "desc",
              },
            },
          },
        },
      },
    });
    if (!allTransactionsUser) throw new Error("l'utilisateur n'existe pas");

    const data = allTransactionsUser.budget.flatMap((b) =>
      b.transactions.map((transaction) => ({
        ...transaction,
        budgetName: b.name,
        budgetId: b.id,
      }))
    );
    return data;
  } catch (error) {
    console.log("error lors de la téléchargement des transactions", error);
  }
}

export async function getTotalTransactionsAmount(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        budget: {
          include: {
            transactions: true,
          },
        },
      },
    });
    if (!user) throw new Error("Utilisateur non trouvé");
    const totalTransactions = user.budget.reduce((sum, b) => {
      return sum + b.transactions.reduce((sum, t) => sum + t.amount, 0);
    }, 0);
    return totalTransactions;
  } catch (error) {
    console.log("error lors du calcul du montant total des transactions", error);
  }
}

export async function getTotalTransactionsCount(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        budget: {
          include: {
            transactions: true,
          },
        },
      },
    });
    if (!user) throw new Error("Utilisateur non trouvé");

    const totalCount = user.budget.reduce((sum, b) => {
      return sum + b.transactions.length;
    }, 0);
    return totalCount;
  } catch (error) {
    console.log("error lors du la cacul des transactions effecutées", error);
  }
}
export async function getAllCompleteBudgetsAmount(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        budget: {
          include: {
            transactions: true,
          },
        },
      },
    });
    if (!user) throw new Error("Utilisateur non trouvé");
    const getTotalBudget = user.budget.length;
    const completebudgets = user.budget.filter((b) => {
      const totalAmountTransactions = b.transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
      return totalAmountTransactions >= b.amount;
    }).length;
    return `${completebudgets}/${getTotalBudget}`;
  } catch (error) {
    console.error("Erreur lors du calcul des budgets atteints:", error);
  }
}

export async function GetUserDataCharts(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        budget: {
          include: {
            transactions: true,
          },
        },
      },
    });
    if (!user) throw new Error("Utilisateur non trouvé");
    const data = user.budget.map((b) => {
      const totalTransactions = b.transactions.reduce((sum, t) => sum + t.amount, 0);
      return {
        budgetName: b.name,
        budgetAmount: b.amount,
        totalTransactions: totalTransactions,
      };
    });
    return data;
  } catch (error) {
    console.error("Erreur lors du téléchargement des budgets et des transactions:", error);
  }
}

export async function GetLastBudgets(email: string) {
  try {
    const lastBudgets = await prisma.budget.findMany({
      where: {
        user: {
          email,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
      include: {
        transactions: true,
      },
    });
    if (!lastBudgets) throw new Error("pas de budgets");
    return lastBudgets;
  } catch (error) {
    console.error("Erreur lors du téléchargement des derniers budgets", error);
  }
}

export async function Last10transactions(email: string) {
  try {
    const lastTransactions = await prisma.transaction.findMany({
      where: {
        Budget: {
          user: {
            email,
          },
        },
      },
      orderBy: {
        createdAT: "desc",
      },
      take: 10,
      include: {
        Budget: {
          select: {
            name: true,
          },
        },
      },
    });

    return lastTransactions;
  } catch (error) {
    console.error("Erreur lors de la récupération des dernières transactions: ", error);
  }
}
