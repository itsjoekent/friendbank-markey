import React from 'react';
import styled, { css } from 'styled-components';
import copyToClipboard from 'copy-to-clipboard';
import LoadingSpinner from './LoadingSpinner';
import SignupsTablePanel from './SignupsTablePanel';
import { PHONEBANK_FORM_ROUTE } from '../pages/PhonebankForm';
import makeApiRequest from '../utils/makeApiRequest';
import getCopy from '../utils/getCopy';
import makeLocaleLink from '../utils/makeLocaleLink';

const Container = styled.div`
  padding: 16px;
  min-height: 0;
  transition: min-height 0.5s;

  ${({ enforceMinHeight }) => enforceMinHeight && css`
    min-height: 90vh;

    @media ${({ theme }) => theme.media.tablet} {
      min-height: 600px;
    }
  `}
`;

const HeaderRow = styled.div`
  display: flex;
  flex-direction: column;

  @media ${({ theme }) => theme.media.tablet} {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const HeaderColumn = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;

  @media ${({ theme }) => theme.media.tablet} {
    margin-bottom: 0;
  }
`;

const HeaderActionsColumn = styled(HeaderColumn)`
  @media ${({ theme }) => theme.media.tablet} {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
`;

const HeaderTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.headerFamily};
  font-weight: bold;
  font-size: 28px;
  line-height: 1.1;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.blue};
  margin-bottom: 12px;
`;

const HeaderSubtitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.headerFamily};
  font-weight: bold;
  font-size: 14px;
  line-height: 1.1;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.black};
  margin-bottom: 16px;
`;

const HeaderButton = styled.button`
  display: block;
  font-family: ${({ theme }) => theme.fonts.headerFamily};
  font-weight: bold;
  font-size: 14px;
  line-height: 1.1;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.blue};
  cursor: pointer;
  padding: 0;
  width: fit-content;
  background: none;
  border: none;
  text-decoration: none;
  margin-bottom: 16px;

  &:hover {
    text-decoration: underline;
  }

  @media ${({ theme }) => theme.media.tablet} {
    margin-bottom: 0;
    margin-right: 16px;
  }
`;

const Table = styled.div`
  display: flex;
  flex-direction: column;
`;

const TableRow = styled.div`
  display: flex;
  flex-direction: row;
  padding-top: 12px;
  padding-bottom: 12px;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey};
  text-align: left;
  background: none;

  ${({ onClick }) => !!onClick && css`
    &:hover {
      cursor: pointer;
      background-color: ${({ theme }) => theme.colors.chrome};
    }
  `}
`;

const TableColumnDefault = styled.div`
  width: calc(50% - 12px);
  padding-right: 12px;

  @media ${({ theme }) => theme.media.tablet} {
    width: calc(33.33% - 12px);
  }

  @media ${({ theme }) => theme.media.desktop} {
    width: calc(20% - 12px);
    padding-right: 12px;
  }
`;

const TableColumnTabletOnly = styled.div`
  display: none;

  @media ${({ theme }) => theme.media.tablet} {
    display: block;
    width: calc(33.33% - 12px);
    padding-right: 12px;
  }

  @media ${({ theme }) => theme.media.desktop} {
    width: calc(20% - 12px);
    padding-right: 12px;
  }
`;

const TableColumnDesktopOnly = styled.div`
  display: none;

  @media ${({ theme }) => theme.media.desktop} {
    display: block;
    width: calc(20% - 12px);
    padding-right: 12px;
  }
`;

const TableColumnName = styled.p`
  font-family: ${({ theme }) => theme.fonts.mainFamily};
  font-weight: normal;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.blue};
`;

const TableColumnValue = styled.p`
  font-family: ${({ theme }) => theme.fonts.mainFamily};
  font-weight: normal;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.black};
`;

const TableColumnValueLink = styled(TableColumnValue)`
  font-family: ${({ theme }) => theme.fonts.mainFamily};
  font-weight: normal;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.blue};
  text-decoration: underline;
`;

const TableButton = styled.button`
  display: block;
  font-family: ${({ theme }) => theme.fonts.headerFamily};
  font-weight: bold;
  font-size: 14px;
  line-height: 1.1;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  user-select: none;
  padding: 8px 16px;
  width: fit-content;
  background-color: ${({ theme }) => theme.colors.blue};
  border: 2px solid ${({ theme }) => theme.colors.blue};

  &:hover {
    color: ${({ theme }) => theme.colors.blue};
    background-color: ${({ theme }) => theme.colors.white};;
  }
`;

const TablePaginationRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 16px;

  ${TableButton}:first-child {
    margin-right: 8px;
  }

  ${TableButton}:last-child {
    margin-left: 8px;
  }
