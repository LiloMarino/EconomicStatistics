import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { MainLayout } from "@/layouts/main-layout";
import { ActivityPage } from "@/pages/activity";
import { CreditPage } from "@/pages/credit";
import { ConceptPage } from "@/pages/concept";
import { DebtPage } from "@/pages/debt";
import { DeficitPage } from "@/pages/deficit";
import { EconomyHealthPage } from "@/pages/economy-health";
import { ErrorPage } from "@/pages/error";
import { ExplainerPage } from "@/pages/explainer";
import { ExternalSectorPage } from "@/pages/external-sector";
import { FocusPage } from "@/pages/focus";
import { InflationPage } from "@/pages/inflation";
import { InterestPage } from "@/pages/interest";
import { LearnPage } from "@/pages/learn";
import { OverviewPage } from "@/pages/overview";
import { PurchasingPowerPage } from "@/pages/purchasing-power";
import { SimulatorPage } from "@/pages/simulator";
import { queryClient } from "@/shared/lib/query-client";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<OverviewPage />} />
            <Route path="inflation" element={<InflationPage />} />
            <Route path="purchasing-power" element={<PurchasingPowerPage />} />
            <Route path="deficit" element={<DeficitPage />} />
            <Route path="debt" element={<DebtPage />} />
            <Route path="simulator" element={<SimulatorPage />} />
            <Route path="activity" element={<ActivityPage />} />
            <Route path="credit" element={<CreditPage />} />
            <Route path="interest" element={<InterestPage />} />
            <Route path="external-sector" element={<ExternalSectorPage />} />
            <Route path="focus" element={<FocusPage />} />
            <Route path="economy-health" element={<EconomyHealthPage />} />
            <Route path="learn" element={<LearnPage />} />
            <Route path="learn/explainers/:explainerId" element={<ExplainerPage />} />
            <Route path="learn/:conceptId" element={<ConceptPage />} />
            <Route path="*" element={<ErrorPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools buttonPosition="bottom-right" />
    </QueryClientProvider>
  );
}
