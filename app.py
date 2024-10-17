from datetime import datetime

import pandas as pd
import plotly.express as px
import streamlit as st

from ipca import get_ipca_data

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

# Configurações da página
st.set_page_config(page_title="IPCA Gráficos", layout="wide")

# Título
st.title("Gráficos do IPCA")

# Entrada de datas
start_date = st.date_input("Data de início", value=datetime(datetime.now().year, 1, 1))
end_date = st.date_input("Data de fim", value=datetime.now())

# Botão para buscar os dados
if st.button("Gerar Gráficos"):
    # Buscar os dados de IPCA
    df_ipca = get_ipca_data(start_date, end_date)

    st.header("Inflação por Categoria e Mês")
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

    # Gráfico IPCA por Categoria VS IPCA no Ano
    df_ipca["V"] = pd.to_numeric(df_ipca["V"])
    st.header("IPCA por Categoria vs IPCA no Ano")
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
