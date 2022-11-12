export const state = () => ({
  data: {},
});

export const mutations = {
  add(state, data) {
    state.data = data;
    state.data.questionsArr = Object.values(data.questions);
  },
  loadMore(state, data) {
    state.data.questions = { ...state.data.questions, ...data.questions };
    state.data.lastKey = data.lastKey;
  },
  updateReportsCount(state, data) {
    state.data.questionsArr[data.index].reportsCount = data.reportsCount;
  },
  delete(state, data) {
    var newArr = Array.from(state.data.questionsArr);
    newArr.splice(data.index, 1);
    state.data.questionsArr = newArr;
  },
  blockUser(state, data) {
    state.data.questionsArr[data.index].userRecord.disabled = !data.value;
  },
};
