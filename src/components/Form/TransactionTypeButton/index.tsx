import { RectButtonProps } from 'react-native-gesture-handler';
import { Button, Container, Icon, Title, } from "./styles";

const icons = {
  positive: 'arrow-up-circle',
  negative: 'arrow-down-circle',
}

interface Props extends RectButtonProps {
  type: 'positive' | 'negative'
  title: string
  isActive: boolean
}

export function TransactionTypeButton({
  isActive,
  title,
  type,
  ...rest
}: Props) {
  return (
    <Container isActive={isActive} type={type}>
      <Button {...rest}>
        <Icon name={icons[type]} type={type} />
        <Title>{title}</Title>
      </Button>
    </Container>
  )
}