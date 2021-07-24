import Image from "next/image";
import styled, { css } from "styled-components";

export const Card = styled.article`
  ${({ theme }) => css`
    background-color: ${theme.colors.white};
    border-radius: 0.25rem;
    color: ${theme.colors.black};
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 1;
    width: 14rem;
    height: 23rem;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.08),
      0 2px 10px 0 rgba(0, 0, 0, 0.05);
    cursor: pointer;
    overflow: hidden;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16),
        0 2px 10px 0 rgba(0, 0, 0, 0.12);

      ${CardImage} {
        transform: scale(1.1);
      }

      ${CardHeader} {
        & > h2 {
          color: ${theme.colors.secondary};
        }
      }
    }

    & > figure {
      position: relative;
      width: 100%;
      height: 220px;
      padding: 0;
      margin: 0;
    }
  `}
`;

export const CardImage = styled(Image)`
  transition: transform 0.3s ease;
`;

export const CardHeader = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    padding: 0.625rem;

    & > h2 {
      margin-bottom: 0.5rem;
      transition: all 0.3s ease;
    }

    & > a {
      position: relative;
      width: fit-content;
      margin: 0.1rem 0;
      font-size: 0.75rem;
      font-weight: bold;
      text-transform: uppercase;
      overflow: hidden;
      padding: 0 0.15rem 0 0;

      &::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        border-bottom: 2px solid ${theme.colors.secondary};
        transform: translateX(-101%);
        transition: all 0.3s ease;
      }

      &:hover {
        &::after {
          transform: translateX(0);
        }
      }

      & > var {
        font-weight: normal;
      }
    }
  `}
`;
