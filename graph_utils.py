import pandas as pd
import plotly.express as px
import streamlit as st

from ipca import get_ipca_data

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


def formatar_data_mes(data):
    return data.strftime("%B %Y")


def plot_inflacao_categoria_mes(df_ipca):
    st.header("Inflação por Categoria e Mês")

    # Ajustando os dados para exibir o nome do mês em português
    df_ipca["data_mes"] = df_ipca["Data"].apply(
        lambda x: f"{meses_portugues[x.month]} {x.year}"
    )

    # Adiciona uma coluna de texto formatado com o símbolo de %
    df_ipca["IPCA (%) text"] = df_ipca["Valor"].apply(lambda x: f"{x:.2f}%")

    fig = px.bar(
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
    fig.update_traces(
        hovertemplate="Categoria: %{x}<br>"
        "Mês: %{customdata}<br>"
        "Inflação: <b>%{y:.2f}%</b><extra></extra>",
    )

    st.plotly_chart(fig)


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
    fig = px.bar(
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
    fig.update_traces(
        hovertemplate="Categoria: %{x}<br>"
        "Tipo: %{customdata}<br>"
        "IPCA: <b>%{y:.2f}%</b><extra></extra>",
    )

    st.plotly_chart(fig)


def plot_acumulado_12_meses(df_ipca):
    st.header("Acumulado dos Últimos 12 Meses por Categoria")

    # Inicializa um DataFrame para armazenar os acumulados
    df_acumulado = pd.DataFrame()

    # Itera sobre cada linha do DataFrame filtrado de entrada
    for _, row in df_ipca.iterrows():
        mes_atual = row["Data"]  # Mês atual
        categoria = row["Categoria"]  # Categoria atual

        # Obtém os dados dos 12 meses anteriores ao mês atual
        df_12_meses = get_ipca_data(
            start_date=(mes_atual - pd.DateOffset(months=11)), end_date=mes_atual
        )

        # Filtra os dados pela categoria atual
        df_categoria = df_12_meses[df_12_meses["Categoria"] == categoria]

        # Calcula o acumulado dos últimos 12 meses
        if not df_categoria.empty:
            acumulado = ((df_categoria["Valor"] / 100 + 1).prod() - 1) * 100

            # Cria um DataFrame temporário com o acumulado atual
            df_temp = pd.DataFrame(
                {
                    "Data": [mes_atual],
                    "Categoria": [categoria],
                    "Acumulado 12 Meses": [acumulado],
                }
            )

            # Concatena o DataFrame temporário ao DataFrame principal
            df_acumulado = pd.concat([df_acumulado, df_temp], ignore_index=True)

    # Remove NaNs se houver
    df_acumulado = df_acumulado.dropna(subset=["Acumulado 12 Meses"])

    # Cria o gráfico de linha
    fig = px.line(
        df_acumulado,
        x="Data",
        y="Acumulado 12 Meses",
        color="Categoria",
        labels={
            "Acumulado 12 Meses": "Acumulado (%)",
            "Data": "Mês",
            "Categoria": "Categoria",
        },
        title="Acumulado dos Últimos 12 Meses por Categoria",
        custom_data=["Categoria"],
    )

    # Atualiza o hovertemplate para exibir o valor corretamente
    fig.update_traces(
        hovertemplate="Categoria: %{customdata}<br>"
        "Mês: %{x}<br>"
        "Acumulado 12 Meses: <b>%{y:.2f}%</b><extra></extra>",
    )

    st.plotly_chart(fig)
