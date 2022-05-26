<template>
  <div :class="isRTL ? 'float-left' : 'float-right'">
    <!-- <input
      type="text"
      placeholder="ادخل رابط السؤال او عنوانه"
      class="search"
      :class="{ 'text-right': isRTL }"
    /> -->
    <el-input
      placeholder="Please input"
      class="input-with-select"
      v-model="search"
    >
      <el-button
        slot="append"
        icon="el-icon-search"
        @click="handleSearch"
      ></el-button>
    </el-input>
    <el-table :data="questionsArr" style="width: 100%">
      <el-table-column type="expand" :class="{ 'float-right': isRTL }">
        <template slot-scope="props">
          <p align="right">نص السؤال:</p>
          <div v-html="props.row.body"></div>
        </template>
      </el-table-column>
      <el-table-column align="right" label="العنوان" prop="title">
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
        prop="userRecord.displayName"
      >
      </el-table-column>
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
                !scope.row.userRecord.disabled ? "حظر السائل" : "الغاء الحظر"
              }}
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >حذف
            </el-button>
            
            <nuxt-link :to="'/الإجابات/' + scope.row.qID">
            <el-button
              size="mini"
              >
              الاجابات ->
            </el-button>
            </nuxt-link>
            <span> انتظر قليلاً ... </span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { Button, Table, TableColumn, link } from "element-ui";

export default {
  name: "questions",
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Button.name]: Button,
    [link.name]: link,
  },
  async asyncData({ $axios, store, error, redirect }) {
    return await $axios
      .$get("/admin/questions/get", {
        headers: {
          authorization: `Bearer ${store.state.user.token}`,
        },
      })
      .then((r) => {
        const questions = r.questions;
        const lastKey = r.lastKey;
        store.commit("questions/add", { questions, lastKey });
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
            dID: row.qID,
            collection: "questions",
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
      this.$store.commit("questions/updateReportsCount", {
        reportsCount,
        index,
      });
      document.querySelector(`#actions-${index}`).classList.remove("loading");
    },
    async handleBlock(index, row) {
      document.querySelector(`#actions-${index}`).classList.add("loading");
      let uid = this.questionsArr[index].userRecord.uid;
      let value = this.questionsArr[index].userRecord.disabled || "";
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
      r && this.$store.commit("questions/blockUser", { index, value });
      document.querySelector(`#actions-${index}`).classList.remove("loading");
    },
    async handleDelete(index, row) {
      document.querySelector(`#actions-${index}`).classList.add("loading");
      await this.$axios
        .$post(
          "/admin/questions/delete",
          {
            qID: row.qID,
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
    async handleSearch() {
      try {
        let qID = this.search;
        let r = await this.$axios.$get("/admin/questions/getOne", {
          params: {
            qID,
          },
          headers: {
            authorization: `Bearer ${this.$store.state.user.token}`,
          },
        });
        let questions = {};
        questions[r.question.qID] = r.question;
        this.$store.commit("questions/add", { questions, lastKey: "" });
      } catch (error) {
        console.error(error);
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
      return true;
    },
    data() {
      return this.$store.state.questions.data;
    },
    questionsArr() {
      return Object.values(this.data.questions);
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
.hidedDoc {
  color: red;
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
