import React, { ReactElement } from "react";

import { render } from "@testing-library/react";
import { ThemeProvider } from "styled-components";

import GlobalStyle from "ui/styles/global";
import Theme from "ui/styles/theme";

const Wrapper: React.ComponentType = ({ children }) => {
  return (
    <ThemeProvider theme={Theme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
};

const customRender = (ui: ReactElement, { ...options } = {}) =>
  render(ui, {
    wrapper: Wrapper,
    ...options,
  });

export * from "@testing-library/react";

// Object.defineProperty(window, "innerWidth", {
//   writable: true,
//   value: 1920,
// });

export { customRender as render };
