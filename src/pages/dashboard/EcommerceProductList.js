import { paramCase } from 'change-case';
import { useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useSnackbar } from 'notistack';
// @mui
import { Button, Tooltip, Container, IconButton, useTheme } from '@mui/material';
// redux
import { useGetCategorysQuery } from '../../redux/slices/categoryApiSlice';
import { useDeleteProductMutation, useGetProductsQuery } from '../../redux/slices/productApiSlice';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Image from '../../components/Image';
import Label from '../../components/Label';
import ProTable from '../../components/table/ProTable';
import Access from '../../guards/Access';

export default function EcommerceProductList() {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { data: categories, isLoading: isLoadingCategories } = useGetCategorysQuery({ page: 'off' });
  const [
    deleteProduct,
    { isLoading: isLoadingDelete, isError: isErrorDelete, isSuccess: isSuccessDelete, error: errorDelete },
  ] = useDeleteProductMutation();
  useEffect(() => {
    if (isSuccessDelete) {
      enqueueSnackbar('Delete done.');
    }
    if (isErrorDelete) {
      enqueueSnackbar(errorDelete.data.msg, { variant: 'error' });
    }
  }, [isSuccessDelete, isErrorDelete]);

  const columns = [
    {
      dataIndex: 'name',
      title: 'Name',
      tip: 'Name of product',
      align: 'left',
      titleFilter: 'Product',
      sortable: true,
      // hideInSearch: true,
      render: (dom, entity) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {entity.images[0]?.url ? (
              <Image
                disabledEffect
                alt={entity.name}
                src={entity.images[0]?.url}
                sx={{ borderRadius: 1.5, width: 48, height: 48, mr: 2 }}
              />
            ) : (
              <div style={{ width: `50px`, height: `1px` }} />
            )}
            {dom}
          </div>
        );
      },
    },
    {
      title: 'Price',
      dataIndex: 'price',
      valueType: 'textarea',
      hideInSearch: true,
      render: (dom, entity) => {
        if (entity?.priceSale !== '') return <>{entity?.priceSale}</>;
        return <>{entity?.price}</>;
      },
    },
    {
      title: 'Category',
      dataIndex: 'category',
      valueType: 'select',
      options: !isLoadingCategories
        ? categories.ids
            ?.filter((id) => categories.entities[id].parent != null)
            .map((id) => ({ label: categories.entities[id].title, value: id }))
        : 'isLoading',
      render: (dom, entity) => {
        return entity.category.title || '-';
      },
    },
    {
      options: [
        {
          label: 'Active',
          value: 1,
        },
        {
          label: 'Deactive',
          value: 0,
        },
      ],
      inTab: true,
      title: 'Status',
      dataIndex: 'inStock',
      hideInForm: true,
      hideInSearch: true,
      valueType: 'label',
      sortable: true,
      // set key name in searh parameter
      search: {
        transform: (val) => {
          return { inStock: val };
        },
      },
      render: (dom, entity) => {
        return (
          <Label
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            color={(entity.inStock === false && 'error') || 'success'}
            sx={{ textTransform: 'capitalize' }}
          >
            {(entity.inStock === false && 'Deactive') || 'Active'}
          </Label>
        );
      },
    },
    {
      title: '',
      dataIndex: 'actions',
      valueType: 'action',
      hideInSearch: true,
      menuItems: [
        {
          access: 'delete_products_shop_panel',
          label: (
            <>
              <Iconify icon={'eva:trash-2-outline'} />
              Delete
            </>
          ),
          props: {
            onClick: (entity) => {
              handleDeleteRow(entity.id);
            },
            sx: { color: 'error.main' },
          },
        },
        {
          access: 'update_product_shop_panel',
          label: (
            <>
              <Iconify icon={'eva:edit-fill'} />
              Edit
            </>
          ),
          props: {
            onClick: (entity) => {
              navigate(PATH_DASHBOARD.eCommerce.edit(paramCase(entity.id)));
            },
          },
        },
      ],
    },
  ];

  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const handleDeleteRow = (id) => {
    deleteProduct({ id });
  };

  const handleDeleteRows = (selected, setSelected) => {
    deleteProduct({ ids: selected });
    setSelected([]);
  };

  const BatchOperationActions = ({ selected, setSelected }) => {
    return (
      <Access action="delete_products_shop_panel">
        <Tooltip title="Delete">
          <IconButton color="primary" onClick={() => handleDeleteRows(selected, setSelected)}>
            <Iconify icon={'eva:trash-2-outline'} />
          </IconButton>
        </Tooltip>
      </Access>
    );
  };
  return (
    <Page title="Product: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Product List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Product', href: PATH_DASHBOARD.eCommerce.root },
            { name: 'List' },
          ]}
          action={
            <Access action="add_product_shop_panel">
              <Button
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.eCommerce.new}
                startIcon={<Iconify icon={'eva:plus-fill'} />}
              >
                New Product
              </Button>
            </Access>
          }
        />
        <ProTable
          requestQuery={useGetProductsQuery}
          columns={columns}
          batchAccesses={['delete_products_shop_panel']}
          BatchOperationActions={BatchOperationActions}
        />
      </Container>
    </Page>
  );
}
