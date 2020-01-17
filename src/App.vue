<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import local from '@/assets/commenJs/local'
export default {
  name: 'App',
  data() {
    return {
      user: {}
    }
  },
  created() {
    this.user = local.get('hou');
    if (this.user.shopNum) {
      // this.queryId = id;
      
    } else {
      this.logout();
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
  }
}
</script>
