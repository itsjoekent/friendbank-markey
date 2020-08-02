import React from 'react';
import styled, { css } from 'styled-components';
import StandardHelmet from '../components/StandardHelmet';
import AdminCopyEditor from '../components/AdminCopyEditor';
import AdminFixAccount from '../components/AdminFixAccount';
import makeLocaleLink from '../utils/makeLocaleLink';
import useRole from '../hooks/useRole';
import useAuthGate from '../hooks/useAuthGate';
import getCopy from '../utils/getCopy';
import { HOMEPAGE_ROUTE } from '../routes';
import { STAFF_ROLE } from '../../shared/roles';

const COPY_EDITOR = 'COPY_EDITOR';
const FIX_ACCOUNT = 'FIX_ACCOUNT';

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 48px;
  box-shadow: ${({ theme }) => theme.shadow};
  background: ${({ theme }) => theme.colors.white};
  padding: 24px;

  @media ${({ theme }) => theme.media.tablet} {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const AdminNav = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-bottom: 24px;
  margin-bottom: 24px;
  ${'' /* border-bottom: 2px solid ${({ theme }) => theme.colors.blue}; */}

  min-height: 100px;

  @media ${({ theme }) => theme.media.tablet} {
    min-width: 250px;
    max-width: 250px;
    padding-bottom: 0;
    margin-bottom: 0;
    padding-right: 24px;
    margin-right: 24px;
    ${'' /* border-right: 2px solid ${({ theme }) => theme.colors.blue}; */}
    border-bottom: none;
  }
`;

const NavItem = styled.button`
  display: block;
  width: fit-content;
  border: none;
  background: none;
  font-family: ${({ theme }) => theme.fonts.headerFamily};
  font-weight: bold;
  line-height: 1.1;
  font-size: 18px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.black};
  cursor: pointer;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.darkBlue};
    text-decoration: underline;
  }

  ${({ highlighted }) => highlighted && css`
    color: ${({ theme }) => theme.colors.blue};

    &:hover {
      color: ${({ theme }) => theme.colors.blue};
      text-decoration: none;
    }
  `}
`;

const AdminEditorContainer = styled.div`
  @media ${({ theme }) => theme.media.tablet} {
    flex-grow: 1;
  }
`;

const menus = [
  [COPY_EDITOR, 'admin.editCopy', AdminCopyEditor],
  [FIX_ACCOUNT, 'admin.fixAccount', AdminFixAccount],
];

export default function Admin() {
  useAuthGate();

  const role = useRole();

  React.useEffect(() => {
    if (role && role !== STAFF_ROLE) {
      window.location.href = makeLocaleLink(`${HOMEPAGE_ROUTE}`);
    }
  }, [role]);

  const [menu, setMenu] = React.useState(COPY_EDITOR);

  return (
    <React.Fragment>
      <StandardHelmet />
      <Layout>
        <AdminNav>
          {menus.map((item) => {
            const [id, label] = item;

            return (
              <NavItem
                key={id}
                highlighted={menu === id}
                onClick={() => setMenu(id)}
              >
                {getCopy(label)}
              </NavItem>
            );
          })}
        </AdminNav>
        <AdminEditorContainer>
          {(() => {
            const activeMenu = menus.find((compare) => compare[0] === menu)
            if (!activeMenu) {
              return null;
            }

            const MenuComponent = [...activeMenu].pop();
            return (
              <MenuComponent />
            );
          })()}
        </AdminEditorContainer>
      </Layout>
    </React.Fragment>
  );
}
