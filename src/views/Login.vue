<template>
  <v-app class="login" :style="{ background: `${selfLoginStyle.loginBg}` }">
    <!-- Logo -->
    <v-img
      class="logo"
      :style="{
        top: `${selfLoginStyle.logoInfo.logoSite.top}px`,
        right: `${selfLoginStyle.logoInfo.logoSite.right}px`
      }"
      max-height="50"
      max-width="160"
      :src="selfLoginStyle.logoInfo.logoPic"
    ></v-img>
    <!-- 登录模块 -->
    <div class="login_container">
      <!-- tab切换部分 -->
      <div class="tab_con">
        <div
          :class="[tabId === item.id ? 'tab_item active' : 'tab_item']"
          @click="curTab(item)"
          v-for="item in tabLists"
          :key="item.id"
          :style="{
            backgroundColor: `${selfLoginStyle.loginFrame.loginBgColor}`,
            opacity: `${selfLoginStyle.loginFrame.loginBgOpcity}`,
            color: `${selfLoginStyle.loginFrame.loginFontColor}`
          }"
        >
          {{ item.name }}
        </div>
      </div>
      <!-- tab切换对应的内容部分 -->
      <div
        class="tab_display"
        :style="{
          backgroundColor: `${selfLoginStyle.loginFrame.loginBgColor}`,
          opacity: `${selfLoginStyle.loginFrame.loginBgOpcity}`
        }"
      >
        <!-- 左侧登陆部分 -->
        <div class="form_con">
          <div class="form_main" v-for="item in tabLists" :key="item.id">
            <div
              class="form_title"
              :style="{ color: `${selfLoginStyle.loginFrame.loginHighLight}` }"
              v-if="tabId === item.id"
            >
              {{ item.name }}
            </div>
          </div>
          <div class="form_context">
            <button v-if="verifyResult" class="verify_notice">
              用户名或密码错误
            </button>
            <v-alert v-if="loginWarn" class="login_warn" type="warning">
              用户名、密码不能为空
            </v-alert>
            <div class="form_username">
              <label
                :style="{
                  color: `${selfLoginStyle.loginFrame.loginFontColor}`
                }"
                >用户名</label
              >
              <input type="text" v-model="userName" value="userName" />
            </div>
            <div class="form_pwd">
              <label
                :style="{
                  color: `${selfLoginStyle.loginFrame.loginFontColor}`
                }"
                >密码</label
              >
              <input type="password" v-model="passWord" value="passWord" />
            </div>
            <button
              class="submit"
              @click="submit(curTabItem, userName, passWord)"
              :style="{
                backgroundColor: `${selfLoginStyle.loginFrame.loginHighLight}`
              }"
            >
              登录
            </button>
          </div>
        </div>
        <!-- 右侧使用说明部分 -->
        <div class="use_construction_con">
          <div class="use_title" :style="{ color: `${selfLoginStyle.loginFrame.loginHighLight}` }">
            使用说明
          </div>
          <div
            class="use_content"
            :style="{ color: `${selfLoginStyle.loginFrame.loginFontColor}` }"
          >
            这里是使用说明文档，这里是使用说明文档，这里是使用说明文档，这里是使用说明文档，这里是使用说明文档，
            这里是使用说明文档，这里是使用说明文档，这里是使用说明文档，这里是使用说明文档，这里是使用说明文档，
            这里是使用说明文档，这里是使用说明文档，这里是使用说明文档，这里是使用说明文档，这里是使用说明文档，
            这里是使用说明文档，这里是使用说明文档。
          </div>
        </div>
      </div>
    </div>

    <!-- 底部版权文字 -->
    <div class="foot_content">
      {{ selfLoginStyle.footContent }}
    </div>
  </v-app>
</template>

<script>
// import { api_request } from "@/util/network";
import NodeRSA from "node-rsa";
import api from "@/api/login";