`;

export default function SignupsTable() {
  const [signups, setSignups] = React.useState(null);
  const [totalSignups, setTotalSignups] = React.useState(0);

  const [signupsPage, setSignupsPage] = React.useState(0);
  const [signupsQuery, setSignupsQuery] = React.useState('');

  const [selectedSignup, setSelectedSignup] = React.useState(null);

  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    let cancel = false;

    async function fetchSignups() {
      const url = `/api/v1/user/signups?${signupsQuery}`;

      const { response, json } = await makeApiRequest(url, 'get');

      if (!cancel) {
        setSignupsQuery(null);

        if (json.signups) {
          setSignups([...(signups || []), ...json.signups]);
        }

        if (json.total !== totalSignups) {
          setTotalSignups(json.total);
        }
      }
    }

    if (typeof signupsQuery === 'string') {
      fetchSignups();
    }

    return () => { cancel = true };
  }, [
    signupsQuery,
    setSignupsQuery,
    signups,
    setSignups,
    setTotalSignups,
  ]);

  React.useEffect(() => {
    if (copied) {
      const timeoutId = setTimeout(() => setCopied(false), 1250);
      return () => clearTimeout(timeoutId);
    }
  }, [copied, setCopied]);

  function nextSignupsPage() {
    if (signups.length < ((signupsPage + 1) * 10) + 1) {
      setSignupsQuery(`lastId=${[...signups].pop().id}`);
    }

    setSignupsPage(signupsPage + 1);
  }

  function previousSignupsPage() {
    setSignupsPage(signupsPage - 1);
  }

  const showPanel = !!selectedSignup;

  function updateSignup(id, data) {
    setSignups((original) => original.map((signup) => {
      if (signup.id !== id) {
        return signup;
      }

      return {
        ...signup,
        ...data,
      };
    }));
  }

  const tableIndex = signupsPage * 10;
  const tableData = ((signups || []).slice(tableIndex, tableIndex + 10));

  function copyAllEmails() {
    copyToClipboard(
      tableData
        .filter((signup) => signup.email && !signup.email.startsWith('missing::'))
        .map((signup) => `${signup.firstName} ${signup.lastName} <${signup.email}>`)
        .join(', ')
    );

    setCopied(true);
  }

  const showPreviousButton = tableIndex > 0;
  const showNextButton = (tableIndex + 10) < totalSignups;

  return (
    <LoadingSpinner hasCompletedLoading={Array.isArray(signups)}>
      <React.Fragment>
        {showPanel && (
          <SignupsTablePanel
            selectedSignup={selectedSignup}
            setSelectedSignup={setSelectedSignup}
            updateSignup={updateSignup}
          />
        )}
        <Container enforceMinHeight={showPanel}>
          <HeaderRow>
            <HeaderColumn>
              <HeaderTitle>
                {getCopy('dashboard.signupsHeader')}
              </HeaderTitle>
              <HeaderSubtitle>
                {getCopy('dashboard.totalSignups')} {totalSignups}
              </HeaderSubtitle>
            </HeaderColumn>
            <HeaderActionsColumn>
              <HeaderButton as="a" href={makeLocaleLink(PHONEBANK_FORM_ROUTE)}>
                {getCopy('dashboard.phonebankLabel')}
              </HeaderButton>
              <HeaderButton onClick={copyAllEmails}>
                {copied ? 'Copied to clipboard!' : getCopy('dashboard.signupTableCopyAllEmails')}
              </HeaderButton>
            </HeaderActionsColumn>
          </HeaderRow>
          <Table>
            <TableRow>
              <TableColumnDefault>
                <TableColumnName>
                  {getCopy('dashboard.signupTableName')}
                </TableColumnName>
              </TableColumnDefault>
              <TableColumnDefault>
                <TableColumnName>
                  {getCopy('formLabels.email')}
                </TableColumnName>
              </TableColumnDefault>
              <TableColumnTabletOnly>
                <TableColumnName>
                  {getCopy('formLabels.phone')}
                </TableColumnName>
              </TableColumnTabletOnly>
              <TableColumnDesktopOnly>
                <TableColumnName>
                  {getCopy('formLabels.zip')}
                </TableColumnName>
              </TableColumnDesktopOnly>
              <TableColumnDesktopOnly>
                <TableColumnName>
                  {getCopy('dashboard.signupTableSource')}
                </TableColumnName>
              </TableColumnDesktopOnly>
            </TableRow>
            {tableData && tableData.map((signup) => (
              <TableRow
                key={signup.id}
                onClick={() => setSelectedSignup(signup)}
                as="button"
                aria-label={`${getCopy('dashboard.signupTableRowAria')} ${signup.firstName} ${signup.lastName}`}
              >
                <TableColumnDefault>
                  <TableColumnValue>
                    {signup.firstName} {signup.lastName}
                  </TableColumnValue>
                </TableColumnDefault>
                <TableColumnDefault>
                  <TableColumnValue>
                    {signup.email}
                  </TableColumnValue>
                </TableColumnDefault>
                <TableColumnTabletOnly>
                  <TableColumnValue>
                    {signup.phone}
                  </TableColumnValue>
                </TableColumnTabletOnly>
                <TableColumnDesktopOnly>
                  <TableColumnValue>
                    {signup.zip}
                  </TableColumnValue>
                </TableColumnDesktopOnly>
                <TableColumnDesktopOnly>
                  {signup.type === 'subscriber'
                    ? (
                      <TableColumnValueLink
                        as="a"
                        target="_blank"
                        href={makeLocaleLink(`/${signup.code}`)}
                      >
                        {signup.code}
                      </TableColumnValueLink>
                    ) : (
                      <TableColumnValue>
                        {getCopy('dashboard.signupTablePhonebankSource')}
                      </TableColumnValue>
                    )
                  }
                </TableColumnDesktopOnly>
              </TableRow>
            ))}
            {signups && (showNextButton || showPreviousButton) && (
              <TablePaginationRow>
                {showPreviousButton && (
                  <TableButton onClick={previousSignupsPage}>previous</TableButton>
                )}
                {showNextButton && (
                  <TableButton onClick={nextSignupsPage}>next</TableButton>
                )}
              </TablePaginationRow>
            )}
          </Table>
        </Container>
      </React.Fragment>
    </LoadingSpinner>
  );
}
