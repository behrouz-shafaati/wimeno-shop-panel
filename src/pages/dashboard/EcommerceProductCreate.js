import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// redux
import { useGetProductsQuery } from '../../redux/slices/productApiSlice';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import ProductNewEditForm from '../../sections/@dashboard/e-commerce/ProductNewEditForm';

// ----------------------------------------------------------------------

export default function EcommerceProductCreate() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { id = '' } = useParams();
  const isEdit = pathname.includes('edit');
  const { data, isLoading, isError, isSuccess, error } = useGetProductsQuery({ id }, { skip: id === '' });
  let currentData = null;
  if (isSuccess) currentData = data.entities[id];

  let titleName;
  if (!isEdit) titleName = 'New Product';
  else if (isLoading) titleName = `loading...`;
  else if (!currentData) titleName = 'Not Found';
  else titleName = currentData.name;

  return (
    <Page title="Ecommerce: Create a new product">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new product' : 'Edit product'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'E-Commerce',
              href: PATH_DASHBOARD.eCommerce.root,
            },
            { name: titleName },
          ]}
        />

        {!isLoading ? <ProductNewEditForm isEdit={isEdit} currentProduct={currentData} /> : <>Sceleton</>}
      </Container>
    </Page>
  );
}
