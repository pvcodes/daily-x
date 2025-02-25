import { View, Text, Keyboard, TouchableWithoutFeedback, FlatList, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { Wallet } from 'lucide-react-native'
import { H2, H3, H4, Lead, Muted, Small } from '~/components/ui/typography'
import { format } from 'date-fns'
import { BudgetList } from '~/components/expense'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Label } from '~/components/ui/label'
import { Input } from '~/components/ui/input'
import { useBudget, useBudgetsPagination } from '~/hooks/expense'
import { dateToString } from '~/lib/utils'
import Loader from '~/components/Loader'
import { Button } from '~/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { useRouter } from 'expo-router'
import AddBudgetForm from '~/components/expense/AddBudgetForm'


const ExpenseTab = () => {
  // const todayBudget = budget
  const todayDate = new Date();
  const todayDateStr = dateToString(todayDate)
  const router = useRouter()

  const [addBudgetDialog, setAddBudgetDialog] = useState(false)
  const { data: todayBudget, isLoading } = useBudget(todayDateStr)
  // const todayBudget = null

  if (isLoading) <Loader />


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className='flex-1 p-6'>
        <View className="space-y-1 mb-8">
          <H2>Expenses</H2>
          <Small className='mt-2'>Overview of your spending</Small>
        </View>
        <TouchableOpacity
          onPress={() => todayBudget ? router.push(`/expense/${todayDateStr}`) : setAddBudgetDialog(true)}
        >
          <Card className='flex-row justify-between items-end'>
            <CardHeader className="flex items-start gap-1">
              <H4 className='gap-x-2'>
                <Wallet color='blue' size={16} />
                <Text>
                  Today&apos;s Budget
                </Text>
              </H4>
              <Muted>
                {format(new Date(), 'EEEE, MMM dd')}
              </Muted>
            </CardHeader>
            <CardContent>
              {
                todayBudget ?
                  <View className='items-end'>
                    <H3 className={todayBudget.remaining <= 0 ? 'text-red-700' : 'text-green-700'}>
                      ₹{todayBudget.remaining <= 0 ? 'Overspent' : todayBudget.remaining}
                    </H3>
                    {todayBudget.remaining > 0 && <Muted className='text-xs'>Remaining</Muted>}
                  </View> :
                  <>
                    {/* ADD Budget */}
                    <View className='items-end'>
                      <AddBudgetForm addBudgetDialog={addBudgetDialog} setAddBudgetDialog={setAddBudgetDialog} />
                    </View>
                  </>
              }
            </CardContent>
          </Card>
        </TouchableOpacity>
        <BudgetList />
      </SafeAreaView>
    </TouchableWithoutFeedback >
  )
}
export default ExpenseTab

