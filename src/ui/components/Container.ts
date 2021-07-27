import styled, { css, DefaultTheme } from "styled-components";

type ContainerProps = {
  $bgColor?: keyof DefaultTheme["colors"];
  $row?: boolean;
  $center?: boolean;
};

export const Container = styled.section<ContainerProps>`
  ${({ theme, $bgColor, $row, $center }) => css`
    display: flex;
    align-items: flex-start;
    justify-content: ${$center ? "center" : "flex-start"};
    flex-direction: ${$row ? "row" : "column"};
    flex-wrap: wrap;
    padding: 0.5rem 4rem;

    &:not(:first-of-type) {
      margin-top: 1rem;
    }

    background-color: ${$bgColor ? theme.colors[$bgColor!] : "transparent"}; };

    & > div {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 1rem;
      width: fit-content;
    }

    @media screen and (max-width: 900px) {
      padding: 0.5rem 2rem;
    }

    @media screen and (max-width: 600px) {
      padding: 0.5rem 1rem;
    }
  `};
`;
