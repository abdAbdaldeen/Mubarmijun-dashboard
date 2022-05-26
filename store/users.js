export const state = () => ({
  data: {},
});

export const mutations = {
  add(state, data) {
    state.data = data;
  },
  // loadMore(state, data) {
  //   state.data.questions = { ...state.data.questions, ...data.questions };
  //   state.data.lastKey = data.lastKey;
  // },
  makeAdmin(state, data) {
    state.data.usersList[data.index].admin = !data.value;
  },
  blockUser(state, data) {
    state.data.usersList[data.index].disabled = !data.value;
  },
};
