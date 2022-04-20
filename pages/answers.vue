<template>
  <div :class="isRTL ? 'float-left' : 'float-right'">
    <el-table
      :data="
        tableData.filter(
          (data) =>
            !search || data.name.toLowerCase().includes(search.toLowerCase())
        )
      "
      style="width: 100%"
    >
      <el-table-column type="expand" :class="{ 'float-right': isRTL }">
        <template slot-scope="props">
          <p align="right">الاجابة : {{ props.row.body }}</p>
        </template>
      </el-table-column>
      <el-table-column align="right" label="عدد الاصوات" prop="votesNum">
      </el-table-column>
      <el-table-column
        align="right"
        label="الاسم"
        prop="userName"
        max-width="50"
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
  data() {
    return {
      tableData: [
        {
          votesNum: "100",
          userName: "محمد احمد",
          body: "السلام عليكم ",
        },
        {
          votesNum: "John",
          userName: "No. 189, Grove St, Los Angeles",
          body: "السلام عليكم ",
        },
        {
          votesNum: "Morgan",
          userName: "No. 189, Grove St, Los Angeles",
          body: "السلام عليكم ",
        },
        {
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
    handleDelete(index, row) {
      console.log(index, row);
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
