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

  &::placeholder {
    color: ${({ theme }) => theme.colors.grey};
  }
`;

export const FormFieldColumn = styled.div`
  width: 100%;
  margin-bottom: 16px;

  ${({ isHalfWidth }) => isHalfWidth && css`
    width: calc(50% - 8px);
  `}
`;

export const LabelRow = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 4px;
`;

export const Label = styled.label`
  display: block;
  width: fit-content;
  font-family: ${({ theme }) => theme.fonts.mainFamily};
  font-size: 12px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.black};
`;

export const HelpText = styled(Label)`
  font-weight: normal;

  ${({ isValidation }) => !isValidation && css`
    margin-bottom: 4px;
  `}

  ${({ theme, isValidation }) => isValidation && css`
    color: ${({ theme }) => theme.colors.red};
    margin-left: 4px;
  `}
`;

export function useValidationController(hasTouchedSubmit, validationMessage, rest) {
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

  return { onFocus, onBlur, isValidationMessageDisplayed };
}

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

  const { onFocus, onBlur, isValidationMessageDisplayed } = useValidationController(hasTouchedSubmit, validationMessage, rest);

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

export const MULTI_LINE_TEXT_INPUT = 'MULTI_LINE_TEXT_INPUT';

export const BaseMultiLineTextInput = styled.textarea`
  width: 100%;
  padding: 8px;
  background-color: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.blue};

  font-family: ${({ theme }) => theme.fonts.mainFamily};
  font-weight: normal;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.black};

  &::placeholder {
    color: ${({ theme }) => theme.colors.grey};
  }
`;

export function MultiLineTextInput(props) {
  const {
    formId,
    fieldId,
    label,
    help,
    validationMessage,
    hasTouchedSubmit,
    ...rest
  } = props;

  const joinedId = `${formId}-${fieldId}`;

  const { onFocus, onBlur, isValidationMessageDisplayed } = useValidationController(hasTouchedSubmit, validationMessage, rest);

  return (
    <FormFieldColumn>
      <LabelRow>
        <Label htmlFor={joinedId}>{label}</Label>
        {isValidationMessageDisplayed && (
          <HelpText as="p" isValidation>{validationMessage}</HelpText>
        )}
      </LabelRow>
      {help && <HelpText as="p">{help}</HelpText>}
      <BaseMultiLineTextInput
        {...rest}
        id={joinedId}
        onFocus={onFocus}
        onBlur={onBlur}
        rows={4}
      />
    </FormFieldColumn>
  );
}

export const RADIO_FIELD = 'RADIO_FIELD';

export const RadioElementList = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 12px;
`;

export const RadioElementRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  padding-top: 4px;
  padding-bottom: 4px;
  margin-bottom: 6px;
`;

export const RadioElementQuestion = styled(Label)`
  font-size: 16px;
`;

export const RadioElementToggle = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.blue};
  cursor: pointer;
  position: relative;

  ${({ isChecked }) => isChecked && css`
    border: 2px solid ${({ theme }) => theme.colors.blue};

    &:before {
      content: '';
      display: block;
      position: absolute;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: ${({ theme }) => theme.colors.blue};
    }
  `}

  ${({ isFocused }) => isFocused && css`
    &:after {
      content: '';
      display: block;
      position: absolute;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      opacity: 0.25;
      background: ${({ theme }) => theme.colors.blue};
    }
  `}
`;

export const RadioElementLabel = styled(Label)`
  font-size: 18px;
  font-weight: normal;
  margin-left: 8px;
  cursor: pointer;
`;

export const RealRadioInput = styled(BaseSingleLineTextInput)`
  opacity: 0;
  position: absolute;
  left: -100000px;
