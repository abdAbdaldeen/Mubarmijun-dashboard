export const state = () => ({
  groups: {},
  groupsArr: [],
});

export const mutations = {
  add(state, groups) {
    state.groups = groups;
    state.groupsArr = Object.values(groups);
  },
  addOne(state, group) {
    state.groupsArr = [...state.groupsArr, group];
  },
  updateOne(state, data) {
    let arr = state.groupsArr;
    arr[data.index] = data.group;
    state.groupsArr = arr;
  },
};
