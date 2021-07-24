import styled from "styled-components";

export const Container = styled.section`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  margin-top: 1rem;
  padding: 0.5rem 4rem;

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
`;
