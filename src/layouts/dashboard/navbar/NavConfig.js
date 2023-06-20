import i18n from '../../../locales/i18n';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Label from '../../../components/Label';
import SvgIconStyle from '../../../components/SvgIconStyle';
// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  user: getIcon('ic_user'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  invoice: getIcon('ic_invoice'),
  service: getIcon('ic_apps'),
  settings: getIcon('solar_settings-minimalistic-bold-duotone'),
  tabel: getIcon('solar_tablet-bold-duotone'),

  mail: getIcon('ic_mail'),
};

const sidebarConfig = () => [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'beta v0.1',
    items: [
      { access: 'create_user_panel', title: i18n.t('dashboard.title'), path: '/dashboard/app', icon: ICONS.dashboard },
      { access: 'create_user', title: i18n.t('service.title'), path: '/dashboard/service', icon: ICONS.service },
      {
        access: 'create_user_panel',
        title: i18n.t('ticket.title'),
        path: PATH_DASHBOARD.ticket.root,
        icon: ICONS.mail,
        // info: (
        //   <Label variant="outlined" color="error">
        //     +32
        //   </Label>
        // ),
      },
      // {
      //   access: 'create_user_panel',
      //   title: i18n.t('invoice.title'),
      //   path: '/dashboard/invoice/list',
      //   icon: ICONS.invoice,
      // },

      {
        access: [],
        title: i18n.t('product'),
        path: PATH_DASHBOARD.eCommerce.list,
        icon: ICONS.ecommerce,
      },
      {
        access: [],
        title: i18n.t('tabel'),
        path: PATH_DASHBOARD.tabel.list,
        icon: ICONS.tabel,
      },
      {
        access: [],
        title: i18n.t('settings'),
        path: PATH_DASHBOARD.general.settings,
        icon: ICONS.settings,
      },
    ],
  },
];

export default sidebarConfig;
