import React, { Suspense, useMemo, useState } from 'react';
import { View, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import { format, lastDayOfDecade } from 'date-fns';
import { ArrowUpCircle, ArrowDownCircle, Calendar, BarChart3, FileText, IndianRupee } from 'lucide-react-native';
import { cn, dateToString, getDateInMMYYYY } from '~/lib/utils';
import { Text } from '~/components/ui/text';
import { BlockQuote, H2, H3, H4, Lead, Muted, Small } from '~/components/ui/typography';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, CardHeader, CardContent } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { useRouter } from 'expo-router';
import Loader from '~/components/Loader';
import { useBudget, useMonthlyBudgetAndExpense } from '~/hooks/expense';
import { MonthlyExpenses } from '~/types/expense';
import { ThemeToggle } from '~/components/ThemeToggle';
import AddBudgetForm from '~/components/expense/AddBudgetForm';
import { useAuthStore } from '~/hooks/useAuth';

// Stats computation memoized
const computeStats = (bins: Bin[]) =>
  useMemo(
    () => [
      { title: 'Total Bins', value: bins.length, icon: <FileText size={16} color="#2563eb" />, color: 'text-blue-600' },
      {
        title: 'Markdown Bins',
        value: bins.filter((bin) => bin.isMarkdown).length,
        icon: <BarChart3 size={16} color="#9333ea" />,
        color: 'text-purple-600',
      },
      {
        title: 'Text Bins',
        value: bins.filter((bin) => !bin.isMarkdown).length,
        icon: <FileText size={16} color="#16a34a" />,
        color: 'text-green-600',
      },
    ],
    [bins]
  );

