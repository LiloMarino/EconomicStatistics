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
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
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
         * ErrorResponse
         * @description O envelope único de erro: todo 4xx/5xx sai assim, com `detail` sempre string.
         */
        ErrorResponse: {
            /** Detail */
            detail: string;
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
         * @description O 12 meses do grupo no fim e 1, 3 e 6 meses antes, em fração.
         */
        GroupPaceDTO: {
            series_id: components["schemas"]["SeriesId"];
            /** Rolling 12M */
            rolling_12m: number;
            /** Months Before 1 */
            months_before_1: number | null;
            /** Months Before 3 */
            months_before_3: number | null;
            /** Months Before 6 */
            months_before_6: number | null;
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
         *     em fração (-0.005 é -0,50 p.p.); o veredito usa a de 3 meses.
         */
        InflationPaceDTO: {
            /**
             * End
             * Format: date
             */
            end: string;
            /** General 12M */
            general_12m: components["schemas"]["RollingPointDTO"][];
            /** Target */
            target: number | null;
            /** Ceiling */
            ceiling: number | null;
            /** Last Months */
            last_months: components["schemas"]["MonthVsYearBeforeDTO"][];
            /** Change 1M */
            change_1m: number;
            /** Change 3M */
            change_3m: number;
            verdict: components["schemas"]["PaceVerdict"];
            /** Groups */
            groups: components["schemas"]["GroupPaceDTO"][];
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
        /** RefreshReportDTO */
        RefreshReportDTO: {
            /** Updated */
            updated: components["schemas"]["SeriesId"][];
            /** Failed */
            failed: components["schemas"]["SeriesId"][];
        };
        /**
         * RollingPointDTO
         * @description O 12 meses que termina em `ref_date` e o teto da meta do ano, em fração.
         */
        RollingPointDTO: {
            /**
             * Ref Date
             * Format: date
             */
            ref_date: string;
            /** Rate */
            rate: number;
            /** Ceiling */
            ceiling: number | null;
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
        SeriesId: "ipca_general" | "ipca_food" | "ipca_housing" | "ipca_household" | "ipca_apparel" | "ipca_transport" | "ipca_health" | "ipca_personal" | "ipca_education" | "ipca_communication" | "inpc" | "minimum_wage" | "inflation_target";
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
}