export default {
  name: "login",
  data() {
    return {
      selfLoginStyle: {
        loginBg: "red",
        logoInfo: {
          logoPic: "/assets/logo.png",
          logoSite: {
            top: 50,
            right: 50
          }
        },
        loginFrame: {
          loginBgColor: "#eee",
          loginBgOpcity: 0.9,
          loginFontColor: "red",
          loginHighLight: "cyan"
        },
        footContent: "版权所有 北京瑞智康诚科技有限公司 2021"
      },
      tabId: null,
      curTabItem: {},
      tabLists: [],
      userName: "",
      passWord: "",
      verifyResult: false,
      loginWarn: false
    };
  },
  created() {
    this.getSelfDefinedStyle();
    this.getLogin();
  },
  methods: {
    async getSelfDefinedStyle() {
      const res = await api.selfDefinedStyle();
      if (res.status) {
        let {
          loginBg,
          logoInfo: {
            logoPic,
            logoSite: { top, right }
          },
          loginFrame: { loginBgColor, loginBgOpcity, loginFontColor, loginHighLight },
          footContent
        } = res.data;
        this.selfLoginStyle.loginBg = `url(${loginBg}) 100% 100% no-repeat`;
        this.selfLoginStyle.logoInfo.logoPic = logoPic;
        this.selfLoginStyle.logoInfo.top = top;
        this.selfLoginStyle.logoInfo.right = right;
        this.selfLoginStyle.loginFrame.loginBgColor = loginBgColor;
        this.selfLoginStyle.loginFrame.loginBgOpcity = loginBgOpcity;
        this.selfLoginStyle.loginFrame.loginFontColor = loginFontColor;
        this.selfLoginStyle.loginFrame.loginHighLight = loginHighLight;
        this.selfLoginStyle.footContent = footContent;
      }
    },
    async getLogin() {
      let res = await api.login();
      if (res.code === "ok") {
        this.tabLists = res.data.credential_sources.concat(res.data.browser_sources);
        this.tabId = this.tabLists[0].id;
        this.curTabItem = this.tabLists[0];
      }
    },
    curTab(curItem) {
      if (curItem.link) {
        location.href = curItem.link;
      }
      this.tabId = curItem.id;
      this.curTabItem = curItem;
      this.userName = "";
      this.passWord = "";
      this.verifyResult = false;
    },

    async submit(curTabItem, userName, passWord) {
      if (userName.trim() === "" || passWord.trim() === "") {
        this.loginWarn = true;
        setTimeout(() => {
          this.loginWarn = false;
        }, 2000);
        return;
      }
      let loginUserNameKey = curTabItem.fields[0];
      let loginPwsKey = curTabItem.fields[1];
      let loginDatas = {
        [loginUserNameKey]: userName,
        [loginPwsKey]: passWord
      };
      let credentials = Object.assign({}, loginDatas);
      if (credentials["password"] !== undefined) {
        let config = this.$store.state.config;
        let password_key = new NodeRSA(config.password_key, {
          encryptionScheme: "pkcs1"
        });
        let message = credentials["password"] + config.password_challenge;
        credentials["password"] = btoa(
          String.fromCharCode.apply(null, password_key.encrypt(message))
        );
      }

      let res = await api.loginFinish(curTabItem.id, credentials);
      if (res.code === "ok") {
        let userInfo = {
          login_name: res.data.identity.claims.login_name,
          role: res.data.identity.claims.role,
          emailaddress: res.data.identity.claims.emailaddress
        };
        this.$store.dispatch("setUserInfo", userInfo);
        this.$router.push({name: "Home"});
      }
    }
  }
};
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  min-width: 1200px;
  min-height: 800px;

  .logo {
    position: absolute;
  }

  .login_container {
    width: 70%;
    height: 40%;
    min-width: 1100px;
    min-height: 500px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.9;
    .tab_con {
      display: flex;
      .tab_item {
        padding: 4px 20px;
        font-size: 14px;
        height: 37px;
        line-height: 37px;
        text-align: center;
        box-sizing: border-box;
        border: 1px solid rgb(216, 208, 208);
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        cursor: pointer;
      }
      .tab_item:not(:first-child) {
        border-left-style: none;
      }
      .tab_item.active {
        border-bottom: none;
      }
    }
    .tab_display {
      width: 100%;
      height: 95%;
      border-top-right-radius: 8px;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
      background: #eee;
      display: flex;
      align-items: center;
      .form_con {
        width: 480px;
        height: 400px;
        border-right: 2px dotted gray;
        box-sizing: border-box;
        padding: 20px 30px;
        text-align: center;
        .form_main {
          .form_title {
            font-size: 22px;
            font-weight: 500;
          }
        }
        .form_context {
          width: 360px;
          margin: 40px auto 0;
          .verify_notice {
            width: 360px;
            height: 50px;
            border-radius: 10px;
            background: #f0d281;
            color: #e17c57;
            margin-bottom: 20px;
          }
          .login_warn {
            height: 50px;
          }

          div {
            display: flex;
            height: 50px;
            align-items: flex-start;
            margin-bottom: 20px;
            label {
              flex: 0 0 60px;
              text-align: right;
              font-size: 20px;
              font-weight: 400;
            }
            input {
              width: 280px;
              height: 40px;
              box-sizing: border-box;
              border-radius: 10px;
              margin-left: 20px;
              padding-left: 20px;
              border: 1px solid gray;
              background: #fff;
              outline: none;
            }
          }
          .submit {
            width: 280px;
            height: 40px;
            margin-top: 20px;
            border-radius: 10px;
            float: right;
            background: blue;
            font-size: 20px;
            color: #fff;
          }
        }
      }
      .use_construction_con {
        flex: 1;
        height: 360px;
        box-sizing: border-box;
        padding: 0px 6%;
        .use_title {
          text-align: center;
          font-size: 24px;
          font-weight: 500;
          margin-bottom: 30px;
        }
        .use_content {
          text-indent: 2em;
          line-height: 2;
          font-size: 14px;
        }
      }
    }
  }

  .foot_content {
    width: 100%;
    position: absolute;
    font-size: 12px;
    color: #fff;
    text-align: center;
    bottom: 30px;
  }
}
</style>
