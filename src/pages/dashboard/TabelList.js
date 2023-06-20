import { useSnackbar } from 'notistack';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { Button, Tooltip, Container, IconButton, useTheme } from '@mui/material';
import { useAddNewTabelMutation, useGetTabelsQuery } from '../../redux/slices/tabelApiSlice';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Access from '../../guards/Access';
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import ProTable from '../../components/table/ProTable';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function TabelList() {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const [addNewTable, { isLoading: isLoadingAdd, isError: isErrorAdd }] = useAddNewTabelMutation();

  const columns = [
    {
      title: 'Num',
      dataIndex: 'number',
      tip: 'Number of tabel',
      align: 'left',
      sortable: true,
      hideInSearch: false,
      valueType: 'textarea',
    },
    {
      title: 'Code',
      dataIndex: 'code',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: 'Qr',
      dataIndex: 'qr',
      hideInForm: true,
      hideInSearch: true,
      render: (dom, entity) => {
        return (
          <Button component={RouterLink} to={PATH_DASHBOARD.qr.downloadOne(entity.number)}>
            Download Qr
          </Button>
        );
      },
    },
  ];

  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const handleDeleteRow = (id) => {
    // deleteData({ id });
  };

  const handleDeleteRows = (selected, setSelected) => {
    // deleteData({ ids: selected });
    setSelected([]);
  };

  const BatchOperationActions = ({ selected, setSelected }) => {
    return (
      <Access action="delete_tabels_shop_panel">
        <Tooltip title="Delete">
          <IconButton color="primary" onClick={() => handleDeleteRows(selected, setSelected)}>
            <Iconify icon={'eva:trash-2-outline'} />
          </IconButton>
        </Tooltip>
      </Access>
    );
  };
  return (
    <Page title="Tabel: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Tabel List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Tabel', href: PATH_DASHBOARD.tabel.root },
            { name: 'List' },
          ]}
          action={
            <Access action="add_tabel_shop_panel">
              <Button variant="contained" startIcon={<Iconify icon={'eva:plus-fill'} />} onClick={() => addNewTable()}>
                New Tabel
              </Button>
            </Access>
          }
        />
        <ProTable
          requestQuery={useGetTabelsQuery}
          columns={columns}
          batchAccesses={['delete_tabel_shop_panel', 'update_tabel_shop_panel']}
          BatchOperationActions={BatchOperationActions}
        />
      </Container>
    </Page>
  );
}
