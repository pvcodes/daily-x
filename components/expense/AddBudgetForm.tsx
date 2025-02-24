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





const AddBudgetForm = ({ addBudgetDialog, setAddBudgetDialog }) => {
    const todayDate = new Date();
    const todayDateStr = dateToString(todayDate)

    const [amount, setAmount] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleAddBudget = async () => {
        const amt = parseInt(amount.replace(/[\s,]/g, ''))
        if (isNaN(amt)) {
            Alert.alert('Error', 'Enter a valid amount') // Add error title
            return
        } else if (amt >= MAX_INT) {
            Alert.alert('Get a Investment Banker, we can\'t help')
            return
        }
        setLoading(true)

        const data = await expenseEndpoint.addBudget(parseInt(amount))

        if (data) {
            router.push(`/expense/${todayDateStr}`)
        } else {
            Alert.alert('Error', 'Something went wrong, try again')
        }
        setLoading(false)
        setAddBudgetDialog(false)
        queryClient.invalidateQueries({ queryKey: ['budgets'] })
        queryClient.setQueryData(['budget', todayDateStr], data)

    }

    return (
        <Dialog open={addBudgetDialog} onOpenChange={setAddBudgetDialog}>
            <DialogTrigger asChild>
                <Button variant='default'>
                    <Small className='text-white dark:text-black'>Add Budget</Small>
                </Button>
            </DialogTrigger>
            <DialogContent className=''>
                <DialogHeader>
                    <DialogTitle>What is your budget ?</DialogTitle>
                    <DialogDescription>
                        Enter your desired budget for {format(todayDate, 'MMM dd')} and hit save to proceed
                    </DialogDescription>
                    <Input
                        placeholder='Enter an amount'
                        keyboardType='numeric'
                        value={amount}
                        onChangeText={(text) => setAmount(text)}

                    />
                </DialogHeader>
                <DialogFooter className='w-full flex-row justify-end'>
                    <Button onPress={handleAddBudget} className='flex-row'>
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

AddBudgetForm.propTypes = {
    addBudgetDialog: PropTypes.bool.isRequired,
    setAddBudgetDialog: PropTypes.func.isRequired
}


export default AddBudgetForm