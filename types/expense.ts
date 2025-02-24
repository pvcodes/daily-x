export interface Budget {
	id: number;
	amount: number;
	day: Date;
	userId: number;
	remaining: number;
}

export interface Expense {
	id: number;
	amount: number;
	description: string;
	date: Date;
	userId: number;
	budgetId: number;
}

export interface MonthExpense {
	id: number;
	amount: number;
	userId: number;
	mid: string;
	description: string;
	date: Date;
}

export interface MonthlyBudget {
	monthlyExpenses: MonthExpense[];
	totalSpend: number;
	maxSpendInDay: {
		amount: number;
		date: string;
	};
}

export interface BudgetsInPagination {
	budgets: Budget[];
	pagination: Pagination;
}

export interface ExpensesInPagination {
	expenses: Expense[];
	budget: Budget;
	pagination: Pagination;
}

export interface Pagination {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	hasMore: boolean;
}
