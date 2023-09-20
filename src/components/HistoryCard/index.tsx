import { Amount, Container, Title } from "./styles";

interface HistoryCardProps {
  color: string
  title: string
  amount: string
}

export function HistoryCard({ amount, color, title }: HistoryCardProps) {
  return (
    <Container color={color}>
      <Title>{title}</Title>
      <Amount>{amount}</Amount>
    </Container>
  )
}