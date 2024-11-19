import { IBudget } from "./TypesTs";

const Exemples_Budgets: IBudget[] = [
  {
    id: "1",
    createdAt: new Date("2023-01-10"),
    name: "Alimentation",
    amount: 500,
    emoji: "🍎",
    transactions: [
      {
        id: "t1",
        amount: 50,
        emoji: "🍕",
        description: "Pizzeria",
        createdAT: new Date("2023-01-12"),
        budgetName: "Alimentation",
        budgetId: "1",
      },
      {
        id: "t2",
        amount: 30,
        emoji: "🍞",
        description: "Boulangerie",
        createdAT: new Date("2023-01-15"),
        budgetName: "Alimentation",
        budgetId: "1",
      },
    ],
  },
  {
    id: "2",
    createdAt: new Date("2023-01-05"),
    name: "Transport",
    amount: 300,
    emoji: "🚗",
    transactions: [
      {
        id: "t3",
        amount: 160,
        emoji: "⛽",
        description: "Essence",
        createdAT: new Date("2023-01-08"),
        budgetName: "Transport",
        budgetId: "2",
      },
      {
        id: "t4",
        amount: 20,
        emoji: "🚕",
        description: "Taxi",
        createdAT: new Date("2023-01-20"),
        budgetName: "Transport",
        budgetId: "2",
      },
    ],
  },
  {
    id: "3",
    createdAt: new Date("2023-02-01"),
    name: "Loisirs",
    amount: 200,
    emoji: "🎉",
    transactions: [
      {
        id: "t5",
        amount: 40,
        emoji: "🎬",
        description: "Cinéma",
        createdAT: new Date("2023-02-03"),
        budgetName: "Loisirs",
        budgetId: "3",
      },
    ],
  },
  {
    id: "4",
    createdAt: new Date("2023-02-15"),
    name: "Santé",
    amount: 150,
    emoji: "💊",
    transactions: [
      {
        id: "t6",
        amount: 45,
        emoji: "🏥",
        description: "Consultation médicale",
        createdAT: new Date("2023-02-17"),
        budgetName: "Santé",
        budgetId: "4",
      },
    ],
  },
  {
    id: "5",
    createdAt: new Date("2023-03-01"),
    name: "Éducation",
    amount: 400,
    emoji: "📚",
    transactions: [
      {
        id: "t7",
        amount: 340,
        emoji: "📖",
        description: "Livres scolaires",
        createdAT: new Date("2023-03-05"),
        budgetName: "Éducation",
        budgetId: "5",
      },
    ],
  },
  {
    id: "6",
    createdAt: new Date("2023-04-01"),
    name: "Maison",
    amount: 600,
    emoji: "🏠",
    transactions: [
      {
        id: "t8",
        amount: 600,
        emoji: "🛋️",
        description: "Meubles",
        createdAT: new Date("2023-04-10"),
        budgetName: "Maison",
        budgetId: "6",
      },
    ],
  },
];

export default Exemples_Budgets;
