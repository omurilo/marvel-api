import styled, { css } from "styled-components";

const Container = styled.div`
  && {
    align-items: stretch;
    width: 100%;

    & > figure {
      height: 28rem;
      width: 18.75rem;
      position: relative;
    }

    @media screen and (max-width: 900px) {
      display: flex;
      flex: 1;

      & > figure {
        margin: 0;
        margin-right: 0.5rem;
        transform: scale(0.8);
      }
    }

    @media screen and (max-width: 600px) {
      flex-direction: column;
      align-items: center;
    }
  }
`;

const Title = styled.h1`
  font-size: 3.5rem;
  text-transform: uppercase;
  color: ${(props) => props.theme.colors.white};

  @media screen and (max-width: 900px) {
    font-size: 2.5rem;
  }
`;

const Description = styled.p`
  color: ${(props) => props.theme.colors.white};
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 2rem 0;
  width: calc(100% - 28rem);

  @media screen and (max-width: 900px) {
    width: calc(100% - 21rem);
  }

  @media screen and (max-width: 600px) {
    width: 100%;
    padding-top: 0;
  }
`;

const Link = styled.a`
  ${({ theme }) => css`
    color: ${theme.colors.white};
    margin-top: 2rem;
    text-transform: uppercase;
    font-weight: 800;
    font-size: 0.875rem;
    transition: none;
    text-align: center;
    display: inline-block;
    position: relative;

    &::after,
    &::before {
      content: "";
      display: block;
      background-color: ${theme.colors.secondary};
      border-color: ${theme.colors.secondary};
      transition: none;
      height: 1rem;
      border-style: solid;
      box-sizing: border-box;
    }

    &::after {
      bottom: 0;
      margin-right: 1rem;
      border-width: 1rem 1rem 0 0;
    }

    &::before {
      top: 0;
      margin-left: 1rem;
      border-width: 0 0 1rem 1rem;
    }

    & > span {
      display: block;
      text-align: center;
      padding: 0 2rem;
      background-color: ${theme.colors.secondary};

      &::after,
      &::before {
        border-color: ${theme.colors.secondary} transparent;
        transition: none;
        border-style: solid;
        border-width: 0 0 1rem 1rem;
        box-sizing: border-box;
        content: "";
        display: block;
        position: absolute;
      }

      &::before {
        top: 0;
        left: 0;
      }

      &::after {
        bottom: 0;
        right: 0;
        transform: rotate(180deg);
      }
    }
  `}
`;

const Banner = {
  Container,
  Title,
  Description,
  Info,
  Link,
};

export default Banner;
