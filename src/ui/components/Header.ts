import styled, { css } from "styled-components";

export const Header = styled.header`
  ${({ theme }) => css`
    background-color: ${theme.colors.primary};
    color: ${theme.colors.white};
    display: flex;
    align-items: center;
    justify-content: center;
    height: 3.25rem;
  `}
`;
