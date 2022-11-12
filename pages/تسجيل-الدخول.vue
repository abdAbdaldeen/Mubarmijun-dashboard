<template :class="isRTL ? 'float-left' : 'float-right'">
  <div class="container">
    <card class="SICard">
      <form ref="form" class="SIForm">
        <h1>تسجيل الدخول</h1>
        <el-alert
          v-if="errorMsg"
          :title="errorMsg"
          type="error"
          show-icon>
        </el-alert>
        <base-input
          class="input"
          :class="{ 'text-right': isRTL }"
          v-model="email"
          required
          type="text"
          label="البريد الالكتروني"
          placeholder="البريد الالكتروني"
          :rule="emailRules"
        >
        </base-input>
        <base-input
          class="input"
          :class="{ 'text-right': isRTL }"
          v-model="password"
          prop="password"
          required
          type="password"
          :rule="[passwordRules.required, passwordRules.min]"
          label="كلمة المرور"
          placeholder="كلمة المرور"
        >
        </base-input>
        <el-button type="primary" :class="{ 'float-right': isRTL }" @click="submit" :loading="loading"
          >تسجيل الدخول</el-button
        >
      </form>
    </card>
  </div>
</template>

<script>
import Card from "~/components/Cards/Card.vue";
import { Button, Alert } from "element-ui";
export default {
  layout: "signIn",
  components: {
    Card,
    [Button.name]: Button,
    [Alert.name]: Alert,

  },
  data: () => ({
    valid: false,

    email: "",
    emailRules: [
      (v) => !!v || "البريد الإلكتروني مطلوب",
      (v) => /.+@.+/.test(v) || "يجب ان يكون البريد الاكتروني صحيح",
    ],
    password: "",
    show: false,
    passwordRules: {
      required: (value) => !!value || "كلمة المرور مطلوبة",
      min: (v) => (v && v.length >= 8) || "Min 8 characters",
      emailMatch: () => `The email and password you entered don't match`,
    },
    errorMsg: "",
    loading: false,
  }),
  methods: {
    async submit() {
      try {
        this.loading = true
        this.errorMsg = ""
        const res = await this.$axios.post('users/login', {
          email: this.email,
          password: this.password,
        })
        if (res.data.isAdmin) {
          this.$store.commit('user/login', res.data)
          this.$cookies.set('authToken', res.data.token, {
            path: '/',
            maxAge: 60 * 60
          })
          this.$router.push('/%D8%A7%D9%84%D8%A3%D8%B3%D8%A6%D9%84%D8%A9')
        } else {
          // TODO: not admin
        }
      } catch (error) {
        const msg =
          error.response && error.response.data && error.response.data.error
        this.errorMsg =
          msg || 'عذرا لقد حدث خطأ غير معروف، يرجى المحاولة مرة أخرى'
        this.loading = false
      }
    },
  },
  mounted() {
    this.$rtl.enableRTL();
  },
  computed: {
    enableRTL() {
      return this.$route.query.enableRTL;
    },
    isRTL() {
      return this.$rtl.isRTL;
    },
  },
  beforeDestroy() {
    this.switchLocalePath("en");
    this.$rtl.disableRTL();
  },
};
</script>

<style lang="scss">
.container {
  display: flex;
  align-items: center;
  min-height: 100vh;
  .SICard {
    margin: auto;
    max-width: 25rem;
    .SIForm {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 1rem;
      padding: 1rem;
      .input {
        padding: 0.5rem;
        min-width: 15rem;
      }
    }
  }
}
</style>
