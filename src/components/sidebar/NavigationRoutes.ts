export interface INavigationRoute {
  name: string
  displayName: string
  meta: { icon: string }
  children?: INavigationRoute[]
}

export default {
  root: {
    name: '/',
    displayName: 'navigationRoutes.home',
  },
  routes: [
    {
      name: 'send_email',
      displayName: 'Send Email',
      meta: {
        icon: 'mail',
      },
    },
    {
      name: 'crete_recipients',
      displayName: 'Create Recipients',
      meta: {
        icon: 'vuestic-iconset-user',
      },
    },
    {
      name: 'crete_template',
      displayName: 'Create Template',
      meta: {
        icon: 'vuestic-iconset-dashboard',
      },
    },

    {
      name: 'settings',
      displayName: 'menu.settings',
      meta: {
        icon: 'settings',
      },
    },
  ] as INavigationRoute[],
}
