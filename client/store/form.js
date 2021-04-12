import axios from 'axios'

export const SUBMIT_FORM = 'SUBMIT_FORM'
export const GET_SCORE = 'GET_SCORE'

export const submitForm = text => ({
  type: SUBMIT_FORM,
  text
})
export const fetchScore = score => ({
  type: GET_SCORE,
  score
})

export const _submitForm = text => async dispatch => {
  try {
    const {data} = await axios.post('/api/home', text)
    dispatch(submitForm(data))
  } catch (err) {
    console.log(err)
  }
}
export const _getScore = () => async dispatch => {
  try {
    const {data} = await axios.get('/api/home')
    console.log('THIS IS DATA', data)
    dispatch(fetchScore(data))
  } catch (err) {
    console.log(err)
  }
}

const initialState = []

const formReducer = (state = initialState, action) => {
  switch (action.type) {
    case SUBMIT_FORM:
      return [...state, action.text]
    case GET_SCORE:
      return action.score
    default:
      return state
  }
}

export default formReducer
