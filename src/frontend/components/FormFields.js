import React from 'react';
import styled, { css } from 'styled-components';

export const BaseSingleLineTextInput = styled.input`
  width: 100%;
  padding: 8px;
  background-color: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.blue};

  font-family: ${({ theme }) => theme.fonts.mainFamily};
  font-weight: normal;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.black};

  &:focus {
    border: 2px solid ${({ theme }) => theme.colors.red};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.grey};
  }
`;

export const FormFieldColumn = styled.div`
  width: 100%;
  margin-bottom: 16px;

  ${({ isHalfWidth }) => isHalfWidth && css`
    @media ${({ theme }) => theme.media.tablet} {
      width: calc(50% - 8px);
    }
  `}
`;

export const LabelRow = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 4px;

  @media ${({ theme }) => theme.media.mobileLarge} {
    flex-direction: row;
  }
`;

export const Label = styled.label`
  display: block;
  width: fit-content;
  margin-bottom: 0;

  font-family: ${({ theme }) => theme.fonts.mainFamily};
  font-size: 12px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.black};
`;

export const HelpText = styled(Label)`
  font-weight: normal;

  ${({ theme, isValidation }) => isValidation && css`
    color: ${({ theme }) => theme.colors.red};
    margin-top: 4px;

    @media ${({ theme }) => theme.media.mobileLarge} {
      margin-top: 0;
      margin-left: 8px;
    }
  `}
`;

export const SINGLE_LINE_TEXT_INPUT = 'SINGLE_LINE_TEXT_INPUT';

export function SingleLineTextInput(props) {
  const {
    formId,
    fieldId,
    label,
    help,
    validationMessage,
    isHalfWidth,
    hasTouchedSubmit,
    ...rest
  } = props;

  const joinedId = `${formId}-${fieldId}`;

  const [hasTouchedField, setHasTouchedField] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  function onFocus(event) {
    setIsFocused(true);

    if (!hasTouchedField) {
      setHasTouchedField(true);
    }

    if (rest.onFocus) {
      rest.onFocus(event);
    }
  }

  function onBlur(event) {
    setIsFocused(false);

    if (rest.onBlur) {
      rest.onBlur(event);
    }
  }

  const isValidationMessageDisplayed = !!validationMessage
    && (hasTouchedSubmit || (hasTouchedField && !isFocused));

  return (
    <FormFieldColumn isHalfWidth={isHalfWidth}>
      <LabelRow>
        <Label htmlFor={joinedId}>{label}</Label>
        {isValidationMessageDisplayed && (
          <HelpText as="p" isValidation>{validationMessage}</HelpText>
        )}
      </LabelRow>
      {help && <HelpText as="p">{help}</HelpText>}
      <BaseSingleLineTextInput
        {...rest}
        id={joinedId}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </FormFieldColumn>
  );
}
