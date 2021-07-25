import styled, { keyframes } from "styled-components";

const AnimationLoading = keyframes`
  0% { opacity: 0; transform: scale(0); };
  50% { opacity: 1; };
  100% { opacity: 0; transform: scale(1.5); };
`;

export const Loading = styled.div`
  position: relative;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  background-color: ${({ theme }) => theme.colors.secondary};
  animation: ${AnimationLoading} 2s infinite;
  z-index: 1;

  &::after,
  &::before {
    content: "";
    position: absolute;
    border-radius: 50%;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &::after {
    animation: ${AnimationLoading} 2s infinite;
    animation-delay: 3.5s;
    background-color: ${({ theme }) => theme.colors.primary};
  }

  &::before {
    animation: ${AnimationLoading} 2s infinite;
    animation-delay: 1.5s;
    background-color: ${({ theme }) => theme.colors.white};
  }
`;
