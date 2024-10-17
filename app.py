from datetime import datetime

import streamlit as st

from graph_utils import plot_inflacao_categoria_mes, plot_ipca_categoria_acumulado
from ipca import get_ipca_data

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

    # Exibir os gráficos
    plot_inflacao_categoria_mes(df_ipca)
    plot_ipca_categoria_acumulado(df_ipca)
