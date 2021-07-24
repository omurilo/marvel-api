import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
html,
body {
  padding: 0;
  margin: 0;
  font-family: 'Roboto Condensed', -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    background-color: ${({ theme }) => theme.colors.darkGrey};
}

h1, h2, h3, h4, h5, h6, p, blockquote, ul, ol, li, dl, dt, dd {
  margin: 0;
  padding: 0;
}

a {
  color: inherit;
  text-decoration: none;
}

* {
  box-sizing: border-box;
}

`;

export default GlobalStyle;
