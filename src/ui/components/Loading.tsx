import styled, { css, DefaultTheme, keyframes } from "styled-components";

type Theme = {
  theme: DefaultTheme;
};

const boxShadow = ({ theme }: Theme) => css`
  box-shadow: inset 0 0 0 3px ${theme.colors.secondary};
`;

const animationA = keyframes`
  0% { transform: rotate(-1turn); };
  100% { transform: rotate(1turn); };
`;

const animationAB2 = ({ theme }: Theme) => keyframes`
  0% {
    ${boxShadow({ theme })}
    transform: rotate(180deg);
  }
  40% {
    ${boxShadow({ theme })}
    transform: rotate(70deg);
  }
  60% {
    ${boxShadow({ theme })}
    transform: rotate(70deg);
  }
  100% {
    ${boxShadow({ theme })}
    transform: rotate(180deg);
  }
`;

const animationB = keyframes`
  0% {
    transform: rotate(-180deg);
  }
  100% {
    transform: rotate(540deg);
  }
`;

const LoaderA = styled.div`
  animation: ${animationA} 1.5s ease infinite;
`;

const LoaderB = styled.div`
  animation: ${animationB} 1.5s ease infinite;

  &::after {
    transform: scaleY(-1);
  }
`;

const Loader = styled.div`
  position: relative;
  margin: 1rem auto;
  height: 2.75rem;
  width: 2.75rem;
  text-align: center;

  ${LoaderA}, ${LoaderB} {
    transform-origin: 2.75rem;
    left: calc(50% - 2.75rem);
    top: calc(50% - (2.75rem / 2));

    &,
    &::after {
      position: absolute;
      clip: rect(0, 2.75rem, 2.75rem, calc(2.75rem / 2));
      height: 2.75rem;
      width: 2.75rem;
    }

    &::after {
      border-radius: 50%;
      content: "";
      animation: ${animationAB2} 1.5s ease-in-out infinite;
    }
  }
`;

export const Loading = () => (
  <Loader>
    <LoaderA />
    <LoaderB />
  </Loader>
);
