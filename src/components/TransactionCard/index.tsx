import { categories } from "../../utils/categories"
import {
  Amount,
  Category,
  CategoryName,
  Container,
  Date,
  Footer,
  Icon,
  Title
} from "./styles"

interface Category {
  name: string
  icon: string
}

export interface TransactionProps {
  type: 'positive' | 'negative'
  name: string
  amount: string
  category: string
  date: string
}

interface TransactionCardProps {
  transaction: TransactionProps
}

export function TransactionCard({ transaction }: TransactionCardProps) {

  const [category] = categories.filter(
    item => item.key === transaction.category
  )

  return (
    <Container>
      <Title>{transaction.name}</Title>

      <Amount type={transaction.type}>
        {transaction.type === 'negative' && '- '}{transaction.amount}
      </Amount>

      <Footer>
        <Category>
          <Icon name={category.icon} />
          <CategoryName>{category.name}</CategoryName>
        </Category>
        <Date>{transaction.date}</Date>
      </Footer>

    </Container>
  )
}