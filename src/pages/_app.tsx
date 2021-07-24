import type { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";

import theme from "ui/styles/theme";
import GlobalStyle from "ui/styles/global";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
