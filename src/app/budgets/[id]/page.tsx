import { GetSingleBudget } from "@/app/actions/page";
import BudgetIdPage from "@/components/budget/BudgetIdPage";
import { IBudget } from "@/utils/TypesTs";

interface Iparams {
  params: {
    id: string;
  };
}

const budgetId = async ({ params }: Iparams) => {
  const { id } = await params;
  const budget = (await GetSingleBudget(id)) as IBudget;
  return <BudgetIdPage budget={budget} />;
};

export default budgetId;
