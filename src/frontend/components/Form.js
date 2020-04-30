import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import copy from '../../copy';
import { DefaultTitle, DefaultParagraph } from './Typography';
import { RedButton } from './Buttons';
import {
  SingleLineTextInput,
  SINGLE_LINE_TEXT_INPUT,
  CodeInputField,
  CODE_INPUT_FIELD,
  RadioField,
  RADIO_FIELD,
  MultiLineTextInput,
  MULTI_LINE_TEXT_INPUT,
  GalleryPickerField,
  GALLERY_PICKER,
  HelpText,
} from './FormFields';

const FADE_IN_TIME = 1000;
const FADE_OUT_TIME = 1000;

const fadeInKeyframes = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const fadeOutKeyframes = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
`;

const spinnerKeyframes = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const FormContainer = styled.div`
  position: relative;
  opacity: 0;
  animation: ${FADE_IN_TIME}ms forwards ${fadeInKeyframes};

  ${({ isFading }) => isFading && css`
    opacity: 1;
    animation: ${FADE_OUT_TIME}ms forwards ${fadeOutKeyframes};
  `}
`;

const FormTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
`;

const FormFieldsContainer = styled.form`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const FormDisclaimer = styled(DefaultParagraph)`
  margin-top: 24px;
  font-size: 12px;
`;

const FormSubmitButton = styled(RedButton)`
  margin-top: 24px;
  position: relative;
  transition: padding-left 0.5s;

  &:disabled {
    cursor: not-allowed;
    padding-left: 32px;

    &:before {
      content: '';
      position: absolute;
      top: 50%;
      left: 15px;
      width: 20px;
      height: 20px;
      margin-top: -10px;
      margin-left: -10px;
      border-radius: 50%;
      border: 2px solid ${({ theme }) => theme.colors.white};
      border-top-color: ${({ theme }) => theme.colors.red};
      animation: ${spinnerKeyframes} .6s linear infinite;
    }
  }
`;

const FormError = styled(HelpText)`
  color: ${({ theme }) => theme.colors.red};
  margin-top: 12px;
