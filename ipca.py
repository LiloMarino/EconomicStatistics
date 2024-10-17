import pandas as pd
import sidrapy

from cache import load_cache, save_cache


# Função para obter os dados do IPCA
def get_ipca_data(start_date=None, end_date=None):
    cache_data = load_cache()
    if cache_data is None:
        print("Consultando dados da API...")
        # Faz a consulta apenas para a variação mensal do IPCA por grupos
        df_ipca = sidrapy.get_table(
            table_code="7060",  # Tabela do IPCA
            territorial_level="1",  # Brasil
            ibge_territorial_code="all",  # Todos os territórios
            classifications={
                "315": "7169,7170,7445,7486,7558,7625,7660,7712,7766,7786"
            },  # Grupos
            variable="63",  # Somente variação mensal
            period="all",  # Todos os meses
            header="n",  # Sem cabeçalho extra
        )

        # Filtrando apenas as colunas desejadas
        df_ipca = df_ipca[["D2C", "D2N", "D4C", "D4N", "V"]]

        save_cache(df_ipca)
    else:
        df_ipca = cache_data

    # Convertendo a coluna de data
    df_ipca["data"] = pd.to_datetime(df_ipca["D2C"], format="%Y%m")

    # Filtrando os dados pelo intervalo de datas, se fornecido
    if start_date and end_date:
        # Converter start_date e end_date para datetime
        start_date = pd.to_datetime(start_date)
        end_date = pd.to_datetime(end_date)

        df_ipca = df_ipca[
            (df_ipca["data"] >= start_date) & (df_ipca["data"] <= end_date)
        ]
    return df_ipca
