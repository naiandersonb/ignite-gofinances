import { Feather } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import styled, { css } from "styled-components/native";

interface IconProps {
  type: 'positive' | 'negative'
}

interface ContainerProps extends IconProps {
  isActive: boolean
}

export const Container = styled.View<ContainerProps>`
  width: 48%;

  border-radius: 5px;
  border: 1.5px solid ${({ theme }) => theme.colors.text};

  ${({ isActive, type }) => isActive && type === 'positive' && css`
    background-color: ${({ theme }) => theme.colors.success_light};
    border-color: transparent;
  `}

  ${({ isActive, type }) => isActive && type === 'negative' && css`
    background-color: ${({ theme }) => theme.colors.attention_light};
    border-color: transparent;
  `}
`

export const Icon = styled(Feather) <IconProps>`
  font-size: ${RFValue(24)}px;
  margin-right: 12px;

  color: ${({ theme, type }) => type === 'positive' ?
    theme.colors.success : theme.colors.attention
  };
`

export const Button = styled(RectButton)`
  padding: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

export const Title = styled.Text`
  font-size: ${RFValue(14)}px;
  font-family: ${({ theme }) => theme.fonts.regular};
`