<template>
  <div :class="isRTL ? 'float-left' : 'float-right'">
    <input
      type="text"
      placeholder="ادخل رابط السؤال او عنوانه"
      class="search"
      :class="{ 'text-right': isRTL }"
    />
    <el-input placeholder="Please input" class="input-with-select">
    <el-button slot="append" icon="el-icon-search"></el-button>
  </el-input>
    <el-table
      :data="Object.values(data.questions)"
      style="width: 100%"
    >
      <el-table-column type="expand" :class="{ 'float-right': isRTL }">
        <template slot-scope="props">
          <p align="right">نص السؤال:</p>
          <div v-html="props.row.body"></div>
        </template>
      </el-table-column>
      <el-table-column align="right" label="العنوان" prop="title">
      </el-table-column>
      <el-table-column align="right" label="عدد الاصوات" prop="votesCount" max-width="70"/>
      <el-table-column align="right" label="عدد الابلاغات" prop="reportsCount" max-width="70"/>
      <el-table-column
        align="right"
        label="الاسم"
        prop="userRecord.displayName"
        
      >
      </el-table-column>
      <el-table-column align="right" min-width="100" label="الاجراءات">
        <template slot-scope="scope" :class="{ 'text-right': isRTL }">
          <el-button size="mini" @click="handleHide(scope.$index, scope.row)">
            اخفاء
          </el-button>
          <el-button size="mini" @click="handleBlock(scope.$index, scope.row)">
            حظر السائل
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >حذف
          </el-button>
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
  async asyncData({ $axios, store, error, redirect }) {
    return await $axios
      .$get('/admin/questions/get',{
              headers: {
                authorization: `Bearer ${store.state.user.token}`,
              },
            })
      .then((r) => {
        const questions = r.questions
        const lastKey = r.lastKey
        store.commit('questions/add', { questions, lastKey })
      })
      .catch((e) => {
        console.error(e)
        // error({ statusCode: 404, message: 'Post not found' });
      })
  },
  data() {
    return {
      tableData: [
        {
          title: "عنوان السؤال",
          votesNum: "100",
          userName: "محمد احمد",
          body: "السلام عليكم ",
        },
        {
          title: "2016-05-02",
          votesNum: "John",
          userName: "No. 189, Grove St, Los Angeles",
          body: "السلام عليكم ",
        },
        {
          title: "2016-05-04",
          votesNum: "Morgan",
          userName: "No. 189, Grove St, Los Angeles",
          body: "السلام عليكم ",
        },
        {
          title: "2016-05-01",
          votesNum: "Jessy",
          userName: "No. 189, Grove St, Los Angeles",
          body: "السلام عليكم ",
        },
      ],
      search: "",
    };
  },
  methods: {
    handleHide(index, row) {
      console.log(index, row);
    },
    handleBlock(index, row) {
      console.log(index, row);
    },
    async handleDelete(index, row) {
      await this.$axios
      .$post('/admin/questions/delete',{
        qID: row.qID
      },{
              headers: {
                authorization: `Bearer ${this.$store.state.user.token}`,
              },
            })
      .then((r) => {
        console.log(r)
      })
      .catch((e) => {
        console.error(e)
        // error({ statusCode: 404, message: 'Post not found' });
      })
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
      return this.$store.state.questions.data
    },
  },
  beforeDestroy() {
    // this.switchLocalePath("en");
    // this.$rtl.disableRTL();
  },
};
</script>
<style>
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
</style>
