import { BrowserRouter } from "react-router";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "./App.css";

import { createTheme, MantineProvider, Paper } from "@mantine/core";

import AppRoutes from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  const theme = createTheme({
    fontFamily: "Roboto",
    components: {
      Paper: Paper.extend({
        defaultProps: {
          // bg: "dark.6",
          bg: "#2D2C2C",
        },
      }),
    },
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
