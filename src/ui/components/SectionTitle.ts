import styled, { css } from "styled-components";

export const SectionTitle = styled.h1`
  ${({ theme }) => css`
    font-size: 2rem;
    color: ${theme.colors.white};
    position: relative;
    margin-bottom: 2rem;

    &::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      margin-bottom: -5px;
      border-bottom: 4px solid ${theme.colors.secondary};
      width: 120%;
      transform: translateX(20%);
    }
  `}
`;
