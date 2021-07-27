import Image from "next/image";
import { memo } from "react";
import styled, { css } from "styled-components";

const CardContainer = styled.article`
  ${({ theme }) => css`
    background-color: ${theme.colors.black};
    border-radius: 0.25rem;
    color: ${theme.colors.black};
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 1;
    width: 15rem;
    height: 27rem;
    max-height: 28rem;
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
      height: 15rem;
      padding: 0;
      margin: 0;
    }

    @media screen and (max-width: 600px) {
      flex-direction: row;
      width: calc(100vw - 3rem);
      height: auto;

      & > figure {
        flex: 1;
        min-width: 40%;
      }

      ${CardHeader} {
        flex: 2;
      }
    }
  `}
`;

const CardImage = styled(Image)`
  transition: transform 0.3s ease;
  object-position: top;
`;

const CardHeader = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 0.625rem;
  background-color: ${({ theme }) => theme.colors.white};
`;

const CardHeaderLink = styled.a`
  position: relative;
  width: fit-content;
  margin: 0.1rem 0;
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
  overflow: hidden;
  padding: 0 0.15rem 0 0;
  cursor: pointer;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    border-bottom: 2px solid ${({ theme }) => theme.colors.secondary};
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
`;

const CardTitle = styled.h2`
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
`;

const CardDescription = styled.div`
  margin-bottom: 1rem;

  & > div {
    position: relative;
    display: block;
    overflow: hidden;
    width: fit-content;
    font-size: 0.85rem;
    margin-top: 0.25rem;

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      border-bottom: 2px solid ${({ theme }) => theme.colors.secondary};
      transform: translateX(-101%);
      transition: all 0.3s ease, border-color 0.3s 0.105s;
    }

    &:hover {
      &::after {
        transform: translateX(0);
      }
    }
  }
`;

type CardElementProps = {
  children: JSX.Element;
  onClick?: () => void;
  alt?: string;
  title?: string;
};

const CardElement = memo(({ children, ...props }: CardElementProps) => {
  return <CardContainer {...props}>{children}</CardContainer>;
});

CardElement.displayName = "Card";

const Card = {
  Description: CardDescription,
  Image: CardImage,
  Header: CardHeader,
  Link: CardHeaderLink,
  Title: CardTitle,
};

export { CardElement as default, Card };
