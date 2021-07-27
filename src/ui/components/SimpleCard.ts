import NextImage from "next/image";
import styled from "styled-components";

type ContainerProps = {
  $fit?: boolean;
};

const Image = styled(NextImage)``;

const Container = styled.article<ContainerProps>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: fit-content;
  max-width: 10.5rem;
  max-height: ${(props) => (props.$fit ? "fit-content" : "22rem")};
  min-height: ${(props) => (props.$fit ? "fit-content" : "20rem")};

  &:hover {
    ${Image} {
      transform: scale(1.1);
    }
  }

  & > a {
    margin-top: 0;
  }

  @media screen and (max-width: 600px) {
    width: 10.5rem;

    & > a {
      margin-top: 1rem;
    }
  }
`;

const Title = styled.h3`
  margin-top: 0.5rem;
  color: ${(props) => props.theme.colors.white};
`;

const SimpleCard = {
  Container,
  Image,
  Title,
};

export default SimpleCard;
