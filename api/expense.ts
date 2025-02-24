import { API_URL } from "~/constants";
import { useAuthStore } from "~/hooks/useAuth";
import { MonthlyBudget } from "~/types/expense";

const getBudgetDetails = async (day: string) => {
	try {
		const params = new URLSearchParams({
			day,
		});
		const token = useAuthStore.getState().token;
		// console.log(token);
		const response = await fetch(`${API_URL}/v1/expense/budget?${params}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: token,
			},
		});
		const data = await response.json();
		console.log({ data });
		return data;
	} catch (error) {
		console.log(error);
		return null;
	}
};

const getMonthlyExpensesAndBudget = async (mid: string) => {
	try {
		const params = new URLSearchParams({
			mid,
		});
		const token = useAuthStore.getState().token;
		// console.log(token);
		const response = await fetch(`${API_URL}/v1/expense/month?${params}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: token,
			},
		});
		const data = await response.json();
		console.log({ data });
		return data;
	} catch (error) {
		console.log(error);
		return null;
	}
};

const getBudgetsInPagination = async (page: number, limit: number) => {
	try {
		const params = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString(),
		});
		const token = useAuthStore.getState().token;
		// console.log(token);
		const response = await fetch(
			`${API_URL}/v1/expense/budget/all?${params}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: token,
				},
			}
		);
		const data = await response.json();
		console.log({ data });
		return data;
	} catch (error) {
		console.log(error);
		return null;
	}
};

const addBudget = async (amount: number) => {
	try {
		const token = useAuthStore.getState().token;
		// console.log(token);
		const response = await fetch(`${API_URL}/v1/expense/budget`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: token,
			},
			body: JSON.stringify({ amount }),
		});
		const data = await response.json();
		console.log({ data });
		return data;
	} catch (error) {
		console.log(error);
		return null;
	}
};

const getExpensesInPagination = async (
	page: number,
	limit: number,
	day: string
) => {
	try {
		const params = new URLSearchParams({
			day,
			page: page.toString(),
			limit: limit.toString(),
		});
		const token = useAuthStore.getState().token;
		// console.log(token);
		const response = await fetch(`${API_URL}/v1/expense?${params}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: token,
			},
		});
		const data = await response.json();
		console.log({ data });
		return data;
	} catch (error) {
		console.log(error);
		return null;
	}
};

const addExpense = async (
	amount: number,
	description: string,
	budgetId: number
) => {
	try {
		const token = useAuthStore.getState().token;
		// console.log(token);
		const response = await fetch(`${API_URL}/v1/expense/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: token,
			},
			body: JSON.stringify({ amount, description, budgetId }),
		});
		const data = await response.json();
		console.log({ data });
		return data;
	} catch (error) {
		console.log(error);
		return null;
	}
};

const expenseEndpoint = {
	getBudgetDetails,
	getMonthlyExpensesAndBudget,
	getBudgetsInPagination,
	addBudget,
	getExpensesInPagination,
	addExpense,
};

export default expenseEndpoint;
