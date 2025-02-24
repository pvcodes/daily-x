import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { useExpensesPagination } from '~/hooks/expense'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ExpenseList, PaginationControls } from '~/components/expense'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { H4, Muted } from '~/components/ui/typography'
import AddExpense from '~/components/expense/AddExpense'

const SingleExpensePage = () => {
    const { day } = useLocalSearchParams()
    const [page, setPage] = React.useState(1);
    const { data, isLoading, error } = useExpensesPagination(page, 10, day as string);

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
                <Text className="text-red-500">Error loading expenses</Text>
            </View>
        );
    }

    return (
        <SafeAreaView className='flex-1'>
            <Card className="mt-4 mx-4">
                <CardContent className='p-4 flex-row justify-between items-center'>
                    <AddExpense day={day} budgetId={data.budget.id} />
                    <View className='items-end'>
                        <Text className="text-sm text-gray-600">Budget Left</Text>
                        <Text className="text-2xl font-bold text-green-700">
                            {data.budget.remaining <= 0 ? 'Overspent' : `₹${data.budget.remaining.toFixed(2)}`}
                        </Text>
                    </View>
                </CardContent>
            </Card>
            <View className="flex-row justify-between items-center px-8 mt-10">
                <H4>Today's Expenses</H4>
                <>
                    <Muted>
                        Total Spended: {data.budget.amount - data.budget.remaining}
                    </Muted>
                </>
            </View>
            <ExpenseList day={day as string} expenses={data.expenses} />
            {
                data.pagination.totalPages > 1 && <PaginationControls pagination={data.pagination} onPageChange={setPage} />
            }
            {/* <View className="h-24"></View> */}
        </SafeAreaView>
    )
}

export default SingleExpensePage


