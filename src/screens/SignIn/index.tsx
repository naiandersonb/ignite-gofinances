import {
  Container,
  Footer,
  FooterWrapper,
  Header,
  SignInTitle,
  Title,
  TitleWrapper
} from "./styles";

import { Alert } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';
import { SignInSocialButton } from "../../components/SignInSocialButton";
import { useAuth } from "../../contexts/AuthContext";

export function SignIn() {
  const { signInWithApple } = useAuth()

  async function handleSignInWithApple() {
    try {
      await signInWithApple()
    } catch (err) {
      Alert.alert('Não foi possível conectar com a conta Apple')
    }
  }

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg
            width={RFValue(120)}
            height={RFValue(68)}
          />
          <Title>
            Controle suas{'\n'}finanças de forma{'\n'}muito simples
          </Title>
        </TitleWrapper>

        <SignInTitle>
          faça seu login com{'\n'}uma das contas abaixo
        </SignInTitle>
      </Header>

      <Footer>
        <FooterWrapper>
          <SignInSocialButton
            title="Entrar com Google"
            svg={GoogleSvg}
          />

          <SignInSocialButton
            onPress={handleSignInWithApple}
            title="Entrar com Apple"
            svg={AppleSvg}
          />
        </FooterWrapper>

      </Footer>

    </Container>
  )
}