export const state = () => ({
  data: {},
})

export const mutations = {
  add(state, data) {
    state.data = data
  },
  loadMore(state, data) {
    state.data.questions = [...state.data.questions, ...data.questions]
    state.data.lastKey = data.lastKey
  },
}
