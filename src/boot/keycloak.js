import VueKeyCloak from '@dsb-norge/vue-keycloak-js'

export default async ({ Vue, router, store, app }) => {
  await new Promise((resolve, reject) => {
    Vue.use(VueKeyCloak, {
      logout: {
        redirectUri: process.env.BASE_URL
      },
      config: {
        realm: 'master',
        url: 'https://idm.example/auth',
        clientId: 'client'
      },
      init: {
        // onLoad: 'check-sso',
        onLoad: 'login-required',
        checkLoginIframe: false
      },
      onInitError: error => {
        console.log('error :', error)
        reject('error', error)
      },
      onReady: keycloak => {
        resolve('keycloak defined')
      }
    })
  })

  // guard routes definition based on authentification
  router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (router.app.$keycloak.authenticated) {
        console.log(router.app.$keycloak.token)
        next()
      } else {
        const redirect = process.env.BASE_URL + to.path
        router.app.$keycloak.login({ redirectUri: redirect })
      }
    } else {
      next()
    }
  })
}
