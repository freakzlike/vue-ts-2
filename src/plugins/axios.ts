import axios from 'axios'

/* istanbul ignore next */
if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = 'http://localhost:8000'
}

export default axios
