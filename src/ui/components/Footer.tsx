import styled, { css } from "styled-components";

const FooterContainer = styled.footer`
  ${({ theme }) => css`
    background-color: ${theme.colors.primary};
    color: ${theme.colors.white};
    padding: 1rem;
    text-align: center;
    font-size: 0.875rem;
    border-top: 2px solid ${theme.colors.secondary};
    margin-top: 1rem;

    & > a:hover {
      color: ${theme.colors.secondary};
    }
  `}
`;

const Footer = () => (
  <FooterContainer>
    <a href="https://marvel.com">Data provided by Marvel. © 2021 MARVEL</a> -
    Made from 🏡 by <a href="https://omurilo.dev">oMurilo</a>
  </FooterContainer>
);

export default Footer;
