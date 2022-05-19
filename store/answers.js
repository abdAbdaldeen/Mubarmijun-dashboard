export const state = () => ({
  data: {},
});

export const mutations = {
  add(state, data) {
    state.data = data;
  },
  loadMore(state, data) {
    state.data.questions = { ...state.data.questions, ...data.questions };
    state.data.lastKey = data.lastKey;
  },
  updateReportsCount(state, data) {
    state.data[data.index].reportsCount = data.reportsCount;
  },
  delete(state, data) {
    var newArr = Array.from(state.data.questionsArr);
    newArr.splice(data.index, 1);
    state.data = newArr;
  },
  blockUser(state, data) {
    state.data[data.index].disabled = !data.value;
  },
};
