<template>
  <div :class="isRTL ? 'float-left' : 'float-right'">
    <el-table
      :data="data"
      style="width: 100%"
    >
      <el-table-column type="expand" :class="{ 'float-right': isRTL }">
        <template slot-scope="props">
          <p align="right">الاجابة:</p>
          <div v-html="props.row.body"></div>
        </template>
      </el-table-column>
      <el-table-column
        align="right"
        label="عدد الاصوات"
        prop="votesCount"
        max-width="70"
      />
      <el-table-column align="right" label="عدد الابلاغات" max-width="70">
        <template slot-scope="props">
          <span
            v-if="props.row.reportsCount != 1000"
            :class="{ hidedDoc: props.row.reportsCount >= 10 }"
          >
            {{ props.row.reportsCount }}
          </span>
          <span class="hidedDoc" v-else> تم اخفاء السؤال من قبل مشرف </span>
        </template>
      </el-table-column>
      <el-table-column
        align="right"
        label="الاسم"
        prop="uName"
      />
            <el-table-column align="right" min-width="100" label="الاجراءات">
        <template slot-scope="scope" :class="{ 'text-right': isRTL }">
          <div :id="'actions-' + scope.$index" class="actionsContainer">
            <el-button
              size="mini"
              @click="handleHide(scope.$index, scope.row)"
            >
              {{ scope.row.reportsCount >= 10 ? "اظهار" : "اخفاء" }}
            </el-button>
            <el-button
              size="mini"
              @click="handleBlock(scope.$index, scope.row)"
            >
              {{
                !scope.row.disabled ? "حظر المستخدم" : "الغاء الحظر"
              }}
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >حذف
            </el-button>
            <span> انتظر قليلاً ... </span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { Button, Table, TableColumn } from "element-ui";

export default {
  name: "questions",
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Button.name]: Button,
  },
  async asyncData({ $axios, store, error, redirect, route }) {
    return await $axios
      .$get("/admin/answers/get", {
        params: {
          qID: route.params.id,
        },
        headers: {
          authorization: `Bearer ${store.state.user.token}`,
        },
      })
      .then((r) => {
        console.log(r)
        store.commit("answers/add", r);
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
    async handleHide(index, row) {
      document.querySelector(`#actions-${index}`).classList.add("loading");
      await this.$axios
        .$post(
          "/admin/hideDoc",
          {
            dID: row.aID,
            collection: "answers",
            reportsCount: row.reportsCount,
          },
          {
            headers: {
              authorization: `Bearer ${this.$store.state.user.token}`,
            },
          }
        )
        .then((r) => {
          console.log(r);
        })
        .catch((e) => {
          console.error(e);
          // error({ statusCode: 404, message: 'Post not found' });
        });
      let reportsCount = row.reportsCount < 10 ? 1000 : 0;
      this.$store.commit("answers/updateReportsCount", {
        reportsCount,
        index,
      });
      document.querySelector(`#actions-${index}`).classList.remove("loading");
    },
    async handleBlock(index, row) {
      document.querySelector(`#actions-${index}`).classList.add("loading");
      let uid = this.data[index].userID;
      let value = this.data[index].disabled || "";
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
      r && this.$store.commit("answers/blockUser", { index, value });
      document.querySelector(`#actions-${index}`).classList.remove("loading");
    },
    async handleDelete(index, row) {
      document.querySelector(`#actions-${index}`).classList.add("loading");
      await this.$axios
        .$post(
          "/admin/deleteDoc",
          {
            docID: row.aID,
            collection: 'answers'
          },
          {
            headers: {
              authorization: `Bearer ${this.$store.state.user.token}`,
            },
          }
        )
        .then((r) => {
          document
            .querySelector(`#actions-${index}`)
            .closest("tr").style.display = "none";
          return 1;
        })
        .catch((e) => {
          console.error(e);
          return 0;
          // error({ statusCode: 404, message: 'Post not found' });
        });
      // true && this.$store.commit('questions/delete',{index})
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
      return this.$store.state.answers.data;
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
