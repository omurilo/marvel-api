import styled from "styled-components";
import NextImage from "next/image";

const Container = styled.article`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
  background-color: ${(props) => props.theme.colors.primary};
  flex: 1;
  flex-basis: calc(50% - 2rem);
  margin-top: 1rem;
  min-width: 32.5rem;
  height: 23rem;

  &:nth-of-type(odd) {
    margin-right: 0.5rem;
  }

  &:nth-of-type(even) {
    margin-left: 0.5rem;
  }

  @media screen and (max-width: 1200px) {
    flex-basis: 100%;

    &:nth-of-type(odd) {
      margin-right: 0;
    }

    &:nth-of-type(even) {
      margin-left: 0;
    }
  }

  @media screen and (max-width: 600px) {
    flex-direction: column;
    min-width: auto;
  }
`;

const Image = styled(NextImage)``;

const Text = styled.p`
  color: ${(props) => props.theme.colors.white};
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 0.5rem;
  padding: 1rem;

  & > ${Text} {
    flex: 1;
  }

  & > h2 {
    margin-bottom: 0.5rem;
  }

  & a {
    margin-top: 1rem;
  }
`;

const ComicCard = {
  Container,
  Image,
  Text,
  Info,
  // Price,
};

export default ComicCard;
