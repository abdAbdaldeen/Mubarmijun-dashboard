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
          v-model="name"
        >
        </el-input>
        <input
          @change="onFileChange"
          id="addFormImg"
          type="file"
          name="myImage"
          accept="image/*"
        />
        <div id="preview">
          <img v-show="url" id="inputImg" class="groupImg" />
        </div>
        <el-button
          type="primary"
          @click="handleAddGroupForm"
          :loading="loading"
          :class="{ 'float-right': isRTL }"
          >اضافة
        </el-button>
      </form>
    </div>
    <br />
    <br />
    <div>
      <h3 :class="{ 'text-right': isRTL }">جدول المجموعات:</h3>
      <el-table style="width: 100%" :data="data.groupsArr">
        <el-table-column align="right" label="الاسم" max-width="50" prop="name">
        </el-table-column>
        <el-table-column align="right" label="الصورة" max-width="50">
          <template slot-scope="scope">
            <!-- prop="imgUrl" -->
            <img :src="scope.row.imgUrl" alt="" class="groupImg" />
          </template>
        </el-table-column>

        <el-table-column align="right" min-width="150" label="الاجراءات">
          <template slot-scope="scope" :class="{ 'text-right': isRTL }">
            <div>
              <el-button
                size="mini"
                @click="handleOpenDialog(scope.$index, scope.row)"
              >
                تعديل
              </el-button>

              <!-- <span> انتظر قليلاً ... </span> -->
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="تعديل التصنيف"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleCloseDialog"
    >
      <div>
        <el-input
          class="catName"
          :class="{ 'text-right': isRTL }"
          required
          type="text"
          label="اسم المجموعة "
          placeholder="اسم المجموعة "
          v-model="name"
        >
        </el-input>
        <input
          @change="onFileChange"
          type="file"
          name="myImage"
          accept="image/*"
        />
        <div id="preview">
          <img :src="img" id="dInputImg" class="groupImg" />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseDialog">الغاء</el-button>
        <el-button
          type="primary"
          @click="handleUpdateGroup"
          :loading="loading"
          :class="{ 'float-right': isRTL }"
          >تعديل
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Button, Table, TableColumn, Dialog } from "element-ui";
export default {
  components: {
    [Button.name]: Button,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dialog.name]: Dialog,
  },
  async asyncData({ $axios, store, error, redirect }) {
    return await $axios
      .$get("groups/get")
      .then((r) => {
        store.commit("groups/add", r);
      })
      .catch((e) => {
        console.error(e);
        // error({ statusCode: 404, message: 'Post not found' });
      });
  },
  data() {
    return {
      name: "",
      img: "",
      loading: false,
      url: null,
      dialogVisible: false,
      imgID: "",
      uIndex: "",
    };
  },
  methods: {
    onFileChange(e) {
      const file = e.target.files[0];
      let url = URL.createObjectURL(file);
      this.url = url;
      const image = document.getElementById(this.imgID || "inputImg");
      image.setAttribute("src", url);

      // If the image has already loaded, let's go!
      if (image.complete) this.toDataURL(image);
      // Wait for the image to load before converting
      else image.onload = this.toDataURL;
    },
    toDataURL() {
      const image = document.getElementById(this.imgID || "inputImg");

      const canvas = document.createElement("canvas");

      // We use naturalWidth and naturalHeight to get the real image size vs the size at which the image is shown on the page
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      // We get the 2d drawing context and draw the image in the top left
      canvas.getContext("2d").drawImage(image, 0, 0);

      // Convert canvas to DataURL and log to console
      const dataURL = canvas.toDataURL();
      this.img = dataURL;
    },
    // ================
    handleCloseDialog() {
      this.imgID = this.name = this.img = this.uIndex = "";
      this.dialogVisible = false;
    },
    handleOpenDialog(index, row) {
      this.dialogVisible = true;
      this.imgID = "dInputImg";
      this.name = row.name;
      this.img = row.imgUrl;
      this.uIndex = index;
    },
    async handleUpdateGroup() {
      this.loading = true;
      let group = await this.addGroup(this.name, this.img);
      if (group) {
        // this.$store.commit("groups/updateOne", {group,index: this.uIndex});
        // this.handleCloseDialog()
        location.reload();
      }
    },
    // ================

    async handleAddGroupForm() {
      // TODO: chick if name and img is not empty
      this.loading = true;
      let group = await this.addGroup(this.name, this.img, true);
      this.loading = false;
      if (group) {
        document.querySelector("#addFormImg").value = [];
        this.name = this.img = this.url = "";
        this.$store.commit("groups/addOne", group);
        let node = document.querySelector(".main-panel");
        node.scrollTop = node.scrollHeight;
      }
    },
    async addGroup(name, imgUrl, isUpdate = false) {
      return await this.$axios
        .$post(
          "/admin/groups/add",
          {
            name,
            imgUrl,
            isUpdate,
          },
          {
            headers: {
              authorization: `Bearer ${this.$store.state.user.token}`,
            },
          }
        )
        .then((r) => {
          return r;
        })
        .catch((e) => {
          console.error(e);
          return 0;
          // error({ statusCode: 404, message: 'Post not found' });
        });
      // this.$store.commit("questions/updateReportsCount", {
      //   reportsCount,
      //   index,
      // });
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
      return this.$store.state.groups;
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
.groupImg {
  object-fit: cover;
  width: 70px;
  height: 70px;
}
.v-modal[style] {
  z-index: -1 !important;
}
</style>
