import styled, { css } from "styled-components";

export const Nav = styled.nav`
  ${({ theme }) => css`
    background-color: ${theme.colors.primary};
    color: ${theme.colors.white};
    border-top: 1px solid ${theme.colors.darkGrey};
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  `}
`;

export const NavLink = styled.a`
  ${({ theme }) => css`
    height: 100%;
    font-size: 0.75rem;
    font-weight: 800;
    cursor: pointer;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 0 1.125rem;

    & > span {
      display: flex;
      align-items: center;
      height: 100%;
      border-bottom: 2px solid transparent;

      &:hover {
        border-color: ${theme.colors.secondary};
      }
    }
  `})}
`;
