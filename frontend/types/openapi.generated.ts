export interface paths {
    "/api/series/refresh": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Refresh
         * @description Com o cache em dia, responde sem sair da máquina. Sem rede não é erro: o cache
         *     fica como estava, e a série vai para `failed` quando a falta é problema novo.
         */
        post: operations["refresh_api_series_refresh_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/series/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Status */
        get: operations["status_api_series_status_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/inflation/groups": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Groups */
        get: operations["groups_api_inflation_groups_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/inflation/pace": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Pace */
        get: operations["pace_api_inflation_pace_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/inflation/seasonality": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Seasonality By Group */
        get: operations["seasonality_by_group_api_inflation_seasonality_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/inflation/purchasing-power": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Purchasing Power By Group
         * @description `custom_raise` em fração (0.06 é 6%), obrigatório com `reference=custom`.
         */
        get: operations["purchasing_power_by_group_api_inflation_purchasing_power_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/external-sector": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** External Sector Overview */
        get: operations["external_sector_overview_api_external_sector_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/deficit": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Deficit Overview */
        get: operations["deficit_overview_api_deficit_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/debt": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Debt */
        get: operations["debt_api_debt_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/debt/federal": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Federal */
        get: operations["federal_api_debt_federal_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** AverageMaturityDTO */
        AverageMaturityDTO: {
            /**
             * Ref Date
             * Format: date
             */
            ref_date: string;
            /** Years */
            years: number;
        };
        /**
         * Dataset
         * @description Fonte que não cabe em `observations`, com tabela e refresh próprios.
         * @enum {string}
         */
        Dataset: "federal_debt_stock" | "focus_expectations";
        /**
         * DebtLevelDTO
         * @description Dívida líquida do setor público e bruta do governo geral, em fração do PIB
         *     (0.6926 é 69,26%).
         */
        DebtLevelDTO: {
            /**
             * Ref Date
             * Format: date
             */
            ref_date: string;
            /** Net */
            net: number;
            /** Gross */
            gross: number;
        };
        /** DebtOverviewDTO */
        DebtOverviewDTO: {
            /** Levels */
            levels: components["schemas"]["DebtLevelDTO"][];
            /** Rates */
            rates: components["schemas"]["DebtRatesDTO"][];
            stabilization: components["schemas"]["StabilizationDTO"];
        };
        /**
         * DebtRatesDTO
         * @description Os 12 meses que terminam em `ref_date`, em fração: `implicit_rate` é o r, juro
         *     médio da dívida líquida; `nominal_growth` é o g, crescimento do PIB nominal.
         */
        DebtRatesDTO: {
            /**
             * Ref Date
             * Format: date
             */
            ref_date: string;
            /** Implicit Rate */
            implicit_rate: number;
            /** Nominal Growth */
            nominal_growth: number;
        };
        /**
         * DeficitDTO
         * @description `interest_share` é a fração do déficit nominal que é juro (0.93 é 93%), `null`
         *     sem déficit nominal. `years` traz dezembro de cada ano e, por último, o último
         *     mês publicado.
         */
        DeficitDTO: {
            last: components["schemas"]["DeficitPointDTO"];
            /** Interest Share */
            interest_share: number | null;
            /** Years */
            years: components["schemas"]["DeficitPointDTO"][];
        };
        /**
         * DeficitPointDTO
         * @description Os 12 meses que terminam em `ref_date`, em fração do PIB (0.0948 é 9,48%). Na
         *     convenção da NFSP, positivo é déficit e negativo é superávit; o nominal é o
         *     primário mais os juros.
         */
        DeficitPointDTO: {
            /**
             * Ref Date
             * Format: date
             */
            ref_date: string;
            /** Nominal */
            nominal: number;
            /** Primary */
            primary: number;
            /** Interest */
            interest: number;
        };
        /** DeviationDTO */
        DeviationDTO: {
            /**
             * Ref Date
             * Format: date
             */
            ref_date: string;
            /** Rate */
            rate: number;
            /** Typical */
            typical: number;
            /** Difference */
            difference: number;
        };
        /**
         * DollarDTO
         * @description A média mensal em reais por dólar; `change_12m` em fração contra o mesmo mês do
         *     ano anterior.
         */
        DollarDTO: {
            /** Months */
            months: components["schemas"]["MonthValueDTO"][];
            /** Change 12M */
            change_12m: number | null;
        };
        /**
         * ErrorResponse
         * @description O envelope único de erro: todo 4xx/5xx sai assim, com `detail` sempre string.
         */
        ErrorResponse: {
            /** Detail */
            detail: string;
        };
        /**
         * ExternalSectorDTO
         * @description Cada gráfico na sua janela, terminando no último dado: 24 meses de dólar, 10
         *     anos de fluxos e de reservas, e um ponto por ano nos últimos 6 anos da posição.
         */
        ExternalSectorDTO: {
            dollar: components["schemas"]["DollarDTO"];
            /** Flows */
            flows: components["schemas"]["FlowPointDTO"][];
            reserves: components["schemas"]["ReservesDTO"];
            /** Position */
            position: components["schemas"]["PositionPointDTO"][];
        };
        /**
         * FederalDebtDTO
         * @description O estoque do último mês do Tesouro. As frações são da dívida em mercado, menos
         *     `central_bank_share`, que é a parte de todos os títulos emitidos na carteira do
         *     Banco Central. `average_maturity` vem do SGS, `null` antes de ele estar no cache.
         */
        FederalDebtDTO: {
            /**
             * Stock Month
             * Format: date
             */
            stock_month: string;
            /** Maturing 12M */
            maturing_12m: number;
            /** Central Bank Share */
            central_bank_share: number;
            average_maturity: components["schemas"]["AverageMaturityDTO"] | null;
            /** Composition */
            composition: components["schemas"]["YearCompositionDTO"][];
            /** Maturities */
            maturities: components["schemas"]["MaturityBucketDTO"][];
        };
        /**
         * FlowPointDTO
         * @description Transações correntes e investimento direto no país acumulados nos 12 meses que
         *     terminam em `ref_date`, em fração do PIB (-0.0247 é um déficit de 2,47% do PIB).
         */
        FlowPointDTO: {
            /**
             * Ref Date
             * Format: date
             */
            ref_date: string;
            /** Current Account */
            current_account: number;
            /** Fdi */
            fdi: number;
        };
        /** GdpShareDTO */
        GdpShareDTO: {
            /**
             * Ref Date
             * Format: date
             */
            ref_date: string;
            /** Share */
            share: number;
        };
        /**
         * GroupAccumulatedDTO
         * @description `simple_sum` soma as variações mensais: a conta errada, só para contraste.
         */
        GroupAccumulatedDTO: {
            series_id: components["schemas"]["SeriesId"];
            /** Rate */
            rate: number;
            /** Simple Sum */
            simple_sum: number;
        };
        /**
         * GroupPaceDTO
         * @description O 12 meses do grupo no fim, em fração, e as janelas de 1, 3 e 6 meses que têm
         *     dado no cache.
         */
        GroupPaceDTO: {
            series_id: components["schemas"]["SeriesId"];
            /** Rolling 12M */
            rolling_12m: number;
            /** Windows */
            windows: components["schemas"]["PaceWindowDTO"][];
        };
        /**
         * GroupPurchasingPowerDTO
         * @description `change` negativo é perda de poder de compra no grupo; positivo, ganho.
         *     `naive_change` é a subtração, só para contraste.
         */
        GroupPurchasingPowerDTO: {
            series_id: components["schemas"]["SeriesId"];
            /** Inflation */
            inflation: number;
            /** Change */
            change: number;
            /** Naive Change */
            naive_change: number;
        };
        /** GroupRateDTO */
        GroupRateDTO: {
            series_id: components["schemas"]["SeriesId"];
            /**
             * Ref Date
             * Format: date
             */
            ref_date: string;
            /** Rate */
            rate: number;
        };
        /** GroupSeasonalityDTO */
        GroupSeasonalityDTO: {
            series_id: components["schemas"]["SeriesId"];
            /** Months */
            months: components["schemas"]["MonthRateDTO"][];
            /** Bands */
            bands: components["schemas"]["MonthBandDTO"][];
            largest_deviation: components["schemas"]["DeviationDTO"] | null;
        };
        /**
         * Indexer
         * @description O que corrige o valor de um título até o vencimento.
         * @enum {string}
         */
        Indexer: "selic" | "fixed" | "ipca" | "igpm" | "fx" | "other";
        /** IndexerShareDTO */
        IndexerShareDTO: {
            indexer: components["schemas"]["Indexer"];
            /** Share */
            share: number;
        };
        /**
         * InflationGroupsDTO
         * @description Taxas em fração (0.0054 é 0,54%). `rolling_12m` só traz os meses com os 12
         *     meses completos no cache.
         */
        InflationGroupsDTO: {
            period: components["schemas"]["PeriodDTO"];
            /** Monthly */
            monthly: components["schemas"]["GroupRateDTO"][];
            /** Accumulated */
            accumulated: components["schemas"]["GroupAccumulatedDTO"][];
            /** Rolling 12M */
            rolling_12m: components["schemas"]["GroupRateDTO"][];
        };
        /**
         * InflationPaceDTO
         * @description O ritmo no fim do período. As inclinações são diferenças entre dois 12 meses,
         *     em fração (-0.005 é -0,50 p.p.); o veredito usa a de 3 meses, e inclinação dentro
         *     de `steady_band` para cima ou para baixo é estável. `last_months_difference` soma
         *     as diferenças dos 3 últimos meses contra o ano anterior.
         */
        InflationPaceDTO: {
            /**
             * End
             * Format: date
             */
            end: string;
            /** General 12M */
            general_12m: components["schemas"]["RollingPointDTO"][];
            band: components["schemas"]["TargetBandDTO"] | null;
            /** Last Months */
            last_months: components["schemas"]["MonthVsYearBeforeDTO"][];
            /** Last Months Difference */
            last_months_difference: number;
            /** Change 1M */
            change_1m: number;
            /** Change 3M */
            change_3m: number;
            verdict: components["schemas"]["PaceVerdict"];
            /** Steady Band */
            steady_band: number;
            /** Groups */
            groups: components["schemas"]["GroupPaceDTO"][];
        };
        /**
         * MaturityBucketDTO
         * @description A fração da dívida em mercado que vence de `start` até `end`; sem `end`, de
         *     `start` em diante. `within_12m` marca as faixas que começam nos 12 meses
         *     seguintes ao estoque.
         */
        MaturityBucketDTO: {
            /**
             * Start
             * Format: date
             */
            start: string;
            /** End */
            end: string | null;
            /** Share */
            share: number;
            /** Within 12M */
            within_12m: boolean;
        };
        /**
         * MonthBandDTO
         * @description A faixa de um mês do calendário (1 a 12) nos anos comparados, em fração.
         */
        MonthBandDTO: {
            /** Month */
            month: number;
            /** Low */
            low: number;
            /** High */
            high: number;
            /** Mean */
            mean: number;
        };
        /** MonthRateDTO */
        MonthRateDTO: {
            /**
             * Ref Date
             * Format: date
             */
            ref_date: string;
            /** Rate */
            rate: number;
        };
        /** MonthValueDTO */
        MonthValueDTO: {
            /**
             * Ref Date
             * Format: date
             */
            ref_date: string;
            /** Value */
            value: number;
        };
        /**
         * MonthVsYearBeforeDTO
         * @description Um mês contra o mesmo mês do ano anterior; `difference` em fração de ponto.
         */
        MonthVsYearBeforeDTO: {
            /**
             * Ref Date
             * Format: date
             */
            ref_date: string;
            /** Rate */
            rate: number;
            /** Year Before */
            year_before: number;
            /** Difference */
            difference: number;
        };
        /**
         * PaceVerdict
         * @enum {string}
         */
        PaceVerdict: "accelerating" | "steady" | "slowing";
        /**
         * PaceWindowDTO
         * @description O 12 meses `months` meses antes do fim e a inclinação até o fim, em fração;
         *     `relative_change` é a inclinação como fração do valor de antes (-0.21 é -21%).
         */
        PaceWindowDTO: {
            /** Months */
            months: number;
            /** Rolling 12M Before */
            rolling_12m_before: number;
            /** Change */
            change: number;
            /** Relative Change */
            relative_change: number;
        };
        /**
         * PeriodDTO
         * @description Meses datados no dia 1: o período efetivo e o intervalo com dado no cache.
         */
        PeriodDTO: {
            /**
             * Start
             * Format: date
             */
            start: string;
            /**
             * End
             * Format: date
             */
            end: string;
            /**
             * First Available
             * Format: date
             */
            first_available: string;
            /**
             * Last Available
             * Format: date
             */
            last_available: string;
        };
        /**
         * PositionPointDTO
         * @description A posição internacional no fim do trimestre que começa em `ref_date`, em fração
         *     do PIB de 12 meses; `net` é ativos menos passivos.
         */
        PositionPointDTO: {
            /**
             * Ref Date
             * Format: date
             */
            ref_date: string;
            /** Assets */
            assets: number;
            /** Liabilities */
            liabilities: number;
            /** Net */
            net: number;
        };
        /**
         * PurchasingPowerDTO
         * @description Taxas em fração; os grupos vêm da maior perda ao maior ganho.
         */
        PurchasingPowerDTO: {
            period: components["schemas"]["PeriodDTO"];
            reference: components["schemas"]["RaiseReference"];
            /** Reference Raise */
            reference_raise: number;
            /** References */
            references: components["schemas"]["ReferenceRaiseDTO"][];
            /** Groups */
            groups: components["schemas"]["GroupPurchasingPowerDTO"][];
        };
        /**
         * RaiseReference
         * @enum {string}
         */
        RaiseReference: "ipca" | "inpc" | "minimum_wage" | "custom";
        /**
         * ReferenceRaiseDTO
         * @description O reajuste da referência no período; `null` quando o cache não o cobre.
         */
        ReferenceRaiseDTO: {
            reference: components["schemas"]["RaiseReference"];
            /** Rate */
            rate: number | null;
        };
        /**
         * RefreshReportDTO
         * @description As séries e as fontes que não são série (`datasets_*`) atualizadas ou com
         *     falta nova.
         */
        RefreshReportDTO: {
            /** Updated */
            updated: components["schemas"]["SeriesId"][];
            /** Failed */
            failed: components["schemas"]["SeriesId"][];
            /** Datasets Updated */
            datasets_updated: components["schemas"]["Dataset"][];
            /** Datasets Failed */
            datasets_failed: components["schemas"]["Dataset"][];
        };
        /**
         * ReservesDTO
         * @description O estoque do fim de cada mês em US$ milhões, e a fração do PIB do último mês
         *     que tem o PIB de 12 meses.
         */
        ReservesDTO: {
            /** Months */
            months: components["schemas"]["MonthValueDTO"][];
            gdp_share: components["schemas"]["GdpShareDTO"] | null;
        };
        /**
         * RollingPointDTO
         * @description O 12 meses que termina em `ref_date`, em fração, e a faixa da meta do ano.
         */
        RollingPointDTO: {
            /**
             * Ref Date
             * Format: date
             */
            ref_date: string;
            /** Rate */
            rate: number;
            band: components["schemas"]["TargetBandDTO"] | null;
        };
        /** SeasonalityDTO */
        SeasonalityDTO: {
            /** Year */
            year: number;
            /** Years Compared */
            years_compared: number[];
            /** Groups */
            groups: components["schemas"]["GroupSeasonalityDTO"][];
        };
        /**
         * SeriesId
         * @enum {string}
         */
        SeriesId: "ipca_general" | "ipca_food" | "ipca_housing" | "ipca_household" | "ipca_apparel" | "ipca_transport" | "ipca_health" | "ipca_personal" | "ipca_education" | "ipca_communication" | "inpc" | "minimum_wage" | "inflation_target" | "dollar_monthly" | "current_account_gdp" | "fdi_gdp" | "reserves" | "gdp_usd_12m" | "iip_assets" | "iip_liabilities" | "nominal_deficit" | "primary_deficit" | "nominal_interest" | "net_debt" | "net_debt_brl" | "gross_debt" | "gdp_12m" | "federal_debt_maturity";
        /**
         * SeriesStatusDTO
         * @description Até que mês o cache tem dado real, e quando a fonte respondeu pela última vez.
         */
        SeriesStatusDTO: {
            series_id: components["schemas"]["SeriesId"];
            /** Last Ref Date */
            last_ref_date: string | null;
            /** Succeeded At */
            succeeded_at: string | null;
        };
        /**
         * StabilizationDTO
         * @description A conta do primário que estabiliza a dívida/PIB, em fração. `debt` é a dívida
         *     líquida; `primary_surplus` é o superávit feito (negativo é déficit); `primary_gap`
         *     é o quanto falta do feito até o `stabilizing_primary`.
         */
        StabilizationDTO: {
            /**
             * Ref Date
             * Format: date
             */
            ref_date: string;
            /** Debt */
            debt: number;
            /** Implicit Rate */
            implicit_rate: number;
            /** Nominal Growth */
            nominal_growth: number;
            /** Stabilizing Primary */
            stabilizing_primary: number;
            /** Primary Surplus */
            primary_surplus: number;
            /** Primary Gap */
            primary_gap: number;
        };
        /**
         * TargetBandDTO
         * @description A meta de inflação do ano e os limites do intervalo de tolerância, em fração.
         */
        TargetBandDTO: {
            /** Target */
            target: number;
            /** Floor */
            floor: number;
            /** Ceiling */
            ceiling: number;
        };
        /**
         * YearCompositionDTO
         * @description A fração da dívida federal em mercado de cada indexador no fim do mês.
         */
        YearCompositionDTO: {
            /**
             * Ref Date
             * Format: date
             */
            ref_date: string;
            /** Shares */
            shares: components["schemas"]["IndexerShareDTO"][];
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    refresh_api_series_refresh_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RefreshReportDTO"];
                };
            };
        };
    };
    status_api_series_status_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SeriesStatusDTO"][];
                };
            };
        };
    };
    groups_api_inflation_groups_get: {
        parameters: {
            query?: {
                start?: string | null;
                end?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InflationGroupsDTO"];
                };
            };
            /** @description Unprocessable Content */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    pace_api_inflation_pace_get: {
        parameters: {
            query?: {
                end?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InflationPaceDTO"];
                };
            };
            /** @description Unprocessable Content */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    seasonality_by_group_api_inflation_seasonality_get: {
        parameters: {
            query?: {
                year?: number | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SeasonalityDTO"];
                };
            };
            /** @description Unprocessable Content */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    purchasing_power_by_group_api_inflation_purchasing_power_get: {
        parameters: {
            query?: {
                reference?: components["schemas"]["RaiseReference"];
                start?: string | null;
                end?: string | null;
                custom_raise?: number | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PurchasingPowerDTO"];
                };
            };
            /** @description Unprocessable Content */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    external_sector_overview_api_external_sector_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExternalSectorDTO"];
                };
            };
            /** @description Unprocessable Content */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    deficit_overview_api_deficit_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DeficitDTO"];
                };
            };
            /** @description Unprocessable Content */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    debt_api_debt_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DebtOverviewDTO"];
                };
            };
            /** @description Unprocessable Content */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    federal_api_debt_federal_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FederalDebtDTO"];
                };
            };
            /** @description Unprocessable Content */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
}
