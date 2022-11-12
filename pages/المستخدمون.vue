<template>
  <div :class="isRTL ? 'float-left' : 'float-right'">
    <h1 :class="{ 'text-right': isRTL }">جدول المستخدمين</h1>
    <!-- <input
      type="text"
      placeholder="ادخل اسم المسخدم"
      class="search"
      :class="{ 'float-right': isRTL }"
    /> -->
    <el-table :data="data.usersList" style="width: 100%">
      <el-table-column
        align="right"
        label="الاسم"
        prop="displayName"
        max-width="50"
      >
      </el-table-column>
      <el-table-column
        align="right"
        label="البريد الالكتروني"
        prop="email"
        max-width="50"
      >
      </el-table-column>
      <el-table-column
        align="right"
        label="تاريخ الانضمام"
        prop="metadata.creationTime"
      >
      </el-table-column>
      <el-table-column
        align="right"
        label="آخر تسجيل دخول"
        prop="metadata.lastSignInTime"
      >
      </el-table-column>

      <el-table-column
        align="right"
        label="عدد العملات"
        prop="coins"
        max-width="50"
      >
      </el-table-column>

      <el-table-column align="right" min-width="150" label="الاجراءات">
        <template slot-scope="scope" :class="{ 'text-right': isRTL }">
          <div :id="'actions-' + scope.$index" class="actionsContainer">
            <el-button
              size="mini"
              @click="handleBlock(scope.$index, scope.row)"
            >
              {{ scope.row.disabled ? "الغاء الحظر" : "حظر" }}
            </el-button>
            <el-button
              size="mini"
              @click="handleMakeAdmin(scope.$index, scope.row)"
            >
              {{ scope.row.admin ? "سحب الصلاحيات" : "جعله مسؤول" }}
            </el-button>
            <span> انتظر قليلاً ... </span>
          </div>
          <!-- <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >حذف
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { Button, Table, TableColumn } from "element-ui";

export default {
  name: "answers",
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Button.name]: Button,
  },
  async asyncData({ $axios, store, error, redirect }) {
    return await $axios
      .$get("/admin/users/get", {
        headers: {
          authorization: `Bearer ${store.state.user.token}`,
        },
      })
      .then((r) => {
        const usersList = r.usersList;
        const nextPageToken = r.nextPageToken;
        store.commit("users/add", { usersList, nextPageToken });
      })
      .catch((e) => {
        console.error(e);
        // error({ statusCode: 404, message: 'Post not found' });
      });
  },
  data() {
    return {
      search: "",
    };
  },
  methods: {
    async handleBlock(index, row) {
      document.querySelector(`#actions-${index}`).classList.add("loading");
      let uid = this.data.usersList[index].uid;
      let value = this.data.usersList[index].disabled || "";
      let r = await this.$axios
        .$get("/admin/blockUser", {
          params: {
            uid,
            value,
          },
          headers: {
            authorization: `Bearer ${this.$store.state.user.token}`,
          },
        })
        .then((r) => {
          return 1;
        })
        .catch((e) => {
          console.error(e);
          return 0;
          // error({ statusCode: 404, message: 'Post not found' });
        });
      r && this.$store.commit("users/blockUser", { index, value });
      document.querySelector(`#actions-${index}`).classList.remove("loading");
    },
    async handleMakeAdmin(index, row) {
      document.querySelector(`#actions-${index}`).classList.add("loading");
      let uid = this.data.usersList[index].uid;
      let value = this.data.usersList[index].admin || "";
      let r = await this.$axios
        .$post(
          "/admin/users/addAdmin",
          {
            uid,
            value,
          },
          {
            headers: {
              authorization: `Bearer ${this.$store.state.user.token}`,
            },
          }
        )
        .then((r) => {
          return 1;
        })
        .catch((e) => {
          console.error(e);
          return 0;
          // error({ statusCode: 404, message: 'Post not found' });
        });
      r && this.$store.commit("users/makeAdmin", { index, value });
      document.querySelector(`#actions-${index}`).classList.remove("loading");
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
      return true;
    },
    data() {
      return this.$store.state.users.data;
    },
  },
  beforeDestroy() {
    // this.switchLocalePath("en");
    // this.$rtl.disableRTL();
  },
};
</script>
<style lang="scss">
.search {
  margin: auto;
  margin-bottom: 2rem;
  padding: 0.5rem;
  width: 30rem;
  height: 2.5rem;
  border-radius: 20px;
}
.table-transparent {
  background-color: transparent !important;
}

.actionsContainer {
  & > span {
    display: none;
  }
}
.actionsContainer.loading {
  & > span {
    display: block;
  }
  button {
    display: none;
  }
}
</style>
