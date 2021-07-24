import styled, { css } from "styled-components";

type NavProps = {
  open: boolean;
};

export const Nav = styled.nav<NavProps>`
  ${({ theme, open }) => css`
    background-color: ${theme.colors.primary};
    color: ${theme.colors.white};
    border-top: 1px solid ${theme.colors.darkGrey};
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.5s ease-in-out, height 0.5s 1s ease;

    @media screen and (max-width: 600px) {
      position: absolute;
      width: 100%;
      flex-direction: column;
      gap: 0.25rem;
      height: auto;
      padding: ${open ? "1rem" : 0};
      transform: ${open ? "translateY(0)" : "translateY(-100%)"};
      overflow: hidden;
      z-index: 10;
    }
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

    @media screen and (max-width: 600px) {
      width: 100%;
      padding: 0.75rem;

      &:hover {
        background-color: ${theme.colors.secondary};
      }

      & > span {
        text-align: center;
        border: none;
      }
    }
  `}
`;
