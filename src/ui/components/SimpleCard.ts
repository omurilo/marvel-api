import NextImage from "next/image";
import styled from "styled-components";

const Image = styled(NextImage)``;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 10.5rem;
  height: 20rem;

  &:hover {
    ${Image} {
      transform: scale(1.1);
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
