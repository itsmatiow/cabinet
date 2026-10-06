import React, { createContext, useContext, useState } from "react";
import {
  useFloating,
  useDismiss,
  useInteractions,
  useClick,
  offset,
  flip,
  shift,
  autoUpdate,
} from "@floating-ui/react";
import { createPortal } from "react-dom";
import { HiEllipsisVertical } from "react-icons/hi2";
import styled from "styled-components";

const StyledMenu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

const StyledList = styled.ul`
  position: fixed;
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

const MenusContext = createContext();
const MenuContext = createContext();

export default function Menus({ children }) {
  const [openId, setOpenId] = useState("");

  const open = setOpenId;
  const close = () => setOpenId("");

  return (
    <MenusContext.Provider value={{ openId, open, close }}>
      {children}
    </MenusContext.Provider>
  );
}

function Menu({ children, id }) {
  const { openId, close, open } = useContext(MenusContext);
  const isOpen = openId === id;

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: (nextOpen) => {
      if (nextOpen) open(id);
      else close();
    },
    placement: "bottom-end",
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  return (
    <MenuContext.Provider
      value={{ refs, getReferenceProps, floatingStyles, getFloatingProps }}
    >
      <StyledMenu>{children}</StyledMenu>
    </MenuContext.Provider>
  );
}

function Toggle() {
  const { refs, getReferenceProps } = useContext(MenuContext);

  return (
    <StyledToggle ref={refs.setReference} {...getReferenceProps()}>
      <HiEllipsisVertical />
    </StyledToggle>
  );
}

function List({ id, children }) {
  const { openId } = useContext(MenusContext);
  const { refs, floatingStyles, getFloatingProps } = useContext(MenuContext);

  if (openId !== id) return null;

  return createPortal(
    <StyledList
      ref={refs.setFloating}
      {...getFloatingProps()}
      style={floatingStyles}
    >
      {children}
    </StyledList>,
    document.body,
  );
}

function Button({ children, icon, onClick }) {
  const { close } = useContext(MenusContext);
  function handleClick() {
    onClick?.();
    close();
  }
  return (
    <li>
      <StyledButton onClick={handleClick}>
        {icon}
        <span>{children}</span>
      </StyledButton>
    </li>
  );
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;
