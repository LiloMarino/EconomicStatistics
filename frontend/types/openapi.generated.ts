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
        /**
         * ErrorResponse
         * @description O envelope único de erro: todo 4xx/5xx sai assim, com `detail` sempre string.
         */
        ErrorResponse: {
            /** Detail */
            detail: string;
        };
        /** GroupAccumulatedDTO */
        GroupAccumulatedDTO: {
            series_id: components["schemas"]["SeriesId"];
            /** Rate */
            rate: number;
        };
        /**
         * GroupPurchasingPowerDTO
         * @description `change` negativo é perda de poder de compra no grupo; positivo, ganho.
         */
        GroupPurchasingPowerDTO: {
            series_id: components["schemas"]["SeriesId"];
            /** Inflation */
            inflation: number;
            /** Change */
            change: number;
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
            /** Groups */
            groups: components["schemas"]["GroupPurchasingPowerDTO"][];
        };
        /**
         * RaiseReference
         * @enum {string}
         */
        RaiseReference: "ipca" | "inpc" | "minimum_wage" | "custom";
        /** RefreshReportDTO */
        RefreshReportDTO: {
            /** Updated */
            updated: components["schemas"]["SeriesId"][];
            /** Failed */
            failed: components["schemas"]["SeriesId"][];
        };
        /**
         * SeriesId
         * @enum {string}
         */
        SeriesId: "ipca_general" | "ipca_food" | "ipca_housing" | "ipca_household" | "ipca_apparel" | "ipca_transport" | "ipca_health" | "ipca_personal" | "ipca_education" | "ipca_communication" | "inpc" | "minimum_wage";
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
