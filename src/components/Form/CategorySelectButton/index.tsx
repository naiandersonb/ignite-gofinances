import { Category, Container, Icon, } from "./styles";

interface CategorySelectProps {
  onPress: () => void
  title: string
}

export function CategorySelectButton({
  title,
  onPress
}: CategorySelectProps) {
  return (
    <Container onPress={onPress}>
      <Category>{title}</Category>

      <Icon name='chevron-down' />

    </Container>
  )
}