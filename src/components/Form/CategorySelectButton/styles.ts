import { Feather } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import styled from "styled-components/native";

export const Container = styled(RectButton).attrs({
  activeOpacity: 0.7
})`
  background-color: ${({ theme }) => theme.colors.shape};

  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 18px 16px;

  border-radius: 5px;
`

export const Category = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${RFValue(14)}px;
`

export const Icon = styled(Feather)`
  font-size: ${RFValue(20)}px;
  color: ${({ theme }) => theme.colors.text};
`
