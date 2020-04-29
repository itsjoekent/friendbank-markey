import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { DefaultTitle, DefaultParagraph } from './Typography';
import { RedButton } from './Buttons';
import {
  SingleLineTextInput,
  SINGLE_LINE_TEXT_INPUT,
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

const FormContainer = styled.div`
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
  flex-direction: column;
  margin-bottom: 24px;

  @media ${({ theme }) => theme.media.tablet} {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }
`;

const FormSubmitButton = styled(RedButton)`
  margin-top: 24px;
`;

export default function Form(props) {
  const { formId, steps, onCompletion } = props;

  const [formValues, setFormValues] = React.useState({});
  const [formError, setFormError] = React.useState(null);

  const [activeStep, setActiveStep] = React.useState(0);
  const [targetStep, setTargetStep] = React.useState(0);

  const [hasTouchedSubmit, setHasTouchedSubmit] = React.useState(false);

  const isFading = activeStep !== targetStep;

  React.useEffect(() => {
    if (targetStep === activeStep) {
      return () => {};
    }

    const timeoutId = setTimeout(() => {
      setActiveStep(targetStep);
    }, FADE_OUT_TIME);

    return () => clearTimeout(timeoutId);
  }, [isFading, setActiveStep, targetStep]);

  React.useEffect(() => {
    if (activeStep >= steps.length && !!onCompletion) {
      onCompletion();
    }
  }, [steps, onCompletion, activeStep]);

  function onSubmit(event) {
    event.preventDefault();

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
      onStepSubmit(formValues, setFormError)
        .then(() => setTargetStep(activeStep + 1))
        .catch((error) => {
          console.error(error);
          setFormError('Whoops, looks like we had an error. Try again?');
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
  } = activeStepData;

  return (
    <FormContainer isFading={isFading}>
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
            isHalfWidth = false,
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
            case [SINGLE_LINE_TEXT_INPUT]:
            default: {
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
        <FormSubmitButton type="submit">{buttonCopy}</FormSubmitButton>
      </FormFieldsContainer>
    </FormContainer>
  );
}
