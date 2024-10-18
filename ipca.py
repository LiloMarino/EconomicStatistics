import pandas as pd
import sidrapy

from cache import load_cache, save_cache


def get_ipca_data(start_date=None, end_date=None):
    df_ipca = load_cache()

    if df_ipca is None:
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
        df_ipca = df_ipca[["D2C", "D4N", "V"]]

        # Renomeando as colunas para algo mais intuitivo
        df_ipca = df_ipca.rename(
            columns={"D2C": "Data", "D4N": "Categoria", "V": "Valor"}
        )

        # Convertendo as colunas para os tipos adequados
        df_ipca["Data"] = pd.to_datetime(df_ipca["Data"], format="%Y%m")
        df_ipca["Valor"] = pd.to_numeric(df_ipca["Valor"])

        # Salvando o cache em CSV
        save_cache(df_ipca)
    else:
        # Convertendo a coluna 'Data' para datetime caso venha do CSV
        df_ipca["Data"] = pd.to_datetime(df_ipca["Data"])

    # Filtrando os dados pelo intervalo de datas, se fornecido
    if start_date and end_date:
        start_date = pd.to_datetime(start_date)
        end_date = pd.to_datetime(end_date)

        df_ipca = df_ipca[
            (df_ipca["Data"] >= start_date) & (df_ipca["Data"] <= end_date)
        ]

    return df_ipca
