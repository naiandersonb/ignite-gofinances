
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from "react";
import { HightLightCard } from "../../components/HightLightCard";
import { TransactionCard, TransactionProps } from "../../components/TransactionCard";
import {
  Container,
  Header,
  HightLightCards,
  Icon,
  LogoutButton,
  Photo,
  Title,
  TransactionList,
  Transactions,
  User,
  UserGreeting,
  UserInfo,
  UserName,
  UserWrapper,
} from "./styles";

export interface DataListProps extends TransactionProps {
  id: string
}

interface HightLightProps {
  amount: string
  lastTransaction?: string
}

interface HightLightData {
  entries: HightLightProps;
  expensive: HightLightProps;
  total: HightLightProps;
}

function formatNumber(value: string) {
  const newValue = Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
  return newValue
}

function formatDate(date: Date) {
  const dateFormatted = Intl.DateTimeFormat('ptBR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  }).format(date)

  return dateFormatted
}

export function Dashboard() {

  const [transactions, setTransactions] = useState<DataListProps[]>([])
  const [hightLightData, setHightLightData] = useState<HightLightData>()

  function getLastTransactionDate(list: DataListProps[], type: 'positive' | 'negative') {
    const lastTransaction = new Date(Math.max.apply(Math, list
      .filter(item => item.type === type)
      .map(item => new Date(item.date).getTime()))
    )

    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', {
      month: 'long'
    })}`
  }

  async function loadTransactions() {
    const DATA_KEY = '@gofinances:transactions'
    const response = await AsyncStorage.getItem(DATA_KEY)
    const transactionsToAsyncStorage: DataListProps[] = response ? JSON.parse(response) : []

    let entriesTotal = 0
    let expensiveTotal = 0

    const transactionsFormatted: DataListProps[] = transactionsToAsyncStorage.map((item: DataListProps) => {

      if (item.type === 'positive') {
        entriesTotal += Number(item.amount)
      } else {
        expensiveTotal += Number(item.amount)
      }

      const amount = formatNumber(item.amount)
      const dateFormatted = Intl.DateTimeFormat('ptBR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      }).format(new Date(item.date))

      return {
        amount,
        category: item.category,
        date: dateFormatted,
        name: item.name,
        id: item.id,
        type: item.type
      }
    })

    const lastTransactionsEntries =
      getLastTransactionDate(transactionsToAsyncStorage, 'positive')

    const lastTransactionsExpensive =
      getLastTransactionDate(transactionsToAsyncStorage, 'negative')

    const totalInterval = `01 à ${lastTransactionsExpensive}`

    const total = entriesTotal - expensiveTotal
    setHightLightData({
      entries: {
        amount: formatNumber(entriesTotal.toString()),
        lastTransaction: `Última entrada dia ${lastTransactionsEntries}`
      },
      expensive: {
        amount: formatNumber(expensiveTotal.toString()),
        lastTransaction: `Última saída dia ${lastTransactionsExpensive}`
      },
      total: {
        amount: formatNumber(total.toString()),
        lastTransaction: totalInterval
      },
    })
    setTransactions(transactionsFormatted)
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  useFocusEffect(useCallback(() => {
    loadTransactions()
  }, []))

  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo
              source={{ uri: "https://avatars.githubusercontent.com/u/72632956?v=4" }}

            />
            <User>
              <UserGreeting>Olá,</UserGreeting>
              <UserName>Naianderson</UserName>
            </User>
          </UserInfo>

          <LogoutButton onPress={() => { }}>
            <Icon name='power' />
          </LogoutButton>
        </UserWrapper>
      </Header>

      <HightLightCards>
        <HightLightCard
          type="up"
          amount={hightLightData?.entries.amount ?? 'R$ 00,00'}
          lastTransaction={hightLightData?.entries.lastTransaction ?? ''}
          title="Entradas"
        />

        <HightLightCard
          type="down"
          amount={hightLightData?.expensive.amount ?? 'R$ 00,00'}
          lastTransaction={hightLightData?.expensive.lastTransaction ?? ''}
          title="Saídas"
        />

        <HightLightCard
          type="total"
          amount={hightLightData?.total.amount ?? 'R$ 00,00'}
          lastTransaction={hightLightData?.total.lastTransaction ?? ''}
          title="Total"
        />
      </HightLightCards>

      <Transactions>
        <Title>Listagem</Title>

        <TransactionList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) =>
            <TransactionCard transaction={item} />
          }
        />

      </Transactions>
    </Container>
  );
}
