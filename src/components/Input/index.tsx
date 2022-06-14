import {
  useEffect,
  useRef,
  useState,
  useCallback,
  ReactNode,
  InputHTMLAttributes,
} from 'react';

import { useField } from '@unform/core';

import { Container } from './styles';

type InputPropsType = {
  name: string,
  icon?: ReactNode
} & InputHTMLAttributes<HTMLInputElement>

const Input = ({ name, icon, ...rest }: InputPropsType) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isFilled, setIsFilled] = useState<boolean>(false);

  const { fieldName, defaultValue, registerField } = useField(name);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    setIsFilled(!!inputRef.current?.value);
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <Container isFilled={isFilled} isFocused={isFocused}>
      {icon && icon}

      <input
        {...rest}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        defaultValue={defaultValue}
        ref={inputRef}
      />
    </Container>
  );
};

export default Input;