`;

export function RadioField(props) {
  const {
    formId,
    fieldId,
    label,
    help,
    validationMessage,
    hasTouchedSubmit,
    options,
    value,
    setFormValues,
  } = props;

  const joinedId = `${formId}-${fieldId}`;

  const [focusState, setFocusState] = React.useState({});

  function setOptionAsValue(option) {
    setFormValues((copy) => ({ ...copy, [fieldId]: option }));
  }

  return (
    <FormFieldColumn>
      <LabelRow>
        <RadioElementQuestion as="p">{label}</RadioElementQuestion>
        {hasTouchedSubmit && validationMessage && (
          <HelpText as="p" isValidation>{validationMessage}</HelpText>
        )}
      </LabelRow>
      {help && <HelpText as="p">{help}</HelpText>}
      <RadioElementList>
        {options.map((option) => (
          <RadioElementRow key={option}>
            <RealRadioInput
              id={`${joinedId}-${option}`}
              type="radio"
              checked={option === value}
              onChange={() => setOptionAsValue(option)}
              onFocus={() => setFocusState((copy) => ({ ...copy, [option]: true }))}
              onBlur={() => setFocusState((copy) => ({ ...copy, [option]: false }))}
            />
            <RadioElementToggle
              onClick={() => setOptionAsValue(option)}
              isChecked={option === value}
              isFocused={!!focusState[option]}
            />
            <RadioElementLabel
              htmlFor={`${joinedId}-${option}`}
              onClick={() => setOptionAsValue(option)}
            >
              {option}
            </RadioElementLabel>
          </RadioElementRow>
        ))}
      </RadioElementList>
    </FormFieldColumn>
  );
}

export const CODE_INPUT_FIELD = 'CODE_INPUT_FIELD';

const CodeInputFieldWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 2px;
  background: ${({ theme }) => theme.colors.blue};
  width: 100%;

  ${BaseSingleLineTextInput} {
    border: none;
    text-transform: uppercase;
  }
`;

const DomainLabel = styled.span`
  display: block;
  width: fit-content;
  font-family: ${({ theme }) => theme.fonts.mainFamily};
  font-size: 12px;
  font-weight: normal;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.white};
  padding-left: 4px;
  padding-right: 4px;
  margin-top: 1px;
`;

const CodeInputVerification = styled.span`
  display: block;
  width: 100%;
  margin-top: 4px;

  font-family: ${({ theme }) => theme.fonts.mainFamily};
  font-size: 12px;
  font-weight: normal;
  color: ${({ theme }) => theme.colors.grey};
  text-align: right;

  ${({ isVerificationOk }) => isVerificationOk && css`
    color: ${({ theme }) => theme.colors.green};
    font-weight: bold;
  `}

  ${({ isVerificationNotOk }) => isVerificationNotOk && css`
    color: ${({ theme }) => theme.colors.red};
    font-weight: bold;
  `}
`;

