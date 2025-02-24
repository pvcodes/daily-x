import { useMutation, useQuery } from "@tanstack/react-query";
import { expenseEndpoint } from "~/api";
import { dateToString, queryClient } from "~/lib/utils";
import { Budget, BudgetsInPagination, ExpensesInPagination, MonthlyBudget } from "~/types/expense";

export const useBudget = (date: string) =>
	useQuery<Budget>({
		queryKey: ["budget", date],
		queryFn: () => expenseEndpoint.getBudgetDetails(date),
	});

export const useMonthlyBudgetAndExpense = (mid: string) =>
	useQuery<MonthlyBudget>({
		queryKey: ["month_budget", mid],
		queryFn: () => expenseEndpoint.getMonthlyExpensesAndBudget(mid),
	});

export const useBudgetsPagination = (page: number, limit: number) =>
	useQuery<BudgetsInPagination>({
		queryKey: ["budgets", page, limit],
		queryFn: () => expenseEndpoint.getBudgetsInPagination(page, limit),
	});

export const useExpensesPagination = (
	page: number,
	limit: number,
	day: string
) =>
	useQuery<ExpensesInPagination>({
		queryKey: ["expenses", day, page, limit],
		queryFn: () =>
			expenseEndpoint.getExpensesInPagination(page, limit, day),
	});
