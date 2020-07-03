import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import usePrevious from '../hooks/usePrevious';

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const SpinnerStyles = createGlobalStyle`
  .sk-chase {
    width: 40px;
    height: 40px;
    position: relative;
    animation: sk-chase 2.5s infinite linear both;
  }

  .sk-chase-dot {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    animation: sk-chase-dot 2.0s infinite ease-in-out both;
  }

  .sk-chase-dot:before {
    content: '';
    display: block;
    width: 25%;
    height: 25%;
    background-color: ${({ theme }) => theme.colors.blue};
    border-radius: 100%;
    animation: sk-chase-dot-before 2.0s infinite ease-in-out both;
  }

  .sk-chase-dot:nth-child(1) { animation-delay: -1.1s; }
  .sk-chase-dot:nth-child(2) { animation-delay: -1.0s; }
  .sk-chase-dot:nth-child(3) { animation-delay: -0.9s; }
  .sk-chase-dot:nth-child(4) { animation-delay: -0.8s; }
  .sk-chase-dot:nth-child(5) { animation-delay: -0.7s; }
  .sk-chase-dot:nth-child(6) { animation-delay: -0.6s; }
  .sk-chase-dot:nth-child(1):before { animation-delay: -1.1s; }
  .sk-chase-dot:nth-child(2):before { animation-delay: -1.0s; }
  .sk-chase-dot:nth-child(3):before { animation-delay: -0.9s; }
  .sk-chase-dot:nth-child(4):before { animation-delay: -0.8s; }
  .sk-chase-dot:nth-child(5):before { animation-delay: -0.7s; }
  .sk-chase-dot:nth-child(6):before { animation-delay: -0.6s; }

  @keyframes sk-chase {
    100% { transform: rotate(360deg); }
  }

  @keyframes sk-chase-dot {
    80%, 100% { transform: rotate(360deg); }
  }

  @keyframes sk-chase-dot-before {
    50% {
      transform: scale(0.4);
    } 100%, 0% {
      transform: scale(1.0);
    }
  }
`;

export default function LoadingSpinner(props) {
  const {
    children,
    hasCompletedLoading,
    minSpinTime = 1,
  } = props;

  const [hasCompletedMinSpinTime, setHasCompletedMinSpinTime] = React.useState(false);
  const previousHasCompletedLoading = usePrevious(hasCompletedLoading);

  React.useEffect(() => {
    if (minSpinTime > 0 && !hasCompletedMinSpinTime) {
      const timeoutId = setTimeout(() => setHasCompletedMinSpinTime(true), minSpinTime * 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [
    minSpinTime,
    hasCompletedMinSpinTime,
    setHasCompletedMinSpinTime,
  ]);

  React.useEffect(() => {
    if (!hasCompletedLoading && previousHasCompletedLoading) {
      setHasCompletedMinSpinTime(false);
    }
  }, [
    hasCompletedLoading,
    previousHasCompletedLoading,
    setHasCompletedMinSpinTime,
  ]);

  if ((minSpinTime > 0 ? hasCompletedMinSpinTime : true) && hasCompletedLoading) {
    return children;
  }

  return (
    <SpinnerContainer>
      <SpinnerStyles />
      <div className="sk-chase">
        <div className="sk-chase-dot" />
        <div className="sk-chase-dot" />
        <div className="sk-chase-dot" />
        <div className="sk-chase-dot" />
        <div className="sk-chase-dot" />
        <div className="sk-chase-dot" />
      </div>
    </SpinnerContainer>
  );
}
