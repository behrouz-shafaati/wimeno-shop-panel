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
        info: (
          <Label variant="outlined" color="error">
            +32
          </Label>
        ),
      },
      {
        access: 'create_user_panel',
        title: i18n.t('invoice.title'),
        path: '/dashboard/invoice/list',
        icon: ICONS.invoice,
      },
      {
        access: [],
        title: i18n.t('settings'),
        path: PATH_DASHBOARD.general.settings,
        icon: ICONS.invoice,
      },
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
        icon: ICONS.ecommerce,
      },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      // USER
      {
        title: 'User',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
        children: [
          { access: 'get_users_panel', title: 'list', path: PATH_DASHBOARD.user.list },
          { access: 'create_user_panel', title: 'create', path: PATH_DASHBOARD.user.new },
          // { title: 'edit', path: PATH_DASHBOARD.user.demoEdit },
          { access: 'update_user', title: 'account', path: PATH_DASHBOARD.user.account },
        ],
      },
      // ROLE
      {
        title: 'Role',
        path: PATH_DASHBOARD.role.root,
        icon: ICONS.user,
        children: [
          { access: 'get_users_panel', title: 'list', path: PATH_DASHBOARD.role.list },
          { access: 'create_user_panel', title: 'create', path: PATH_DASHBOARD.role.new },
        ],
      },
    ],
  },
];

export default sidebarConfig;