// Memoized Bin Item component
const BinItem = React.memo(({ bin }: { bin: Bin }) => {
  const router = useRouter();

  const handlePress = () => {
    console.log('Pressed:', bin.uid); // Debug log
    router.push(`/bin/${bin.uid}`);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
    >
      <View className="flex flex-row items-center justify-between p-3 rounded-lg border-b dark:border-white">
        <View className="flex flex-col items-start">
          <H4 className='pl-1'>{bin.name}</H4>
          <Badge variant="secondary" className="px-2 py-0.5">
            <Muted className="text-xs">{bin.isMarkdown ? 'Markdown' : 'Text'}</Muted>
          </Badge>
        </View>
        <View className='flex-row gap-1'>
          <Small>•</Small>
          <Small>{format(new Date(bin.createdAt), 'MMM d, h:mm a')}</Small>
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default function Dashboard() {
  const todayDate = new Date();
  const todayDateStr = dateToString(todayDate)
  const currMonthStr = getDateInMMYYYY(todayDate);
  // console.log({ currMonthStr })
  const [activeTab, setActiveTab] = React.useState('all');
  const [addBudgetDialog, setAddBudgetDialog] = useState(false)
  const router = useRouter()
  const user = useAuthStore(state => state.user)

  // Fetch data
  const { data: todayBudget, isLoading: budgetLoading } = useBudget(todayDateStr);
  const { data: monthlyBudget, isLoading: monthlyBudgetLoading } = useMonthlyBudgetAndExpense(currMonthStr);

  // const { data: bins = [], isLoading: binsLoading } = useBins();
  const bins: Bin[] = [
    {
      id: "1",
      uid: "user123",
      name: "First Bin",
      isMarkdown: true,
      createdAt: "2023-10-01T10:00:00Z"
    },
    {
      id: "2",
      uid: "user456",
      name: "Second Bin",
      isMarkdown: false,
      createdAt: "2023-10-02T11:30:00Z"
    },
    {
      id: "3",
      uid: "user789",
      name: "Third Bin",
      isMarkdown: true,
      createdAt: "2023-10-03T14:45:00Z"
    }
  ];

  const statsData = computeStats(bins);

  // Render bins based on filter
  const renderBins = (filterCondition: (bin: Bin) => boolean) => (
    <View className="space-y-1">
      {bins.filter(filterCondition).map((bin) => (
        <BinItem key={bin.id} bin={bin} />
      ))}
    </View>
  );

  if (budgetLoading || monthlyBudgetLoading) return <Loader />;



  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1 p-6">

        {/* Header */}
        <View className="space-y-1 mb-8">
          <View className='flex-row w-full justify-between space-y-1'>
            <H2>Dashboard</H2>
            <ThemeToggle />
          </View>
          <View className='flex-row items-end'>
            <Small className='mt-2'>Welcome back,
            </Small>
            <TouchableOpacity onPress={() => router.push('/profile')}><Small className='underline text-blue-700'> {user?.name.split(" ")[0] ?? ''}</Small></TouchableOpacity></View>
        </View>

        {/* Budget Card */}
        <Card className="mb-6 min-h-[200px] flex flex-col justify-between">
          <CardHeader>
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center space-x-2 mb-2">
                <Calendar size={20} color="#2563eb" />
                <H4 className='ml-2'>Today's Budget</H4>
              </View>
              <TouchableOpacity disabled={!todayBudget} onPress={() => router.push(`/expense/${todayDateStr}`)}><Small className='underline'>View Details</Small></TouchableOpacity>
            </View>
            <Small>{format(todayDate, 'MMMM d')}</Small>
          </CardHeader>
          <CardContent>
            {todayBudget?.amount ? (
              <View className="flex-row items-center justify-between">
                <H2 className="text-blue-600">₹{todayBudget.amount.toLocaleString()}</H2>
                <View className="flex-col justify-end items-end">
                  <View className="flex-row items-center space-x-2">
                    {todayBudget.remaining > 0 ? (
                      <ArrowUpCircle size={16} color="#22c55e" />
                    ) : (
                      <ArrowDownCircle size={16} color="#ef4444" />
                    )}
                    <Lead
                      className={`ml-2 ${todayBudget.remaining > 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                    >
                      ₹{Math.abs(todayBudget.remaining).toLocaleString()}
                    </Lead>
                  </View>
                  <Muted className='text-xs'>Remaining</Muted>
                </View>
              </View>

            ) : (
              <View className="items-center py-8">
                <Muted className="mb-4">No budget set for today</Muted>
                <AddBudgetForm addBudgetDialog={addBudgetDialog} setAddBudgetDialog={setAddBudgetDialog} />
                {/* <Button variant='default'>
                  <Small className='text-white dark:text-black'>Set Budget</Small>
                </Button> */}
              </View>
            )}
          </CardContent>
        </Card>

        {/* Monthly Overview */}
        <Card className="mb-6 min-h-[200px] flex flex-col justify-between">
          <CardHeader>
            <View className="flex-row items-center space-x-2 mb-2">
              <IndianRupee size={20} color="#22c55e" />
              <H4 className='ml-2'>Monthly Overview</H4>
            </View>
            <Small>{format(todayDate, 'MMMM yyyy')}</Small>
          </CardHeader>
          <CardContent>
            {monthlyBudget?.monthlyExpenses.length! <= 0 ? (
              <View className="items-center py-8">
                <Button variant='default'>
                  <Small className="text-white">Add Monthly Expense</Small>
                </Button>
              </View>
            ) : (
              <View className="flex flex-row justify-between">
                <View className="flex-1 rounded-lg">
                  <H4 className="text-sm mb-1">Total Spent</H4>
                  <H3>
                    ₹{monthlyBudget?.totalSpend.toLocaleString()}
                  </H3>
                </View>
                <View className="flex-1 rounded-lg flex-col items-end">
                  <H4 className="text-sm mb-1">Highest Spend</H4>
                  <H3 className="text-2xl font-semibold text-blue-700">
                    ₹{monthlyBudget?.maxSpendInDay.amount.toLocaleString()}
                  </H3>
                  <Muted className='text-xs'>
                    {format(new Date(monthlyBudget?.maxSpendInDay.date!), 'MMM d')}
                  </Muted>
                </View>
              </View>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <View className="space-y-4 mb-6">
          {statsData.map((stat, index) => (
            <Card key={index} className="mb-2">
              <CardHeader className="pb-2">
                <View className="flex-row items-center space-x-2">
                  {stat.icon}
                  <H3 className="ml-1 text-sm font-medium">{stat.title}</H3>
                </View>
              </CardHeader>
              <CardContent>
                <Lead className="text-2xl font-semibold">{stat.value}</Lead>
              </CardContent>
            </Card>
          ))}
        </View>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <View className="flex-row items-center space-x-2">
              <FileText size={20} color="#9333ea" />
              <H4 className="ml-2 text-lg font-medium">Recent Activity</H4>
            </View>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
              <TabsList className='w-full flex-row'>
                <TabsTrigger
                  value="all"
                  className='flex-1'
                >
                  <Text
                    className={cn(
                      'text-base font-semibold',)}
                  >
                    All Bins
                  </Text>
                </TabsTrigger>
                <TabsTrigger
                  value="markdown"
                  className='flex-1'

                >
                  <Text
                    className={cn(
                      'text-base font-semibold',
                    )}
                  >
                    Markdown
                  </Text>
                </TabsTrigger>
              </TabsList>
              <ScrollView className="h-[300px]">
                <TabsContent value="all" className="mt-0">
                  {renderBins(() => true)}
                </TabsContent>
                <TabsContent value="markdown" className="mt-0">
                  {renderBins((bin) => bin.isMarkdown)}
                </TabsContent>
              </ScrollView>
            </Tabs>
          </CardContent>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}