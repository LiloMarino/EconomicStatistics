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


def plot_ipca_categoria_vs_ipca_geral(df_ipca):
    st.header("IPCA por Categoria vs IPCA no Ano")

    # Filtra os dados para o Índice Geral e as outras categorias
    df_indice_geral = df_ipca[df_ipca["D4N"] == "Índice geral"]
    df_categorias = df_ipca[df_ipca["D4N"] != "Índice geral"]

    # Calcula o IPCA acumulado no ano para o Índice Geral
    ipca_geral = (df_indice_geral["V"].values / 100 + 1).prod() - 1

    # Agrupa por categoria e calcula o acumulado para cada uma
    acumulados_categoria = df_categorias.groupby("D4N")["V"].transform(
        lambda x: (x / 100 + 1).prod() - 1
    )

    # Cria um novo DataFrame para o gráfico
    categorias = df_categorias["D4N"].unique()
    resultados = {
        "Categoria": [],
        "IPCA no Ano (Índice Geral)": [],
        "IPCA Acumulado na Categoria": [],
    }

    for categoria in categorias:
        resultados["Categoria"].append(categoria)
        resultados["IPCA no Ano (Índice Geral)"].append(
            round(ipca_geral * 100, 2)  # Arredonda para 2 casas decimais
        )
        resultados["IPCA Acumulado na Categoria"].append(
            round(
                acumulados_categoria[df_categorias["D4N"] == categoria].iloc[0] * 100, 2
            )
        )

    # Converte os resultados em um DataFrame
    df_resultados = pd.DataFrame(resultados)

    # Transforma o DataFrame para o formato desejado
    df_resultados_melted = df_resultados.melt(
        id_vars="Categoria", var_name="Tipo", value_name="IPCA (%)"
    )

    # Plota o gráfico com as barras agrupadas
    fig2 = px.bar(
        df_resultados_melted,
        x="Categoria",
        y="IPCA (%)",
        color="Tipo",
        barmode="group",
        labels={"IPCA (%)": "Inflação (%)"},
        title="IPCA por Categoria vs IPCA no Ano",
        text_auto=".2f",  # Exibe as porcentagens arredondadas com 2 casas decimais
    )

    # Atualiza o hover template para mostrar 2 casas decimais no tooltip
    fig2.update_traces(hovertemplate="%{y:.2f}%<extra></extra>")

    st.plotly_chart(fig2)
