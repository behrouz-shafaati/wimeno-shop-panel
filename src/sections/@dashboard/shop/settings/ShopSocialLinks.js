import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
// form
import { useForm } from 'react-hook-form';
// @mui
import { Stack, Card, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// api
import { useUpdateShopMutation } from '../../../../redux/slices/shopApiSlice';
// hooks
import useAuth from '../../../../hooks/useAuth';
// components
import Iconify from '../../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

const SOCIAL_LINKS = [
  {
    value: 'facebookLink',
    icon: <Iconify icon={'eva:facebook-fill'} width={24} height={24} />,
  },
  {
    value: 'instagramLink',
    icon: <Iconify icon={'ant-design:instagram-filled'} width={24} height={24} />,
  },
  // {
  //   value: 'linkedinLink',
  //   icon: <Iconify icon={'eva:linkedin-fill'} width={24} height={24} />,
  // },
  {
    value: 'twitterLink',
    icon: <Iconify icon={'eva:twitter-fill'} width={24} height={24} />,
  },
];

// ----------------------------------------------------------------------

ShopSocialLinks.propTypes = {};

export default function ShopSocialLinks() {
  const { enqueueSnackbar } = useSnackbar();
  const { shop } = useAuth();
  const [updateShop, { isLoading, isSuccess: isSuccessUpdate }] = useUpdateShopMutation();

  const defaultValues = {
    facebookLink: shop?.facebookLink || '',
    instagramLink: shop?.instagramLink || '',
    // linkedinLink: shop?.linkedinLink || '',
    twitterLink: shop?.twitterLink || '',
  };

  const methods = useForm({
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    updateShop(data);
  };

  useEffect(() => {
    if (isSuccessUpdate) enqueueSnackbar('Update done.');
  }, [isLoading]);

  return (
    <Card sx={{ p: 3 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} alignItems="flex-end">
          {SOCIAL_LINKS.map((link) => (
            <RHFTextField
              key={link.value}
              name={link.value}
              InputProps={{
                startAdornment: <InputAdornment position="start">{link.icon}</InputAdornment>,
              }}
            />
          ))}

          <LoadingButton type="submit" variant="contained" loading={isLoading}>
            Save Changes
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Card>
  );
}
