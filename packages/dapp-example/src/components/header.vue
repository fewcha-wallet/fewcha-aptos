<template>
  <header class="header">
    <p v-if="!isConnect" @click="handleConnect">Connect to Fewcha Walle</p>
    <div v-else class="option">
      <p @click="hanldeDisConnect">Disconnect</p>
      <p>
        Balance
        <span class="balance"> ({{ balance }}) </span>
      </p>
    </div>
  </header>
</template>

<script>
export default {
  name: "HeaderComp",
  data: () => ({
    isConnect: false,
    balance: "",
    timeOut1: "",
  }),
  methods: {
    async handleConnect() {
      const response = await window?.fewcha?.connect();
      if (response.status === 200) {
        this.isConnect = true;
        const balance_value = await window?.fewcha?.getBalance();
        // console.log("b_v:", balance_value);
        if (balance_value.data && typeof balance_value.data === "string") {
          this.balance = balance_value.data;
        }
      }
    },
    async hanldeDisConnect() {
      await window?.fewcha?.disconnect();
      const isConnected = await window?.fewcha?.isConnected();
      // console.log("isConnected2: ", isConnected);
      this.isConnect = isConnected?.data;
    },

    async get_status_connect() {
      const status_connect = await window?.fewcha?.isConnected();
      // console.log("status_connect", status_connect);
      if (status_connect?.status === 200) {
        this.isConnect = status_connect?.data;
      }
    },
    async get_balance() {
      const balance_value = await window?.fewcha?.getBalance();
      // console.log("balance_value: ", balance_value);
      if (balance_value?.data && typeof balance_value?.data === "string") {
        this.balance = balance_value.data;
      }
    },
  },

  async created() {
    this.timeOut1 = setTimeout(() => {
      this.get_status_connect();
      this.get_balance();
    }, 500);
  },
  beforeDestroy() {
    clearInterval(this.timeIn1);
  },
};
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  column-gap: 24px;
  font-family: Arial, Helvetica, sans-serif;
  padding: 2px 20px;
  p {
    text-decoration: underline;
    font-weight: 700;
    font-size: 24px;
    line-height: 120%;
    color: blue;
    &:hover {
      cursor: pointer;
      color: red;
    }
  }
}
.option {
  display: flex;
  column-gap: 24px;
}
nav {
  display: flex;
  justify-content: center;
  gap: 24px;
  a {
    color: #333;
    font-weight: 700;
    font-size: 20px;
    line-height: 120%;
    text-decoration: none;
    font-weight: bold;
    color: #2c3e50;
    padding: 7px 12px;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>