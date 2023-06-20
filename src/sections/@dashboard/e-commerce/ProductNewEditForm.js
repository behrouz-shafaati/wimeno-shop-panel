import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Card, Chip, Grid, Stack, TextField, Typography, Autocomplete, InputAdornment } from '@mui/material';
// redux
import { useGetCategorysQuery } from '../../../redux/slices/categoryApiSlice';
import { useAddNewProductMutation, useUpdateProductMutation } from '../../../redux/slices/productApiSlice';
import { useUploadFileMutation } from '../../../redux/slices/fileApiSlice';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import {
  FormProvider,
  RHFSwitch,
  RHFSelect,
  RHFEditor,
  RHFTextField,
  RHFRadioGroup,
  RHFUploadMultiFile,
} from '../../../components/hook-form';

// ----------------------------------------------------------------------

// const CATEGORY_OPTION = [
//   { group: 'Clothing', classify: ['Shirts', 'T-shirts', 'Jeans', 'Leather'] },
//   { group: 'Tailored', classify: ['Suits', 'Blazers', 'Trousers', 'Waistcoats'] },
//   { group: 'Accessories', classify: ['Shoes', 'Backpacks and bags', 'Bracelets', 'Face masks'] },
// ];

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

ProductNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
};

export default function ProductNewEditForm({ isEdit, currentProduct }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const { data: categories, isLoading: isLoadingCategories } = useGetCategorysQuery({ page: 'off' });
  const [addProduct, { isSuccess: isSuccessAdd, isLoading: isAdding, isError: isErrorAdd, error: errorAdd }] =
    useAddNewProductMutation();
  const [
    updateProduct,
    { isSuccess: isSuccessUpdate, isLoading: isUpdating, isError: isErrorUpdate, error: errorUpdate },
  ] = useUpdateProductMutation();
  const [uploadFile, { isLoading: isLoadingUploadFile }] = useUploadFileMutation();

  const [categoryOptions, setCategoryOptions] = useState([{ group: '', classify: [] }]);

  useEffect(async () => {
    const CATEGORY_OPTION = [];
    await categories?.ids.forEach(async (id) => {
      const category = categories.entities[id];
      if (category.parent === null) {
        const child = [];
        await categories?.ids.forEach((id) => {
          const _category = categories.entities[id];
          if (category.id === _category.parent?.id) {
            child.push({ label: _category.title, value: _category.id });
          }
        });
        CATEGORY_OPTION.push({ group: category.title, classify: child });
      }
    });
    if (CATEGORY_OPTION.length > 0) {
      setCategoryOptions(CATEGORY_OPTION);
      setValue('category', CATEGORY_OPTION[0].classify[0]?.value);
    }
  }, [categories]);

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    category: Yup.string().required('Description is required'),
    imagesSelect: Yup.array().min(1, 'Images is required'),
    price: Yup.number().moreThan(0, 'Price should not be $0.00'),
    salePrice: Yup.number().moreThan(0, 'Price should not be $0.00'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || '',
      description: currentProduct?.description || '',
      imagesSelect: currentProduct?.images || [],
      price: currentProduct?.price || 0,
      priceSale: currentProduct?.priceSale || 0,
      inStock: currentProduct?.inStock,
      category: currentProduct?.category.id || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentProduct]
  );

  useEffect(() => {
    if (isSuccessAdd || isSuccessUpdate) {
      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.eCommerce.list);
    }
    if (isErrorAdd) {
      enqueueSnackbar(errorAdd.data.msg, { variant: 'error' });
    }
    if (isErrorUpdate) {
      enqueueSnackbar(errorUpdate.data.msg, { variant: 'error' });
    }
  }, [isSuccessAdd, isErrorAdd, isErrorUpdate, isSuccessUpdate]);

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentProduct) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentProduct]);

  const onSubmit = async (data) => {
    const images = fileIds.map((file) => file.id || file.serverId);
    try {
      if (!isEdit) await addProduct({ ...data, images });
      else {
        setValue('id', currentProduct.id);
        updateProduct({ ...data, images });
      }

      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.eCommerce.list);
    } catch (error) {
      console.error(error);
    }
  };

  const [files, setFiles] = useState(currentProduct?.images || []);
  const [fileIds, setFileIds] = useState(currentProduct?.images || []);
  const handleDrop = useCallback(
    async (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) => {
        const randomId = Math.floor(Math.random() * 9999 + 1000);
        return Object.assign(file, {
          preview: URL.createObjectURL(file),
          localId: randomId,
        });
      });

      setFiles([...files, ...newFiles]);

      newFiles.map(async (file) => {
        const uploadedFile = await uploadFile(file);
        const _new = { localId: file.localId, serverId: uploadedFile.data.id };
        setFileIds((state) => [...state, _new]);
      });
    },
    [files]
  );

  useEffect(() => {
    setValue('imagesSelect', files);
  }, [files]);

  const handleRemoveAll = () => {
    setFiles([]);
    setFileIds([]);
  };

  const handleRemove = (file) => {
    const filteredItems = files.filter((_file) => {
      if (file.id) return _file?.id !== file.id;
      return _file.localId !== file.localId;
    });
    setFiles(filteredItems);

    const filteredIds = fileIds.filter((_file) => {
      if (file.id) return _file?.id !== file.id;
      return _file.localId !== file.localId;
    });
    setFileIds(filteredIds);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="name" label="Product Name" />

              <div>
                <LabelStyle>Description</LabelStyle>
                <RHFEditor simple name="description" />
              </div>

              <div>
                <LabelStyle>Images</LabelStyle>
                <RHFUploadMultiFile
                  name="imagesSelect"
                  showPreview
                  accept="image/*"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onRemove={handleRemove}
                  onRemoveAll={handleRemoveAll}
                />
              </div>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <RHFSwitch name="inStock" label="Active in menu" />

              <Stack spacing={3} mt={2}>
                {categoryOptions.length > 0 && (
                  <RHFSelect name="category" label="Category">
                    {categoryOptions?.map((category) => (
                      <optgroup key={category?.group} label={category?.group}>
                        {category?.classify?.map((classify) => (
                          <option key={classify?.value} value={classify?.value}>
                            {classify?.label}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </RHFSelect>
                )}
              </Stack>
            </Card>

            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mb={2}>
                <RHFTextField
                  name="price"
                  label="Regular Price"
                  placeholder="0.00"
                  value={getValues('price') === 0 ? '' : getValues('price')}
                  onChange={(event) => setValue('price', Number(event.target.value))}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    type: 'number',
                  }}
                />

                <RHFTextField
                  name="priceSale"
                  label="Sale Price"
                  placeholder="0.00"
                  value={getValues('priceSale') === 0 ? '' : getValues('priceSale')}
                  onChange={(event) => setValue('priceSale', Number(event.target.value))}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    type: 'number',
                  }}
                />
              </Stack>
            </Card>

            <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
              {!isEdit ? 'Create Product' : 'Save Changes'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
