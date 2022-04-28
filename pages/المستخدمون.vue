<template>
  <div :class="isRTL ? 'float-left' : 'float-right'">
    <h1 :class="{ 'text-right': isRTL }">جدول المستخدمين</h1>
    <input
      type="text"
      placeholder="ادخل اسم المسخدم"
      class="search"
      :class="{ 'float-right': isRTL }"
    />
    <el-table
      :data="
        tableData.filter(
          (data) =>
            !search || data.name.toLowerCase().includes(search.toLowerCase())
        )
      "
      style="width: 100%"
    >
      <el-table-column
        align="right"
        label="الاسم"
        prop="userName"
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
      <el-table-column align="right" label="تاريخ الانضمام" prop="date">
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
          <el-button size="mini" @click="handleBlock(scope.$index, scope.row)">
            حظر
          </el-button>
          <el-button
            size="mini"
            @click="handleMakeAdmin(scope.$index, scope.row)"
          >
            جعله مسؤول
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
  name: "answers",
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Button.name]: Button,
  },
  data() {
    return {
      tableData: [
        {
          date: "00/00/0000",
          userName: "محمد احمد",
          email: "user@anything",
          coins: "00",
        },
        {
          date: "00/00/0000",
          userName: "John",
          email: "user@anything",
          coins: "00",
        },
        {
          date: "00/00/0000",
          userName: "Morgan",
          email: "user@anything",
          coins: "00",
        },
        {
          date: "00/00/0000",
          userName: "Jessy",
          email: "user@anything",
          coins: "00",
        },
      ],
      search: "",
    };
  },
  methods: {
    handleBlock(index, row) {
      console.log(index, row);
    },
    handleMakeAdmin(index, row) {
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
      return true;
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
