import React from 'react';
import styled from 'styled-components';
import marked from 'marked';
import ShareWidget, { LIGHT_THEME } from './ShareWidget';
import { WhiteBlueButton } from './Buttons';
import { DefaultTitle } from './Typography';

const ModalBackground = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: ${({ theme }) => theme.zIndexes.modal};
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
  max-height: 100vh;
  overflow-y: scroll;
  background-color: ${({ theme }) => theme.colors.blue};
  padding: 24px;

  ${WhiteBlueButton} {
    margin-left: auto;
    margin-right: auto;
    margin-top: 24px;
  }
`;

const ModalTitle = styled(DefaultTitle)`
  color: ${({ theme }) => theme.colors.white};
`;

const ModalCopyContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;

  h3 {
    font-family: ${({ theme }) => theme.fonts.mainFamily};
    font-weight: bold;
    font-size: 22px;
    color: ${({ theme }) => theme.colors.white};
    margin-bottom: 4px;
  }

  p, ul > li, a {
    font-family: ${({ theme }) => theme.fonts.mainFamily};
    font-weight: normal;
    font-size: 18px;
    color: ${({ theme }) => theme.colors.white};
  }

  p {
    margin-bottom: 24px;
  }

  ul {
    margin-top: 0;
    margin-bottom: 24px;
  }

  a {
    cursor: pointer;

    &:hover {
      color: ${({ theme }) => theme.colors.red};
    }
  }
`;

export default function Modal(props) {
  const {
    onClose,
    modalTitle,
    modalCopy,
    modalCloseLabel,
    customShareText,
  } = props;

  const containerRef = React.useRef(null);

  React.useEffect(() => {
    function onMouseDown(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', onMouseDown);

    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [onClose, containerRef.current]);

  return (
    <ModalBackground>
      <ModalContainer ref={containerRef}>
        <ModalTitle as="h2">
          {modalTitle}
        </ModalTitle>
        <ModalCopyContainer dangerouslySetInnerHTML={{ __html: marked(modalCopy || '') }} />
        <ShareWidget theme={LIGHT_THEME} customShareText={customShareText} />
        <WhiteBlueButton onClick={onClose}>{modalCloseLabel}</WhiteBlueButton>
      </ModalContainer>
    </ModalBackground>
  );
}
