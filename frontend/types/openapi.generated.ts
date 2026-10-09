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
    "/api/activity": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Activity Overview */
        get: operations["activity_overview_api_activity_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/credit": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Credit Overview */
        get: operations["credit_overview_api_credit_get"];
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
    "/api/debt/simulation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Simulation
         * @description Tudo em fração: `debt=0.8` é 80% do PIB, `r=0.1` é 10% ao ano e `primary=0.0224`
         *     é um superávit de 2,24% do PIB.
         */
        get: operations["simulation_api_debt_simulation_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/debt/simulation/cases": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Cases */
        get: operations["cases_api_debt_simulation_cases_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/debt/simulation/countries": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Countries */
        get: operations["countries_api_debt_simulation_countries_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/focus/report": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Report */
        get: operations["report_api_focus_report_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/focus/history": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** History */
        get: operations["history_api_focus_history_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/interest": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Interest Overview */
        get: operations["interest_overview_api_interest_get"];
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
        /**
         * ActivityDTO
         * @description Cada gráfico nos últimos 4 anos, terminando no último dado da série.
         */
        ActivityDTO: {
            gdp: components["schemas"]["GdpDTO"];
            ibc: components["schemas"]["IbcDTO"];
            unemployment: components["schemas"]["UnemploymentDTO"];
        };
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
        /** CaseContextDTO */
        CaseContextDTO: {
            /** Currency */
            currency: string;
            /** Term */
            term: string;
            /** Lender */
            lender: string;
            /** Story */
            story: string;
        };
        /**
         * ConcessionsDTO
         * @description A variação em 12 meses das concessões de recursos livres, em fração (0.062 é
         *     6,2%), dos últimos 24 meses: a soma dos 12 meses que terminam em `ref_date` sobre a
         *     dos 12 anteriores. `households` não conta o rotativo do cartão.
         */
        ConcessionsDTO: {
            /** Business */
            business: components["schemas"]["MonthValueDTO"][];
            /** Households */
            households: components["schemas"]["MonthValueDTO"][];
        };
        /**
         * CostDTO
         * @description Os últimos 24 meses com ICC e Selic. `spread` é o ICC menos a Selic do último
         *     mês, em fração (0.09 é 9 pontos percentuais).
         */
        CostDTO: {
            /** Months */
            months: components["schemas"]["CostMonthDTO"][];
            /** Spread */
            spread: number;
        };
        /**
         * CostMonthDTO
         * @description O custo do crédito (ICC) e a Selic meta de fim do mês `ref_date`, ao ano e em
         *     fração (0.2419 é 24,19% ao ano).
         */
        CostMonthDTO: {
            /**
             * Ref Date
             * Format: date
             */
            ref_date: string;
            /** Cost */
            cost: number;
            /** Selic */
            selic: number;
        };
        /**
         * Country
         * @description País da comparação internacional, pelo código ISO de 3 letras que o FMI usa, na
         *     ordem em que a tela os lista.
         * @enum {string}
         */
        Country: "JPN" | "GRC" | "ARG" | "BRA";
        /** CountryHistoriesDTO */
        CountryHistoriesDTO: {
            /** Countries */
            countries: components["schemas"]["CountryHistoryDTO"][];
        };
        /**
         * CountryHistoryDTO
         * @description A dívida bruta do governo geral em fração do PIB, ano a ano, e a inflação do
         *     último ano com dado do FMI (`null` sem dado).
         */
        CountryHistoryDTO: {
            country: components["schemas"]["Country"];
            /** Debt */
            debt: components["schemas"]["YearValueDTO"][];
            inflation: components["schemas"]["YearValueDTO"] | null;
        };
        /** CreditDTO */
        CreditDTO: {
            cost: components["schemas"]["CostDTO"];
            concessions: components["schemas"]["ConcessionsDTO"];
        };
        /**
         * Dataset
         * @description Fonte que não cabe em `observations`, com tabela e refresh próprios.
         * @enum {string}
         */
        Dataset: "federal_debt_stock" | "focus_expectations" | "copom_meetings" | "imf_countries";
        /**
         * DebtCaseDTO
         * @description Um ponto de partida: dívida, juro, crescimento e primário em fração, a
         *     trajetória de `years` anos e `rate_minus_growth` (r menos g). O exemplo não tem
         *     `context`.
         */
        DebtCaseDTO: {
            id: components["schemas"]["DebtCaseId"];
            /** Label */
            label: string;
            group: components["schemas"]["DebtCaseGroup"];
            /** Debt */
            debt: number;
            /** Rate */
            rate: number;
            /** Growth */
            growth: number;
            /** Primary */
            primary: number;
            context: components["schemas"]["CaseContextDTO"] | null;
            /** Path */
            path: number[];
            /** End */
            end: number;
            /** Rate Minus Growth */
            rate_minus_growth: number;
        };
        /**
         * DebtCaseGroup
         * @description Se o ponto de partida do simulador aconteceu de verdade ou é um exemplo para entender a conta.
         * @enum {string}
         */
        DebtCaseGroup: "happened" | "example";
        /**
         * DebtCaseId
         * @description Ponto de partida do simulador da dívida.
         * @enum {string}
         */
        DebtCaseId: "brazil_today" | "brazil_collor" | "brazil_2002" | "brazil_2015" | "japan" | "greece" | "argentina_2001" | "argentina_2023" | "country_a" | "country_b";
        /** DebtCasesDTO */
        DebtCasesDTO: {
            /** Years */
            years: number;
            /** Cases */
            cases: components["schemas"]["DebtCaseDTO"][];
        };
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
            levels_forecast: components["schemas"]["LevelsForecastDTO"] | null;
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
         * DebtTrend
         * @description Para onde a dívida/PIB vai ao longo do horizonte do simulador.
         * @enum {string}
         */
        DebtTrend: "falling" | "stable" | "rising";
        /**
         * DeficitDTO
         * @description `interest_share` é a fração do déficit nominal que é juro (0.93 é 93%), `null`
         *     sem déficit nominal. `years` traz dezembro de cada ano e, por último, o último
         *     mês publicado; `months`, os 12 meses que terminam em cada mês desde o começo da
         *     série; `spheres`, o último mês dividido entre as esferas.
         */
        DeficitDTO: {
            last: components["schemas"]["DeficitPointDTO"];
            /** Interest Share */
            interest_share: number | null;
            /** Years */
            years: components["schemas"]["DeficitPointDTO"][];
            /** Months */
            months: components["schemas"]["DeficitPointDTO"][];
            /** Spheres */
            spheres: components["schemas"]["SphereDeficitDTO"][];
            forecast: components["schemas"]["DeficitForecastDTO"] | null;
        };
        /**
         * DeficitForecastDTO
         * @description O que o Focus espera para dezembro de cada ano, na mesma convenção e fração do
         *     PIB dos pontos reais; os juros são o nominal menos o primário.
         */
        DeficitForecastDTO: {
            /**
             * Survey Date
             * Format: date
             */
            survey_date: string;
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
         * @description A PTAX do fim de cada mês em reais por dólar; `change_12m` em fração contra o
         *     mesmo mês do ano anterior. `forecast` é o câmbio de fim de mês que o Focus
         *     espera.
         */
        DollarDTO: {
            /** Months */
            months: components["schemas"]["MonthValueDTO"][];
            /** Change 12M */
            change_12m: number | null;
            forecast: components["schemas"]["MonthlyForecastDTO"] | null;
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
            flows_forecast: components["schemas"]["FlowsForecastDTO"] | null;
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
         * FirstYearDTO
         * @description A conta do primeiro ano, em fração do PIB: `grown_debt` é a dívida depois do juro
         *     e do crescimento, `debt` é ela depois de abatido o primário.
         */
        FirstYearDTO: {
            /** Grown Debt */
            grown_debt: number;
            /** Debt */
            debt: number;
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
        /**
         * FlowsForecastDTO
         * @description O que o Focus espera para o ano em transações correntes e investimento direto,
         *     em US$ bilhões (-60.0 é um déficit de US$ 60 bilhões).
         */
        FlowsForecastDTO: {
            /**
             * Survey Date
             * Format: date
             */
            survey_date: string;
            /** Year */
            year: number;
            /** Current Account */
            current_account: number;
            /** Fdi */
            fdi: number;
        };
        /**
         * FocusDirection
         * @description Para onde a previsão andou de uma pesquisa semanal para a seguinte.
         * @enum {string}
         */
        FocusDirection: "up" | "down" | "stable";
        /**
         * FocusHistoryDTO
         * @description A previsão para `year` em cada pesquisa semanal, na convenção do relatório.
         *     `streak_start` é o valor de onde a sequência da última semana saiu; `band` é a
         *     meta do ano, só no IPCA.
         */
        FocusHistoryDTO: {
            indicator: components["schemas"]["FocusIndicator"];
            unit: components["schemas"]["Unit"];
            /** Year */
            year: number;
            /** Years */
            years: number[];
            /** Points */
            points: components["schemas"]["HistoryPointDTO"][];
            direction: components["schemas"]["FocusDirection"] | null;
            /** Streak Weeks */
            streak_weeks: number | null;
            /** Streak Start */
            streak_start: number | null;
            band: components["schemas"]["TargetBandDTO"] | null;
        };
        /**
         * FocusIndicator
         * @description Os indicadores que a pesquisa Focus pergunta hoje.
         * @enum {string}
         */
        FocusIndicator: "ipca" | "ipca_administered" | "ipca_free" | "ipca_services" | "ipca_industrial_goods" | "ipca_food_at_home" | "exchange_rate" | "igpm" | "unemployment" | "selic" | "gdp" | "gdp_agriculture" | "gdp_industry" | "gdp_services" | "gdp_household_consumption" | "gdp_government_consumption" | "gdp_investment" | "gdp_exports" | "gdp_imports" | "primary_balance" | "nominal_balance" | "net_debt" | "gross_debt" | "current_account" | "trade_balance" | "exports" | "imports" | "fdi";
        /** FocusReportDTO */
        FocusReportDTO: {
            /**
             * Survey Date
             * Format: date
             */
            survey_date: string;
            /** Rows */
            rows: components["schemas"]["ReportRowDTO"][];
        };
        /**
         * GdpDTO
         * @description O PIB acumulado em 4 trimestres, em fração (0.019 é 1,9%), datado no mês em que
         *     cada trimestre termina. `forecast` é o PIB do ano que o Focus espera, em dezembro
         *     do ano corrente e do seguinte.
         */
        GdpDTO: {
            /** Quarters */
            quarters: components["schemas"]["MonthValueDTO"][];
            forecast: components["schemas"]["MonthlyForecastDTO"] | null;
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
            months: components["schemas"]["backend__features__inflation__router__MonthRateDTO"][];
            /** Bands */
            bands: components["schemas"]["MonthBandDTO"][];
            largest_deviation: components["schemas"]["DeviationDTO"] | null;
        };
        /** HistoryPointDTO */
        HistoryPointDTO: {
            /**
             * Survey Date
             * Format: date
             */
            survey_date: string;
            /** Value */
            value: number;
            /** Respondents */
            respondents: number;
        };
        /**
         * IbcDTO
         * @description A variação em 12 meses do IBC-Br, em fração, calculada do índice mensal: média
         *     dos 12 meses que terminam em `ref_date` sobre a média dos 12 anteriores.
         */
        IbcDTO: {
            /** Months */
            months: components["schemas"]["MonthValueDTO"][];
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
         * InflationDTO
         * @description O IPCA acumulado em 12 meses, mês a mês, e a continuação pelo Focus.
         */
        InflationDTO: {
            /** Months */
            months: components["schemas"]["backend__features__interest__router__MonthRateDTO"][];
            forecast: components["schemas"]["RateForecastDTO"] | null;
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
            forecast: components["schemas"]["PaceForecastDTO"] | null;
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
        /** InterestDTO */
        InterestDTO: {
            selic: components["schemas"]["SelicDTO"];
            inflation: components["schemas"]["InflationDTO"];
            next_meeting: components["schemas"]["NextMeetingDTO"] | null;
            real_rate: components["schemas"]["RealRateDTO"] | null;
        };
        /**
         * LevelsForecastDTO
         * @description A dívida líquida e a bruta que o Focus espera para dezembro de cada ano, em
         *     fração do PIB.
         */
        LevelsForecastDTO: {
            /**
             * Survey Date
             * Format: date
             */
            survey_date: string;
            /** Years */
            years: components["schemas"]["DebtLevelDTO"][];
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
         * MeetingDTO
         * @description A reunião de ordem `number` no ano, a `R<number>/<year>` do Focus.
         */
        MeetingDTO: {
            /** Year */
            year: number;
            /** Number */
            number: number;
            /**
             * First Day
             * Format: date
             */
            first_day: string;
            /**
             * Second Day
             * Format: date
             */
            second_day: string;
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
         * MonthlyForecastDTO
         * @description O valor esperado em cada mês depois do último dado, pela pesquisa Focus de
         *     `survey_date`.
         */
        MonthlyForecastDTO: {
            /**
             * Survey Date
             * Format: date
             */
            survey_date: string;
            /** Months */
            months: components["schemas"]["MonthValueDTO"][];
        };
        /**
         * NextMeetingDTO
         * @description A próxima reunião, a meta que o mercado espera dela e a diferença para a meta de
         *     hoje, em fração do ano (-0.0025 é um corte de 0,25 ponto percentual).
         */
        NextMeetingDTO: {
            meeting: components["schemas"]["MeetingDTO"];
            /** Expected */
            expected: number;
            /** Change */
            change: number;
            /**
             * Survey Date
             * Format: date
             */
            survey_date: string;
        };
        /**
         * PaceForecastDTO
         * @description O 12 meses esperado em cada mês depois do último IPCA publicado, composto com a
         *     previsão mensal da pesquisa Focus de `survey_date`.
         */
        PaceForecastDTO: {
            /**
             * Survey Date
             * Format: date
             */
            survey_date: string;
            /** Points */
            points: components["schemas"]["RollingPointDTO"][];
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
         * RateForecastDTO
         * @description A taxa esperada em cada mês depois do último dado, pela pesquisa Focus de
         *     `survey_date`.
         */
        RateForecastDTO: {
            /**
             * Survey Date
             * Format: date
             */
            survey_date: string;
            /** Months */
            months: components["schemas"]["backend__features__interest__router__MonthRateDTO"][];
        };
        /**
         * RealRateDTO
         * @description A meta de hoje dividida pela inflação esperada para os 12 meses seguintes.
         */
        RealRateDTO: {
            /** Rate */
            rate: number;
            /** Selic */
            selic: number;
            /** Expected Inflation */
            expected_inflation: number;
            /**
             * Survey Date
             * Format: date
             */
            survey_date: string;
        };
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
         * ReportRowDTO
         * @description A mediana do Focus para o ano hoje, uma semana e quatro semanas antes. O que o
         *     Focus publica em % vem em fração (0.0501 é 5,01%), o câmbio em R$/US$ e as contas
         *     externas em US$ bilhões. Primário e nominal seguem o sinal do Focus: negativo é
         *     déficit. `streak_weeks` conta as semanas seguidas na `direction` da última.
         */
        ReportRowDTO: {
            indicator: components["schemas"]["FocusIndicator"];
            unit: components["schemas"]["Unit"];
            /** Year */
            year: number;
            /** Today */
            today: number;
            /** Week Before */
            week_before: number | null;
            /** Weeks Before */
            weeks_before: number | null;
            direction: components["schemas"]["FocusDirection"] | null;
            /** Streak Weeks */
            streak_weeks: number | null;
            /** Respondents */
            respondents: number;
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
         * SelicChangeDTO
         * @description O dia em que a meta passou de `before` para `after`, ao ano e em fração.
         */
        SelicChangeDTO: {
            /**
             * Effective Date
             * Format: date
             */
            effective_date: string;
            /** Before */
            before: number;
            /** After */
            after: number;
        };
        /**
         * SelicDTO
         * @description A meta ao ano em vigor no fim de cada mês (no último, a de hoje), a de hoje em
         *     `current` e a previsão de fim de mês que sai das reuniões esperadas.
         */
        SelicDTO: {
            /** Months */
            months: components["schemas"]["backend__features__interest__router__MonthRateDTO"][];
            /** Current */
            current: number;
            last_change: components["schemas"]["SelicChangeDTO"] | null;
            forecast: components["schemas"]["RateForecastDTO"] | null;
        };
        /**
         * SeriesId
         * @enum {string}
         */
        SeriesId: "ipca_general" | "ipca_food" | "ipca_housing" | "ipca_household" | "ipca_apparel" | "ipca_transport" | "ipca_health" | "ipca_personal" | "ipca_education" | "ipca_communication" | "inpc" | "minimum_wage" | "inflation_target" | "selic_target" | "dollar_month_end" | "current_account_gdp" | "fdi_gdp" | "reserves" | "gdp_usd_12m" | "iip_assets" | "iip_liabilities" | "nominal_deficit" | "primary_deficit" | "nominal_interest" | "primary_deficit_central" | "primary_deficit_regional" | "primary_deficit_state_owned" | "nominal_interest_central" | "nominal_interest_regional" | "nominal_interest_state_owned" | "net_debt" | "net_debt_brl" | "gross_debt" | "gdp_12m" | "federal_debt_maturity" | "gdp_growth_4q" | "ibc_br" | "unemployment_rate" | "credit_cost" | "concessions_business" | "concessions_households";
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
         * SimulationDTO
         * @description A trajetória da dívida/PIB em fração (0.8 é 80%), com a de hoje em `path[0]` e
         *     uma posição por ano. `change` é o fim menos o início; `still_rising` diz se o último
         *     ano ainda subiu; `stabilizing_primary` é o primário que deixa a dívida parada;
         *     `primary_gap` é o que falta dele até o primário escolhido (negativo é folga);
         *     `rate_minus_growth` é o r menos o g.
         */
        SimulationDTO: {
            /** Years */
            years: number;
            /** Path */
            path: number[];
            /** End */
            end: number;
            /** Change */
            change: number;
            trend: components["schemas"]["DebtTrend"];
            /** Still Rising */
            still_rising: boolean;
            /** Stabilizing Primary */
            stabilizing_primary: number;
            /** Primary Gap */
            primary_gap: number;
            /** Rate Minus Growth */
            rate_minus_growth: number;
            first_year: components["schemas"]["FirstYearDTO"];
        };
        /**
         * Sphere
         * @description A esfera do setor público em que o BCB divide a NFSP. O governo central é o
         *     governo federal com o Banco Central; as estatais ficam sem a Petrobras e os bancos
         *     públicos.
         * @enum {string}
         */
        Sphere: "central" | "regional" | "state_owned";
        /**
         * SphereDeficitDTO
         * @description A parte de uma esfera no déficit do último mês, na mesma fração do PIB e
         *     convenção do consolidado; o nominal é o primário mais os juros, e as três esferas
         *     somam o consolidado, a menos do arredondamento do BCB.
         */
        SphereDeficitDTO: {
            sphere: components["schemas"]["Sphere"];
            /** Nominal */
            nominal: number;
            /** Primary */
            primary: number;
            /** Interest */
            interest: number;
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
         * UnemploymentDTO
         * @description A taxa de desocupação do trimestre móvel que termina em cada mês, em fração.
         *     `change_12m` é a diferença contra o mesmo mês do ano anterior, em fração (-0.008 é
         *     -0,8 ponto percentual). `forecast` é a taxa que o Focus espera mês a mês.
         */
        UnemploymentDTO: {
            /** Months */
            months: components["schemas"]["MonthValueDTO"][];
            /** Change 12M */
            change_12m: number | null;
            forecast: components["schemas"]["MonthlyForecastDTO"] | null;
        };
        /**
         * Unit
         * @enum {string}
         */
        Unit: "percent_month" | "percent_year" | "brl" | "brl_per_usd" | "usd_million" | "usd_billion" | "percent_gdp" | "brl_million" | "months" | "percent_4_quarters" | "index" | "percent";
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
        /** YearValueDTO */
        YearValueDTO: {
            /** Year */
            year: number;
            /** Value */
            value: number;
        };
        /** MonthRateDTO */
        backend__features__inflation__router__MonthRateDTO: {
            /**
             * Ref Date
             * Format: date
             */
            ref_date: string;
            /** Rate */
            rate: number;
        };
        /**
         * MonthRateDTO
         * @description A taxa do mês `ref_date`, em fração (0.1375 é 13,75%).
         */
        backend__features__interest__router__MonthRateDTO: {
            /**
             * Ref Date
             * Format: date
             */
            ref_date: string;
            /** Rate */
            rate: number;
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
    activity_overview_api_activity_get: {
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
                    "application/json": components["schemas"]["ActivityDTO"];
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
    credit_overview_api_credit_get: {
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
                    "application/json": components["schemas"]["CreditDTO"];
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
    simulation_api_debt_simulation_get: {
        parameters: {
            query: {
                debt: number;
                r: number;
                g: number;
                primary: number;
                years?: number;
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
                    "application/json": components["schemas"]["SimulationDTO"];
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
    cases_api_debt_simulation_cases_get: {
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
                    "application/json": components["schemas"]["DebtCasesDTO"];
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
    countries_api_debt_simulation_countries_get: {
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
                    "application/json": components["schemas"]["CountryHistoriesDTO"];
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
    report_api_focus_report_get: {
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
                    "application/json": components["schemas"]["FocusReportDTO"];
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
    history_api_focus_history_get: {
        parameters: {
            query: {
                indicator: components["schemas"]["FocusIndicator"];
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
                    "application/json": components["schemas"]["FocusHistoryDTO"];
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
    interest_overview_api_interest_get: {
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
                    "application/json": components["schemas"]["InterestDTO"];
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