export function CodeInputField(props) {
  const {
    formId,
    fieldId,
    label,
    help,
    validationMessage,
    isHalfWidth,
    hasTouchedSubmit,
    suggestedValue,
    setFormValues,
    ...rest
  } = props;

  const joinedId = `${formId}-${fieldId}`;

  const { onFocus, onBlur, isValidationMessageDisplayed } = useValidationController(hasTouchedSubmit, validationMessage, rest);

  const [isCheckingCode, setIsCheckingCode] = React.useState(false);
  const [hasPrefilledCode, setHasPrefilledCode] = React.useState(false);
  const [value, setValue] = React.useState(suggestedValue || '');

  React.useEffect(() => {
    if (!value) {
      setIsCheckingCode(false);
      return;
    }

    setIsCheckingCode(true);

    const timeoutId = setTimeout(() => {
      fetch(`/api/v1/page/${value}`).then((res) => {
        setIsCheckingCode(false);

        if (res.status === 404) {
          setFormValues((copy) => ({ ...copy, [fieldId]: value }));
        } else {
          setFormValues((copy) => ({ ...copy, [fieldId]: '' }));
        }
      });
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [value, setIsCheckingCode, setFormValues]);

  React.useEffect(() => {
    if (!value.length && !hasPrefilledCode && (suggestedValue || '').length) {
      setHasPrefilledCode(true);
      setValue(suggestedValue);
      setFormValues((copy) => ({ ...copy, [fieldId]: '' }));
    }
  }, [value, hasPrefilledCode, suggestedValue]);

  function onChange(event) {
    if (suggestedValue.length) {
      setFormValues((copy) => ({ ...copy, [fieldId]: '' }));
    }

    setValue(event.target.value);
  }

  const isVerificationOk = !isCheckingCode && !!(suggestedValue || '').length;
  const isVerificationNotOk = !isCheckingCode && !(suggestedValue || '').length;

  return (
    <FormFieldColumn isHalfWidth={isHalfWidth}>
      <LabelRow>
        <Label htmlFor={joinedId}>{label}</Label>
        {isValidationMessageDisplayed && (
          <HelpText as="p" isValidation>{validationMessage}</HelpText>
        )}
      </LabelRow>
      {help && <HelpText as="p">{help}</HelpText>}
      <CodeInputFieldWrapper>
        <DomainLabel>
          support.edmarkey.com/
        </DomainLabel>
        <BaseSingleLineTextInput
          {...rest}
          id={joinedId}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={onChange}
          value={value}
        />
      </CodeInputFieldWrapper>
      {(isCheckingCode || !!value.length) && (
        <CodeInputVerification
          isVerificationOk={isVerificationOk}
          isVerificationNotOk={isVerificationNotOk}
        >
          {(() => {
            if (isVerificationOk) return 'This code is available';
            if (isVerificationNotOk) return 'This code is not available';
            return 'Checking if this code is available';
          })()}
        </CodeInputVerification>
      )}
    </FormFieldColumn>
  );
}

export const GALLERY_PICKER = 'GALLERY_PICKER';

export const GalleryItemList = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

export const GalleryItem = styled.div`
  width: 33.33%;
  margin-right: 16px;
  margin-bottom: 16px;
  height: 75px;

  @media ${({ theme }) => theme.media.tablet} {
    width: calc(25% - 16px);
  }
`;

export const GalleryItemLabel = styled.label`
  opacity: 0;
  position: absolute;
  left: -10000000px;
`;

export const GalleryItemMedia = styled.div`
  width: 100%;
  height: 100%;

  ${({ isChecked }) => isChecked && css`
    outline: 4px solid ${({ theme }) => theme.colors.blue};
  `}

  ${({ isFocused }) => isFocused && css`
    outline: 4px solid ${({ theme }) => theme.colors.red};
  `}
`;

export const GalleryItemImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

export function GalleryPickerField(props) {
  const {
    formId,
    fieldId,
    label,
    help,
    validationMessage,
    hasTouchedSubmit,
    options,
    value,
    setFormValues,
  } = props;

  const joinedId = `${formId}-${fieldId}`;

  const [focusState, setFocusState] = React.useState({});

  function setOptionAsValue(option) {
    setFormValues((copy) => ({ ...copy, [fieldId]: option.name }));
  }

  return (
    <FormFieldColumn>
      <LabelRow>
        <Label as="p">{label}</Label>
        {hasTouchedSubmit && validationMessage && (
          <HelpText as="p" isValidation>{validationMessage}</HelpText>
        )}
      </LabelRow>
      {help && <HelpText as="p">{help}</HelpText>}
      <GalleryItemList>
        {options.map((option) => (
          <GalleryItem key={option.name}>
            <RealRadioInput
              id={`${joinedId}-${option.name}`}
              type="radio"
              checked={option.name === value}
              onChange={() => setOptionAsValue(option)}
              onFocus={() => setFocusState((copy) => ({ ...copy, [option.name]: true }))}
              onBlur={() => setFocusState((copy) => ({ ...copy, [option.name]: false }))}
            />
            <GalleryItemMedia
              isChecked={option.name === value}
              isFocused={!!focusState[option.name]}
              onClick={() => setOptionAsValue(option)}
            >
              <GalleryItemImage
                src={option.src}
                alt={option.alt}
              />
            </GalleryItemMedia>
            <GalleryItemLabel htmlFor={`${joinedId}-${option.name}`}>
              {option.alt}
            </GalleryItemLabel>
          </GalleryItem>
        ))}
      </GalleryItemList>
    </FormFieldColumn>
  );
}
