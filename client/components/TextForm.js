import React from 'react'
import {connect} from 'react-redux'
import {_submitForm} from '../store/form'

export class TextForm extends React.Component {
  constructor() {
    super()
    this.state = {
      formText: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  handleSubmit(event) {
    event.preventDefault()
    this.props.postForm(this.state)
    this.setState({
      formText: ''
    })
  }
  render() {
    return (
      <div>
        <div className="card">
          <form onSubmit={this.handleSubmit}>
            <div className="container">
              <label htmlFor="formText">Text:</label>
              <input
                type="text"
                placeholder="Write something.."
                name="formText"
                value={this.state.formText}
                onChange={this.handleChange}
              />
              <button type="submit">Analyze</button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

const mapState = state => {
  return {
    formText: state.formText
  }
}

const mapDispatch = dispatch => {
  return {
    postForm: text => dispatch(_submitForm(text))
  }
}

export default connect(mapState, mapDispatch)(TextForm)
