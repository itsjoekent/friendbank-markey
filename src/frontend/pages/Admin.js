import React from 'react';
import styled, { css } from 'styled-components';
import { HOMEPAGE_ROUTE } from './Homepage';
import makeLocaleLink from '../utils/makeLocaleLink';
import useAuthGate from '../hooks/useAuthGate';
import useGetUserRole from '../hooks/useGetUserRole';
import { STAFF_ROLE } from '../../shared/roles';

export const ADMIN_ROUTE = '/friendbank/admin';

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
    flex-wrap: wrap;
  }
`;

const AdminNav = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-bottom: 24px;
  margin-bottom: 24px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.blue};

  min-height: 100px;

  @media ${({ theme }) => theme.media.tablet} {
    width: 250px;
    padding-bottom: 0;
    margin-bottom: 0;
    padding-right: 24px;
    margin-right: 24px;
    border-right: 2px solid ${({ theme }) => theme.colors.blue};
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
    color: ${({ theme }) => theme.colors.blue};
  }
`;

const AdminEditorContainer = styled.div`
  @media ${({ theme }) => theme.media.tablet} {
    flex-grow: 1;
  }
`;

export default function Admin() {
  useAuthGate();

  const role = useGetUserRole(true);

  const [AdminCopyEditor, setAdminCopyEditor] = React.useState({ Component: React.Fragment });

  React.useEffect(() => {
    if (role && role !== STAFF_ROLE) {
      window.location.href = makeLocaleLink(`${HOMEPAGE_ROUTE}`);
    }
  }, [role]);

  // TEMP: SSR Lazy loading mechanism.
  React.useEffect(() => {
    Promise.all([
      import('../components/AdminCopyEditor.js'),
    ]).then((modules) => {
      setAdminCopyEditor({ Component: modules[0].default });
    });
  }, [
    setAdminCopyEditor,
  ]);

  return (
    <Layout>
      <AdminNav>
        <NavItem>Edit Copy</NavItem>
        <NavItem>Edit Config</NavItem>
        <NavItem>Edit Emails</NavItem>
        <NavItem>Edit Theme</NavItem>
        <NavItem>Manage Team</NavItem>
        <NavItem>Billing</NavItem>
      </AdminNav>
      <AdminEditorContainer>
        <AdminCopyEditor.Component />
      </AdminEditorContainer>
    </Layout>
  );
}
