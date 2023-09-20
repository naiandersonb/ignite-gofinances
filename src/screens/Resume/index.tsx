import AsyncStorage from "@react-native-async-storage/async-storage";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import { addMonths, format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useCallback, useState } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "styled-components";
import { VictoryPie } from "victory-native";
import { HistoryCard } from "../../components/HistoryCard";
import { categories } from "../../utils/categories";
import {
  ChartContainer,
  Container,
  Content,
  Header,
  Month,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Title,
} from "./styles";

export interface TransactionData {
  type: 'positive' | 'negative'
  name: string
  amount: string
  category: string
  date: string
}

interface CategoryData {
  name: string
  total: number
  totalFormatted: string
  color: string
  percent: string
  key: string
}

export function Resume() {
  const theme = useTheme()
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())

  const handleDateChange = (action: 'next' | 'prev') => {
    if (action === 'next') {
      const nextDate = addMonths(selectedDate, 1)
      setSelectedDate(nextDate)
    } else {
      const prevDate = subMonths(selectedDate, 1)
      setSelectedDate(prevDate)
    }
  }

  async function loadData() {
    const DATA_KEY = '@gofinances:transactions'
    const response = await AsyncStorage.getItem(DATA_KEY)
    const responseFormatted: TransactionData[] = response ? JSON.parse(response) : []


    const expensive = responseFormatted
      .filter(expensive =>
        expensive.type === 'negative' &&
        new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
        new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
      )

    const expensiveTotal = expensive
      .reduce((accumulator: number, expv: TransactionData) => {
        return accumulator += Number(expv.amount)
      }, 0)

    const totalByCategory: CategoryData[] = []

    categories.forEach(category => {
      let categorySum = 0
      expensive.forEach(expensive => {
        if (expensive.category === category.key) {
          categorySum += Number(expensive.amount)
        }
      })

      if (categorySum > 0) {
        const totalFormatted = categorySum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })

        const percent = `${(categorySum / expensiveTotal * 100).toFixed(0)}%`

        totalByCategory.push({
          name: category.name,
          color: category.color,
          key: category.key,
          totalFormatted,
          total: categorySum,
          percent
        })
      }
    })

    setTotalByCategories(totalByCategory)
  }

  useFocusEffect(useCallback(() => {
    loadData()
  }, [selectedDate]))

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>

      <Content
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: useBottomTabBarHeight()
        }}
      >
        <MonthSelect>
          <MonthSelectButton onPress={() => handleDateChange('prev')}>
            <MonthSelectIcon name='chevron-left' />
          </MonthSelectButton>

          <Month>{format(selectedDate, 'MMMM, yyyy', { locale: ptBR })}</Month>

          <MonthSelectButton onPress={() => handleDateChange('next')}>
            <MonthSelectIcon name='chevron-right' />
          </MonthSelectButton>
        </MonthSelect>

        <ChartContainer>
          <VictoryPie
            data={totalByCategories}
            colorScale={totalByCategories.map(({ color }) => color)}
            labelRadius={80}
            style={{
              labels: {
                fontSize: RFValue(18),
                fontWeight: 'bold',
                fill: theme.colors.shape
              }
            }}
            x='percent'
            y='total'
          />
        </ChartContainer>

        {totalByCategories.map(category => (
          <HistoryCard
            key={category.key}
            color={category.color}
            amount={category.totalFormatted}
            title={category.name}
          />
        ))}

      </Content>
    </Container>
  )
}