import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import QRCodeStyling from 'qr-code-styling';
import { CirclePicker, SketchPicker } from 'react-color';
// @mui
import { Button, Tooltip, Container, Grid, FormControlLabel, Checkbox } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useAuth from '../../hooks/useAuth';
// components
import Access from '../../guards/Access';
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function QrDownload() {
  const { shop } = useAuth();
  const { number = '' } = useParams();
  const [selecteLogo, setSelectedLogo] = useState(shop?.logo.url || '');
  const [image, setImage] = useState(selecteLogo);
  const [isCheckedWithLogo, setIsCheckedWithLogo] = useState(true);

  const [color, setColor] = useState('#000000');
  // ----------------------------------------
  const [options, setOptions] = useState({
    width: 300,
    height: 300,
    image,
    dotsOptions: {
      color,
      type: 'rounded',
    },
    imageOptions: {
      crossOrigin: 'anonymous',
      margin: 20,
    },
    cornersSquareOptions: {
      type: 'extra-rounded',
    },
  });
  const qrCode = new QRCodeStyling(options);

  const [url, setUrl] = useState(`https://wimeno/${shop.shopStringId}?tabel=${number}`);
  const [fileExt, setFileExt] = useState('svg');
  const ref = useRef(null);

  useEffect(() => {
    qrCode.append(ref.current);
  }, []);

  useEffect(() => {
    if (!qrCode) return;
    qrCode.update(options);
    qrCode.update({
      data: url,
    });
    ref.current.removeChild(ref.current.children[0]);
    qrCode.append(ref.current);
  }, [qrCode, options]);

  useEffect(() => {
    setOptions((options) => ({
      ...options,
      dotsOptions: { ...options.dotsOptions, color },
    }));
  }, [color]);

  useEffect(() => {
    qrCode.update({
      data: url,
    });
  }, [url]);
  const onUrlChange = (event) => {
    event.preventDefault();
    setUrl(event.target.value);
  };

  const onExtensionChange = (event) => {
    setFileExt(event.target.value);
  };

  const onDownloadClick = (shopStringId, number) => {
    const url = `https://wimeno/${shopStringId}?tabel=${number}`;
    qrCode.update({
      data: url,
    });
    qrCode.download({
      extension: fileExt,
    });
  };

  const handleChangeWithLogo = (event) => {
    setIsCheckedWithLogo((state) => !state);
    if (!isCheckedWithLogo) setImage('');
    else setImage(selecteLogo);
    setOptions((options) => ({
      ...options,
      image,
    }));
  };
  //---------------------------------
  const { themeStretch } = useSettings();
  return (
    <Page title="Tabel: Download Qr code">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Download Qr COde"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Table', href: PATH_DASHBOARD.tabel.root },
            { name: 'QR' },
          ]}
          action={<></>}
        />
        <div style={{ p: 8 }}>
          <FormControlLabel
            label="With Logo"
            control={<Checkbox checked={isCheckedWithLogo} onChange={handleChangeWithLogo} />}
          />
        </div>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
              {number && (
                <Button onClick={() => onDownloadClick(shop.shopStringId, number)}>Download Qr table {number}</Button>
              )}

              {/* <Button>Download QR of all tables</Button> */}

              <CirclePicker color={color} onChangeComplete={(color) => setColor(color.hex)} />
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <div ref={ref} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
