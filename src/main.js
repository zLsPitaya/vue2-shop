// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyload from "vue-lazyload";
import infiniteScroll from 'vue-infinite-scroll';
import axios from 'axios';
axios.defaults.withCredentials = true; //配合服务端配置“res.header("Access-Control-Allow-Credentials", true);”不然服务器获取不到cookies
import Vuex from 'vuex';

Vue.use(infiniteScroll);
Vue.use(Vuex);
Vue.use(VueLazyload, {
    loading: "static/loading-svg/loading-bars.svg",
    //try: 3, //default 1
    attempt: 3
})
Vue.config.productionTip = false
const store = new Vuex.Store({
        state: {
            nickName: '',
            cartCount: 0
        },
        mutations: {
            //更新用户信息
            updateUserInfo(state, nickName) {
                state.nickName = nickName;
            },
            //更新购物车信息
            updateCartCount(state, cartCount) {
                if (!cartCount) {
                    state.cartCount = 0;
                } else {
                    state.cartCount += cartCount;
                }
            }
        }
    })
    /* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    mounted() {
        this.checkLogin();
        this.getCartCount();
    },
    methods: {
        checkLogin() {
            axios.get('/users/checkLogin').then(res => {
                var res = res.data;
                if (res.status == "0") {
                    this.$store.commit("updateUserInfo", res.result);
                } else {
                    if (this.$route.path != "/goods") {
                        this.$router.push("/goods");
                    }
                }
            })
        },
        getCartCount() {
            axios.get("/users/getCartCount").then(res => {
                var res = res.data;
                if (res.status == "0") {
                    this.$store.commit("updateCartCount", parseInt(res.result));
                }
            })
        }
    },
    template: '<App/>',
    components: { App }
})