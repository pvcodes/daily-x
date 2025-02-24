
import { ActivityIndicator, Alert } from 'react-native'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { Small } from '../ui/typography'
import { format } from 'date-fns'
import { Input } from '../ui/input'
import { expenseEndpoint } from '~/api'
import { Text } from '../ui/text'
import { useRouter } from 'expo-router'
import { dateToString, queryClient } from '~/lib/utils'
import { MAX_INT } from '~/constants'
import PropTypes from 'prop-types'





const AddExpense = ({ day, budgetId }) => {
    const [addExpenseDialog, setAddExpenseDialog] = useState(false)

    const [expense, setExpense] = useState<{ amount: string, description: string }>({
        amount: '',
        description: ''
    })
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleAddExpense = async () => {
        const amt = parseInt(expense.amount.replace(/[\s,]/g, ''))
        if (isNaN(amt)) {
            Alert.alert('Error', 'Enter a valid amount') // Add error title
            return
        } else if (amt >= MAX_INT) {
            Alert.alert('Get a Investment Banker, we can\'t help')
            return
        }
        // descrpiton validation
        setLoading(true)

        const data = await expenseEndpoint.addExpense(amt, expense.description, budgetId)

        if (!data) {
            Alert.alert('Error', 'Something went wrong, try again')
        }
        setLoading(false)
        setAddExpenseDialog(false)
        queryClient.invalidateQueries({ queryKey: ['expenses'] })
        // queryClient.setQueryData(['budget', day], data)

    }

    return (
        <Dialog open={addExpenseDialog} onOpenChange={setAddExpenseDialog}>
            <DialogTrigger asChild>
                <Button variant='default'>
                    <Small className='text-white dark:text-black'>Add New</Small>
                </Button>
            </DialogTrigger>
            <DialogContent className=''>
                <DialogHeader>
                    <DialogTitle>What now?</DialogTitle>
                    <DialogDescription>
                        Where did you spend, give me details
                    </DialogDescription>
                    <Input
                        placeholder='Where?'
                        value={expense.description}
                        onChangeText={(text) => setExpense(prev => ({ ...prev, description: text }))}

                    />
                    <Input
                        placeholder='Enter an amount'
                        keyboardType='numeric'
                        value={expense.amount}
                        onChangeText={(text) => setExpense(prev => ({ ...prev, amount: text }))}

                    />
                </DialogHeader>
                <DialogFooter className='w-full flex-row justify-end'>
                    <Button onPress={handleAddExpense} className='flex-row'>
                        <Text className={`text-white dark:text-black $`}>
                            Proceed
                        </Text>
                        {loading && <ActivityIndicator className='ml-1' />}

                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


export default AddExpense