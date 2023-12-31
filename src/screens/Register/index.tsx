import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  Keyboard,
  Modal,
  TouchableWithoutFeedback
} from "react-native";
import * as Yup from 'yup';
import { Button } from "../../components/Form/Button";
import { CategorySelectButton } from "../../components/Form/CategorySelectButton";
import { InputForm } from "../../components/Form/InputForm";
import {
  TransactionTypeButton
} from "../../components/Form/TransactionTypeButton";
import { CategorySelect } from "../CategorySelect";
import {
  Container,
  Fields,
  Form,
  Header,
  Title,
  TransactionsTypes
} from "./styles";

interface Category {
  key: string;
  name: string;
}

interface FormData {
  name: string
  amount: number;
}

interface NavigationProps {
  navigate: (screen: string) => void;
}

const schema = Yup.object({
  name: Yup.string().required('Nome é obrigatório'),
  amount: Yup
    .number()
    .typeError('Informe um valor numérico')
    .positive('O valor não não pode ser negativo')
    .required('O preço é obirgatório')
})


export function Register() {
  const [transactionType, setTransactionType] = useState('')
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [category, setCategory] = useState<Category>({
    key: 'category',
    name: 'Categoria'
  })

  const navigation = useNavigation<NavigationProps>()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  async function handleRegister(form: FormData) {
    if (!transactionType) {
      return Alert.alert('Selecione o tipo da transação')
    }

    if (category.key === 'category') {
      return Alert.alert('Selecione a categoria')
    }

    const newTransaction = {
      id: new Date().getTime().toString(),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date()
    }

    try {
      const DATA_KEY = '@gofinances:transactions'

      const data = await AsyncStorage.getItem(DATA_KEY)

      const currentData: typeof newTransaction[] = data ? JSON.parse(data) : []

      const dataFormatted = [...currentData, newTransaction]

      await AsyncStorage.setItem(DATA_KEY, JSON.stringify(dataFormatted))

      reset()
      setTransactionType('')
      setCategory({
        key: 'category',
        name: 'Categoria'
      })

      navigation.navigate('Listagem')

    } catch (error) {
      console.log({ error })
      Alert.alert('Não foi possível salvar os dados')
    }
  }

  const handleOpenCategoryModal = () => {
    setCategoryModalOpen(prev => !prev)
  }
  const handleCloseCategoryModalOpen = () => {
    setCategoryModalOpen(false)
  }

  const handleTransactionTypeSelect = (type: 'positive' | 'negative') => {
    setTransactionType(type)
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>

        <Form>
          <Fields>
            <InputForm
              error={errors.name?.message}
              autoCapitalize="sentences"
              autoCorrect={false}
              placeholder="Nome"
              control={control}
              name="name"
            />

            <InputForm
              error={errors.amount?.message}
              keyboardType="numeric"
              placeholder="Preço"
              control={control}
              name="amount"
            />

            <TransactionsTypes>
              <TransactionTypeButton
                onPress={() => handleTransactionTypeSelect('positive')}
                isActive={transactionType === 'positive'}
                title="Income"
                type="positive"
              />
              <TransactionTypeButton
                onPress={() => handleTransactionTypeSelect('negative')}
                isActive={transactionType === 'negative'}
                title="Outcome"
                type="negative"
              />
            </TransactionsTypes>

            <CategorySelectButton
              onPress={handleOpenCategoryModal}
              title={category.name}
            />

          </Fields>

          <Button
            onPress={handleSubmit(handleRegister)}
            title="Enviar"
          />
        </Form>

        <Modal visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseCategoryModalOpen}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  )
}