import type { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";
import theme from "styles/theme";
import GlobalStyle from "../styles/global";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
