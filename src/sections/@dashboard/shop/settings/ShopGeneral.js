import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Typography, styled } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// redux
import { useUploadFileMutation } from '../../../../redux/slices/fileApiSlice';
import { useUpdateShopMutation } from '../../../../redux/slices/shopApiSlice';
import { useRefreshQuery } from '../../../../redux/slices/authApiSlice';
// hooks
import useAuth from '../../../../hooks/useAuth';
// utils
import { fData } from '../../../../utils/formatNumber';
// _mock
import { countries } from '../../../../_mock';
// components
import {
  FormProvider,
  RHFSwitch,
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar,
  RHFUploadSingleFile,
} from '../../../../components/hook-form';

// ----------------------------------------------------------------------
const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));
// ----------------------------------------------------------------------

export default function ShopGeneral() {
  const { enqueueSnackbar } = useSnackbar();

  const { shop } = useAuth();

  const [uploadFile, { isLoading: isLoadingUploadFile }] = useUploadFileMutation();

  const [updateShop, { isLoading, isSuccess: isSuccessUpdate }] = useUpdateShopMutation();

  const { refetch } = useRefreshQuery();

  const UpdateShopSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    shopStringId: Yup.string().required('Shop ID is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    country: Yup.string().required('Country is required'),
    address: Yup.string().required('Address is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    about: Yup.string(),
  });

  const defaultValues = {
    title: shop?.title || '',
    shopStringId: shop?.shopStringId || '',
    logoURL: shop?.logo?.url || '',
    coverURL: shop?.cover?.url || '',
    phoneNumber: shop?.phoneNumber || '',
    country: shop?.country || '',
    address: shop?.address || '',
    state: shop?.state || '',
    city: shop?.city || '',
    about: shop?.about || '',
  };

  useEffect(() => {
    if (isSuccessUpdate) enqueueSnackbar('Update success!');
    refetch();
  }, [isSuccessUpdate]);

  const methods = useForm({
    resolver: yupResolver(UpdateShopSchema),
    defaultValues,
  });

  const { setValue, handleSubmit } = methods;

  const onSubmit = (data) => {
    updateShop(data);
  };

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setValue(
          'logoURL',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
        const uploadedFile = await uploadFile(file);
        setValue('logo', uploadedFile.data.id);
      }
    },
    [setValue]
  );

  const handleDropCover = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'coverURL',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
        const uploadedFile = await uploadFile(file);
        setValue('cover', uploadedFile.data.id);
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 4, px: 3, textAlign: 'center' }}>
            <div>
              <LabelStyle>Logo imave</LabelStyle>
              <RHFUploadAvatar
                name="logoURL"
                accept="image/*"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </div>
            <div style={{ paddingTop: '80px' }}>
              <LabelStyle>Cover image</LabelStyle>
              <RHFUploadSingleFile name="coverURL" accept="image/*" maxSize={3145728} onDrop={handleDropCover} />
            </div>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 2,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="title" label="Title" />
              <RHFTextField name="shopStringId" label="Shop ID" />
              <RHFTextField name="phoneNumber" label="Phone number" />
              <RHFTextField name="address" label="Address" />
              <RHFSelect name="country" label="Country" placeholder="Country">
                <option value="" />
                {countries.map((option) => (
                  <option key={option.code} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>
              <RHFTextField name="state" label="State/Region" />
              <RHFTextField name="city" label="City" />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <RHFTextField name="about" multiline rows={4} label="About" />

              <LoadingButton type="submit" variant="contained" loading={isLoading || isLoadingUploadFile}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
