import pandas as pd
import plotly.express as px
import streamlit as st

# Mapeamento manual dos meses em português
meses_portugues = {
    1: "Janeiro",
    2: "Fevereiro",
    3: "Março",
    4: "Abril",
    5: "Maio",
    6: "Junho",
    7: "Julho",
    8: "Agosto",
    9: "Setembro",
    10: "Outubro",
    11: "Novembro",
    12: "Dezembro",
}


# Função para o gráfico de Inflação por Categoria e Mês
def plot_inflacao_categoria_mes(df_ipca):
    st.header("Inflação por Categoria e Mês")

    # Ajustando os dados para exibir o nome do mês em português
    df_ipca["data_mes"] = df_ipca["data"].apply(
        lambda x: f"{meses_portugues[x.month]} {x.year}"
    )

    fig1 = px.bar(
        df_ipca,
        x="D4N",  # Categorias no eixo X
        y="V",  # Inflação no eixo Y
        color="data_mes",  # As barras serão diferenciadas por mês
        labels={"V": "Inflação (%)", "D4N": "Categoria", "data_mes": "Mês"},
        title="Inflação por Categoria e Mês",
        barmode="group",  # Barras agrupadas lado a lado
    )

    st.plotly_chart(fig1)


# Função para o gráfico de IPCA por Categoria Acumulado no Ano
def plot_ipca_categoria_acumulado(df_ipca):
    df_ipca["V"] = pd.to_numeric(df_ipca["V"])
    st.header("IPCA por Categoria vs IPCA no Ano")

    # Cálculo do acumulado por categoria
    df_ipca["Acumulado"] = df_ipca.groupby("D4N")["V"].transform(
        lambda x: (x / 100 + 1).prod() - 1
    )

    fig2 = px.bar(
        df_ipca,
        x="D4N",
        y="Acumulado",
        labels={"D4N": "Categoria", "Acumulado": "IPCA (%)"},
        title="IPCA por Categoria Acumulado no Ano",
    )

    st.plotly_chart(fig2)
