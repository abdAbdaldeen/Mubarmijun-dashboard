<template>
  <div :class="isRTL ? 'float-right' : 'float-right'">
    <h1 :class="{ 'text-right': isRTL }">المجموعات</h1>
    <div>
      <h3 :class="{ 'text-right': isRTL }">اضافة مجموعة:</h3>
      <form class="AddCatForm">
        <el-input
          class="catName"
          :class="{ 'text-right': isRTL }"
          required
          type="text"
          label="اسم المجموعة "
          placeholder="اسم المجموعة "
        >
        </el-input>
        <el-input
          class="catImg"
          :class="{ 'text-right': isRTL }"
          prop="imgUrl"
          required
          type="text"
          label="صورة المجموعة "
          placeholder="صورة المجموعة "
        >
        </el-input>
        <el-button type="primary" :class="{ 'float-right': isRTL }"
          >اضافة
        </el-button>
      </form>
    </div>
    <br />
    <br />
    <div>
      <h3 :class="{ 'text-right': isRTL }">جدول المجموعات:</h3>
      <el-table style="width: 100%"  :data="tableData">
        <el-table-column align="right" label="الاسم" max-width="50" prop="name">
        </el-table-column>
        <el-table-column align="right" label="الصورة" max-width="50" prop="imgUrl">
        </el-table-column>

        <el-table-column align="right" min-width="150" label="الاجراءات">
          <template :class="{ 'text-right': isRTL }">
            <div>
              <el-button size="mini" @click="handleModify"> تعديل </el-button>

              <!-- <span> انتظر قليلاً ... </span> -->
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { Button, Table, TableColumn } from "element-ui";
export default {
  components: {
    [Button.name]: Button,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
   data() {
        return {
          tableData: [{
           
            name: 'html',
            imgUrl: 'url'
          }, {
            
            name: 'git',
            imgUrl: 'url'
          }, {
           
            name: 'php',
            imgUrl: 'url'
          }, {
           
            name: 'vue',
            imgUrl: 'url'
          }]
        }
      },
       methods: {
      handleModify() {
        console.log('click');
      }
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
};
</script>

<style lang="scss">
.AddCatForm {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}
</style>
