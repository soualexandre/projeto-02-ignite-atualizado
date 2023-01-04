import { ButtonContainer, ButtonVariant } from './Button.styled'

interface ButtonProps {
  variant?: ButtonVariant
}

export function Button({ variant = 'primary' }: ButtonProps) {
  return <ButtonContainer variant={variant}>button</ButtonContainer>
}
