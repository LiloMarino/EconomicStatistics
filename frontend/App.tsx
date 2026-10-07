import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { MainLayout } from "@/layouts/main-layout";
import { ConceptPage } from "@/pages/concept";
import { ErrorPage } from "@/pages/error";
import { InflationPage } from "@/pages/inflation";
import { LearnPage } from "@/pages/learn";
import { PurchasingPowerPage } from "@/pages/purchasing-power";
import { queryClient } from "@/shared/lib/query-client";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<Navigate to="/inflation" replace />} />
            <Route path="inflation" element={<InflationPage />} />
            <Route path="purchasing-power" element={<PurchasingPowerPage />} />
            <Route path="learn" element={<LearnPage />} />
            <Route path="learn/:conceptId" element={<ConceptPage />} />
            <Route path="*" element={<ErrorPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools buttonPosition="bottom-right" />
    </QueryClientProvider>
  );
}
