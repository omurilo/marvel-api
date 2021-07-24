import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styled, { css, keyframes } from "styled-components";

import { Nav, NavLink } from "ui/components/Nav";

import Logo from "../../../public/marvel.svg";

const HamburgerBeforeAnimation = keyframes`
  0% { transform: rotate(0deg) };
  25% { transform: translateY(0.25rem) };
  50% { transform: rotate(360deg) };
`;

const HamburgerAfterAnimation = keyframes`
  0% { transform: rotate(0deg) };
  25% { transform: translateY(-0.25rem) };
  50% { transform: rotate(-360deg) };
`;

const HeaderContainer = styled.header`
  ${({ theme }) => css`
    position: relative;
    background-color: ${theme.colors.primary};
    color: ${theme.colors.white};
    display: flex;
    align-items: center;
    justify-content: center;
    height: 3.25rem;
    z-index: 100;

    @media screen and (max-width: 600px) {
      & img {
        width: 80%;
      }
    }
  `}
`;

type HamburgerMenuProps = {
  open: boolean;
};

const HamburgerMenu = styled.span<HamburgerMenuProps>`
  position: absolute;
  top: 20%;
  right: 0.5rem;
  display: none;
  align-items: center;
  place-self: flex-end;
  height: 2rem;
  width: 2rem;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.3s;

  &:focus {
    outline: none;
  }

  & > hr {
    border: 0.125rem solid ${({ theme }) => theme.colors.secondary};
    top: -0.25rem;
    width: 2rem;
    margin: 0;
    padding: 0;
    transition: all 0.3s ease;
  }

  &::after,
  &::before {
    content: "";
    display: block;
    position: absolute;
    width: 2rem;
    height: 0.25rem;
    background: ${({ theme }) => theme.colors.secondary};
    z-index: 1;
    transition: all 0.5s ease;
  }

  &::after {
    top: 1.5rem;
  }

  &::before {
    top: 0.25rem;
  }

  ${({ open }) =>
    open &&
    css`
      hr {
        opacity: 0;
        transform: translateX(-50%);
      }

      &::after,
      &::before {
        animation-duration: 1s;
      }

      &::before {
        animation-name: ${HamburgerBeforeAnimation};
        transform: rotate(135deg);
        top: 0.8rem;
      }

      &::after {
        animation-name: ${HamburgerAfterAnimation};
        transform: rotate(-135deg);
        top: 0.8rem;
      }
    `}

  @media screen and (max-width: 600px) {
    display: flex;
  }
`;

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenMenu = () => {
    setIsOpen((past) => !past);
  };

  return (
    <>
      <HeaderContainer>
        <Link href="/" passHref>
          <a>
            <Image
              src={Logo}
              height="52"
              width="130"
              alt="Logo Marvel"
              quality={80}
            />
          </a>
        </Link>
        <HamburgerMenu onClick={handleOpenMenu} open={isOpen}>
          <hr />
        </HamburgerMenu>
      </HeaderContainer>
      <Nav open={isOpen}>
        <Link href="/characters" passHref>
          <NavLink className="nav-link">
            <span>Personagens</span>
          </NavLink>
        </Link>
        <Link href="/comics" passHref>
          <NavLink className="nav-link">
            <span>Quadrinhos</span>
          </NavLink>
        </Link>
        <Link href="/creators" passHref>
          <NavLink className="nav-link">
            <span>Criadores</span>
          </NavLink>
        </Link>
        <Link href="/events" passHref>
          <NavLink className="nav-link">
            <span>Eventos</span>
          </NavLink>
        </Link>
      </Nav>
    </>
  );
};

export default Header;
