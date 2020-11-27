import VueNativeSock from 'vue-native-websocket'
import Vue from 'vue'
import store from 'src/store'

Vue.use(VueNativeSock, 'wss://echo.websocket.org', { store: store })
