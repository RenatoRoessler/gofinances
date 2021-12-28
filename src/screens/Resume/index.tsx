import AsyncStorage from "@react-native-async-storage/async-storage";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import { addMonths, format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "styled-components";
import { VictoryPie } from "victory-native";
import { HistoiryCard } from "../../components/HistoryCard";
import { categories } from "../../utils/categories";
import {
  ChartContainer,
  Container,
  Content,
  Header,
  LaodContainer,
  Month,
  MonthSelect,
  MonthSelectButton,
  MonthSelecticonIcon,
  Title,
} from "./styles";

interface TransactionData {
  type: "positive" | "negative";
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface CategoryData {
  key: string;
  name: string;
  totalFormatted: string;
  total: number;
  color: string;
  percent: string;
}

export function Resume() {
  const [isLoading, seIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>(
    []
  );
  const theme = useTheme();

  function handleDateChange(action: "next" | "prev") {
  
    if (action === "next") {
      setSelectedDate(addMonths(selectedDate, 1));
    } else {
      setSelectedDate(subMonths(selectedDate, 1));
    }
  }

  async function loadData() {
    seIsLoading(true);
    const dataKey = "@gofinances:transactions";
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted = response ? JSON.parse(response) : [];

    const expensives = responseFormatted.filter(
      (expensives: TransactionData) =>
        expensives.type === "negative" &&
        new Date(expensives.date).getMonth() === selectedDate.getMonth() &&
        new Date(expensives.date).getFullYear() === selectedDate.getFullYear()
    );

    const expensivesTotal = expensives.reduce(
      (acumullador: number, expensive: TransactionData) => {
        return acumullador + Number(expensive.amount);
      },
      0
    );

    const totalByCategory: CategoryData[] = [];
    categories.forEach((category) => {
      let categorySum = 0;
      expensives.forEach((expensives: TransactionData) => {
        if (expensives.category === category.key) {
          categorySum += Number(expensives.amount);
        }
      });
      if (categorySum > 0) {
        const totalFormatted = categorySum.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
        const percent = `${((categorySum / expensivesTotal) * 100).toFixed(
          0
        )}%`;
        totalByCategory.push({
          key: category.key,
          name: category.name,
          total: categorySum,
          totalFormatted,
          color: category.color,
          percent,
        });
      }
    });
    setTotalByCategories(totalByCategory);
    seIsLoading(false);
  }


  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [selectedDate])
  );

  return (
    <Container>
      <Header>
        <Title>Resumo por Categoria</Title>
      </Header>
      {isLoading ? (
        <LaodContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LaodContainer>
      ) : (
        <>
          <Content
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingBottom: useBottomTabBarHeight(),
            }}
          >
            <MonthSelect>
              <MonthSelectButton onPress={() => handleDateChange("prev")}>
                <MonthSelecticonIcon name="chevron-left" />
              </MonthSelectButton>
              <Month>
                {format(selectedDate, "MMMM, yyyy", { locale: ptBR })}
              </Month>
              <MonthSelectButton onPress={() => handleDateChange("next")}>
                <MonthSelecticonIcon name="chevron-right" />
              </MonthSelectButton>
            </MonthSelect>
            <ChartContainer>
              <VictoryPie
                data={totalByCategories}
                x="percent"
                y="total"
                colorScale={totalByCategories.map((category) => category.color)}
                style={{
                  labels: {
                    fontSize: RFValue(18),
                    fontWeight: "bold",
                    fill: theme.colors.shape,
                  },
                }}
                labelRadius={50}
              />
            </ChartContainer>
            {totalByCategories.map((item) => (
              <HistoiryCard
                key={item.key}
                title={item.name}
                amount={item.totalFormatted}
                color={item.color}
              />
            ))}
          </Content>
        </>
      )}
    </Container>
  );
}
