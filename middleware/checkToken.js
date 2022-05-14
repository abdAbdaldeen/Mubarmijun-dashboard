export default async function ({ store, app, $axios, redirect, route }) {
  const token = app.$cookies.get('authToken')
  if (token) {
    await $axios
      .$get('users/get', {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const data = {
          token,
          email: res.email,
          displayName: res.displayName,
          photoURL: res.photoURL,
          coins: res.coins,
        }
        store.commit('user/login', data)
      })
      .catch((e) => {
        console.error(e)
        store.commit('user/logout')
        app.$cookies.remove('authToken')
      })
  } else {
    if (route.name == 'تسجيل-الدخول') {
      return;
    }
    redirect('تسجيل-الدخول')

  }
}
