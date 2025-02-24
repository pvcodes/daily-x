import { View, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { H4, Small, Muted, H3, Lead } from "../ui/typography";
import { format } from 'date-fns';
import { useBudgetsPagination, useExpensesPagination } from "~/hooks/expense";
import { Budget, Expense, Pagination } from "~/types/expense";

import React from "react"
import { Button } from "~/components/ui/button"
import { useRouter } from "expo-router";
import { Text } from "../ui/text";
import { dateToString } from "~/lib/utils";
import { useColorScheme } from "~/lib/useColorScheme";

interface BudgetItemProps {
    budget: Budget;
    onPress?: (budget: Budget) => void;
}
const BudgetItem: React.FC<BudgetItemProps> = ({ budget, onPress }) => {
    return (
        <TouchableOpacity
            className="p-4 mb-2 rounded-md border-b-2 border-gray-700 dark:border-b-wheat"
            onPress={() => onPress?.(budget)}
        >
            <View className="flex-row justify-between items-center">
                <View>
                    <H4>
                        ₹{budget.amount.toLocaleString()}
                    </H4>
                    <Small>
                        {format(new Date(budget.day), 'MMM dd, yyyy')}
                    </Small>
                </View>
                <View>

                    <H4
                        className={budget.remaining < 0 ? 'text-red-700' : 'text-green-700'}

                    >
                        ₹{budget.remaining.toLocaleString()}
                    </H4>
                    <Muted
                        className={`text-right ${budget.remaining > 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                    >
                        {((budget.remaining / budget.amount) * 100).toFixed(1)}%
                    </Muted>
                </View>
            </View>
        </TouchableOpacity >
    );
};

export const PaginationControls: React.FC<{
    pagination: Pagination;
    onPageChange: (page: number) => void;
}> = ({ pagination, onPageChange }) => {
    const { isDarkColorScheme } = useColorScheme()
    return (
        <View className="flex-row justify-between items-center py-4 px-4">
            <Button
                variant={isDarkColorScheme ? 'secondary' : 'default'}
                disabled={pagination.page === 1}
                onPress={() => onPageChange(pagination.page - 1)}
                className={`px-4 py-2 rounded `}
            >
                <Text className="text-white">Previous</Text>
            </Button>

            <Muted>
                Page {pagination.page} of {pagination.totalPages}
            </Muted>

            <Button
                variant={isDarkColorScheme ? 'secondary' : 'default'}
                disabled={!pagination.hasMore}
                onPress={() => onPageChange(pagination.page + 1)}
                className={`px-4 py-2 rounded`}
            >
                <Text className="text-white">Next</Text>
            </Button>
        </View>
    );
};

export const BudgetList = () => {
    const [page, setPage] = React.useState(1);
    const { data, isLoading, error } = useBudgetsPagination(page, 10);
    const router = useRouter()

    const handleBudgetPress = (budget: Budget) => {
        router.push(`/expense/${dateToString(budget.day)}`)
        // Handle budget selection/navigation here

        console.log('Selected budget:', budget);
    };

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error || !data) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-red-500">Error loading budgets</Text>
            </View>
        );
    }

    return (
        <View className="flex-1">
            <FlatList
                data={data.budgets}
                renderItem={({ item }) => (
                    <BudgetItem budget={item} onPress={handleBudgetPress} />
                )}
                className="mt-4"
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerClassName="py-2"
                ListEmptyComponent={
                    <Muted className="mt-10 text-center">
                        No budgets found
                    </Muted>
                }
                ListFooterComponent={
                    data.pagination.totalPages > 0 ? (
                        <PaginationControls
                            pagination={data.pagination}
                            onPageChange={setPage}
                        />
                    ) : null
                }
            />
            <View className="h-24"></View>
        </View>
    );
};

export const ExpenseList = ({ day, expenses }: { day: string }) => {

    return (
        <FlatList
            // ListHeaderComponent={
            // <View className="flex-1 flex-row justify-between items-center p-4">
            //     <H4>Today's Expenses</H4>
            //     <>
            //         <Muted>
            //             Total Spended: {data.budget.amount - data.budget.remaining}
            //         </Muted>
            //     </>
            // </View>
            // }
            data={expenses}
            renderItem={({ item }) => (
                <View
                    className="p-4 mb-2 rounded-md border-b-2 border-gray-700 dark:border-b-wheat"
                >
                    <View className="flex-row justify-between items-center">
                        <View>
                            <H4>
                                {item.description}
                            </H4>
                            <Small>
                                {format(new Date(item.date), 'hh:mm a')}
                            </Small>
                        </View>
                        <View>
                            <H3 className='text-red-700'>
                                -₹{item.amount.toLocaleString()}
                            </H3>

                        </View>
                    </View>
                </View>
            )}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerClassName="px-4 py-2"
            ListEmptyComponent={
                <Muted className="mt-10 text-center">
                    No expenses found
                </Muted>
            }
        // ListFooterComponent={
        //     data.pagination.totalPages > 1 ? (
        //         <PaginationControls
        //             pagination={data.pagination}
        //             onPageChange={setPage}
        //         />
        //     ) : null
        // }
        />
    );
};