`;

export default function Form(props) {
  const {
    formId,
    steps,
    onCompletion,
    onFormValueChange,
  } = props;

  const scrollHelperRef = React.useRef(null);

  const [formValues, setFormValues] = React.useState({});
  const [formError, setFormError] = React.useState(null);

  const [activeStep, setActiveStep] = React.useState(0);
  const [targetStep, setTargetStep] = React.useState(0);

  const [isProcessingSubmit, setIsProcessingSubmit] = React.useState(false);

  const [hasTouchedSubmit, setHasTouchedSubmit] = React.useState(false);

  const isFading = activeStep !== targetStep;

  React.useEffect(() => {
    if (targetStep === activeStep) {
      return () => {};
    }

    const timeoutId = setTimeout(() => {
      setActiveStep(targetStep);
      setHasTouchedSubmit(false);

      if (scrollHelperRef.current) {
        scrollHelperRef.current.scrollIntoView();
      }
    }, FADE_OUT_TIME);

    return () => clearTimeout(timeoutId);
  }, [isFading, setActiveStep, targetStep, scrollHelperRef.current]);

  React.useEffect(() => {
    if (activeStep >= steps.length && !!onCompletion) {
      onCompletion(formValues);
    }
  }, [steps, onCompletion, activeStep]);

  React.useEffect(() => {
    if (onFormValueChange) {
      onFormValueChange(formValues, setFormValues);
    }
  }, [onFormValueChange, formValues]);

  function onSubmit(event) {
    event.preventDefault();

    if (formError) {
      setFormError(null);
    }

    if (!hasTouchedSubmit) {
      setHasTouchedSubmit(true);
    }

    const step = steps[activeStep];

    if (!step) {
      return;
    }

    const { onStepSubmit, fields } = step;

    const hasInvalidFields = !!fields.find(({ fieldId, validator }) => {
      if (!validator) {
        return false;
      }

      return !!validator(formValues[fieldId]);
    });

    if (hasInvalidFields) {
      return;
    }

    if (onStepSubmit) {
      setIsProcessingSubmit(true);

      onStepSubmit(formValues).then((newFormError) => {
        setIsProcessingSubmit(false);

        if (newFormError) {
          setFormError(newFormError);
        } else {
          setTargetStep(activeStep + 1);
        }
      })
      .catch((error) => {
        console.error(error);
        setFormError(copy.genericError);
      });
    } else {
      setTargetStep(activeStep + 1);
    }
  }

  const activeStepData = steps[activeStep];

  if (!activeStepData) {
    return null;
  }

  const {
    title,
    subtitle,
    buttonCopy,
    fields,
    showSmsDisclaimer,
  } = activeStepData;

  return (
    <FormContainer isFading={isFading} ref={scrollHelperRef}>
      <FormTitleContainer>
        {title && <DefaultTitle>{title}</DefaultTitle>}
        {subtitle && <DefaultParagraph>{subtitle}</DefaultParagraph>}
      </FormTitleContainer>
      <FormFieldsContainer onSubmit={onSubmit}>
        {fields && fields.map((field) => {
          const {
            fieldId,
            fieldType,
            label = null,
            help = null,
            validator = () => false,
          } = field;

          const value = formValues[fieldId];
          const validationMessage = validator(value);

          function onTextInputChange(event) {
            const update = event.target.value;

            setFormValues((copy) => ({
              ...copy,
              [fieldId]: update,
            }));
          }

          switch (fieldType) {
            case CODE_INPUT_FIELD: {
              return (
                <CodeInputField
                  key={fieldId}
                  formId={formId}
                  fieldId={fieldId}
                  label={label}
                  help={help}
                  validationMessage={validationMessage}
                  hasTouchedSubmit={hasTouchedSubmit}
                  setFormValues={setFormValues}
                  suggestedValue={value || ""}
                />
              );
            }

            case GALLERY_PICKER: {
              const { options } = field;

              return (
                <GalleryPickerField
                  key={fieldId}
                  formId={formId}
                  fieldId={fieldId}
                  label={label}
                  help={help}
                  validationMessage={validationMessage}
                  hasTouchedSubmit={hasTouchedSubmit}
                  setFormValues={setFormValues}
                  value={value || ""}
                  options={options || []}
                />
              );
            }

            case MULTI_LINE_TEXT_INPUT: {
              return (
                <MultiLineTextInput
                  key={fieldId}
                  formId={formId}
                  fieldId={fieldId}
                  label={label}
                  help={help}
                  validationMessage={validationMessage}
                  hasTouchedSubmit={hasTouchedSubmit}
                  onChange={onTextInputChange}
                  value={value || ""}
                />
              );
            }

            case RADIO_FIELD: {
              const { options } = field;

              return (
                <RadioField
                  key={fieldId}
                  formId={formId}
                  fieldId={fieldId}
                  label={label}
                  help={help}
                  validationMessage={validationMessage}
                  hasTouchedSubmit={hasTouchedSubmit}
                  setFormValues={setFormValues}
                  value={value || ""}
                  options={options || []}
                />
              );
            }

            case SINGLE_LINE_TEXT_INPUT:
            default: {
              const { isHalfWidth = false } = field;

              return (
                <SingleLineTextInput
                  key={fieldId}
                  formId={formId}
                  fieldId={fieldId}
                  isHalfWidth={isHalfWidth}
                  label={label}
                  help={help}
                  validationMessage={validationMessage}
                  hasTouchedSubmit={hasTouchedSubmit}
                  onChange={onTextInputChange}
                  value={value || ""}
                />
              );
            }
          }
        })}
        <div>
          <FormSubmitButton
            type="submit"
            disabled={isProcessingSubmit}
          >{buttonCopy}</FormSubmitButton>
          {formError && (<FormError>{formError}</FormError>)}
          {showSmsDisclaimer && (
            <FormDisclaimer>
              {copy.smsDisclaimer}
            </FormDisclaimer>
          )}
        </div>
      </FormFieldsContainer>
    </FormContainer>
  );
}
