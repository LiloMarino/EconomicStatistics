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


def plot_inflacao_categoria_mes(df_ipca):
    st.header("Inflação por Categoria e Mês")

    # Ajustando os dados para exibir o nome do mês em português
    df_ipca["data_mes"] = df_ipca["Data"].apply(
        lambda x: f"{meses_portugues[x.month]} {x.year}"
    )

    # Adiciona uma coluna de texto formatado com o símbolo de %
    df_ipca["IPCA (%) text"] = df_ipca["Valor"].apply(lambda x: f"{x:.2f}%")

    fig1 = px.bar(
        df_ipca,
        x="Categoria",  # Categorias no eixo X
        y="Valor",  # Inflação no eixo Y
        color="data_mes",  # As barras serão diferenciadas por mês
        labels={"Valor": "Inflação (%)", "Categoria": "Categoria", "data_mes": "Mês"},
        title="Inflação por Categoria e Mês",
        barmode="group",  # Barras agrupadas lado a lado
        text="IPCA (%) text",  # Exibe o texto com o símbolo de %
        custom_data=["data_mes"],
    )

    # Atualizando o hovertemplate para incluir o mês e a inflação
    fig1.update_traces(
        hovertemplate="Categoria: %{x}<br>"
        "Mês: %{customdata}<br>"
        "Inflação: <b>%{y:.2f}%</b><extra></extra>",
    )

    st.plotly_chart(fig1)


def plot_ipca_categoria_vs_ipca_geral(df_ipca):
    st.header("IPCA por Categoria vs IPCA Geral")

    # Filtra os dados para o Índice Geral e as outras categorias
    df_indice_geral = df_ipca[df_ipca["Categoria"] == "Índice geral"]
    df_categorias = df_ipca[df_ipca["Categoria"] != "Índice geral"]

    # Calcula o IPCA acumulado no ano para o Índice Geral
    ipca_geral = (df_indice_geral["Valor"].values / 100 + 1).prod() - 1

    # Agrupa por categoria e calcula o acumulado para cada uma
    acumulados_categoria = df_categorias.groupby("Categoria")["Valor"].transform(
        lambda x: (x / 100 + 1).prod() - 1
    )

    # Cria um novo DataFrame para o gráfico
    categorias = df_categorias["Categoria"].unique()
    resultados = {
        "Categoria": [],
        "IPCA no Ano (Índice Geral)": [],
        "IPCA Acumulado na Categoria": [],
        "Poder de Compra Após Reajuste da Inflação": [],
    }

    for categoria in categorias:
        ipca_categoria = round(
            acumulados_categoria[df_categorias["Categoria"] == categoria].iloc[0] * 100,
            2,
        )
        ipca_geral_percent = round(ipca_geral * 100, 2)

        resultados["Categoria"].append(categoria)
        resultados["IPCA no Ano (Índice Geral)"].append(ipca_geral_percent)
        resultados["IPCA Acumulado na Categoria"].append(ipca_categoria)
        # Calcula o poder de compra após o reajuste da inflação
        resultados["Poder de Compra Após Reajuste da Inflação"].append(
            round(ipca_geral_percent - ipca_categoria, 2)
        )

    # Converte os resultados em um DataFrame
    df_resultados = pd.DataFrame(resultados)

    # Transforma o DataFrame para o formato desejado
    df_resultados_melted = df_resultados.melt(
        id_vars="Categoria", var_name="Tipo", value_name="IPCA (%)"
    )

    # Adiciona uma coluna de texto formatado com o símbolo de %
    df_resultados_melted["IPCA (%) text"] = df_resultados_melted["IPCA (%)"].apply(
        lambda x: f"{x:.2f}%"
    )

    # Plota o gráfico com as barras agrupadas
    fig2 = px.bar(
        df_resultados_melted,
        x="Categoria",
        y="IPCA (%)",
        color="Tipo",
        barmode="group",
        labels={"IPCA (%)": "Inflação (%)"},
        title="IPCA por Categoria vs IPCA Geral",
        text="IPCA (%) text",  # Exibe o texto com o símbolo de %
        custom_data=["Tipo"],
    )

    # Atualiza o hover template para padronizar as informações
    fig2.update_traces(
        hovertemplate="Categoria: %{x}<br>"
        "Tipo: %{customdata}<br>"
        "IPCA: <b>%{y:.2f}%</b><extra></extra>",
    )

    st.plotly_chart(fig2)
