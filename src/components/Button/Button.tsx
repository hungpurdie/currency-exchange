import styled, { css } from 'styled-components';

const ButtonStyled = styled.button<ButtonProps>`
  width: 100%;
  padding: 8px 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  & span {
    font-size: 16px;
    font-weight: 500;
  }

  & + button {
    margin-left: 20px;
  }

  ${({ disabled, active, variant }) => {
    if (disabled) {
      return css`
        background-color: #9ca2ae;
        color: #fff;
        cursor: not-allowed;
      `;
    } else if (active) {
      return css`
        background-color: rgb(99, 102, 241);
        color: rgb(99, 102, 241);
        color: #fff;
      `;
    } else if (variant === 'primary') {
      return css`
        background-color: rgb(16, 185, 129);
        color: #fff;
      `;
    } else if (variant === 'secondary') {
      return css`
        color: rgb(99, 102, 241);
        border: 1px solid rgba(156, 163, 175);
        background-color: #fff;
      `;
    }
  }}
`;

interface ButtonProps {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  outline?: boolean;
  variant?: 'primary' | 'secondary';
  style?: React.CSSProperties;
}

export default function Button({
  children,
  active,
  variant,
  onClick,
  disabled,
  ...restProps
}: ButtonProps) {
  return (
    <ButtonStyled
      {...restProps}
      disabled={disabled}
      active={active}
      variant={variant ?? 'secondary'}
      onClick={(e) => onClick && onClick(e)}
    >
      {children}
    </ButtonStyled>
  );
}
