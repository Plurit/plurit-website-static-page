import { BrowserRouter } from "react-router";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "./App.css";

import { createTheme, MantineProvider } from "@mantine/core";

import AppRoutes from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  const theme = createTheme({
    fontFamily: "Roboto",
  });

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <AppRoutes />
        </MantineProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
