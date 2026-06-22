import ReactDOM from "react-dom/client";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

const clienteQuery = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 60 * 1000,       // 30 min antes de refetch
      gcTime: 24 * 60 * 60 * 1000,      // 24h en cache antes de purgar
      retry: 1,
      refetchOnMount: false,             // no recargar al montar
      refetchOnWindowFocus: false,       // no recargar al volver
      refetchOnReconnect: false,         // no recargar al reconectar
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
  key: "SNAKECHAMBER_QUERY_CACHE",
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <PersistQueryClientProvider
    client={clienteQuery}
    persistOptions={{ persister }}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </PersistQueryClientProvider>,
);
