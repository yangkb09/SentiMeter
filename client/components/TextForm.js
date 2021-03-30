import React from 'react'
import {connect} from 'react-redux'
import {_submitForm, _getScore} from '../store/form'

export class TextForm extends React.Component {
  constructor() {
    super()
    this.state = {
      formText: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  componentDidMount() {
    this.props.getScore()
  }
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  handleSubmit(event) {
    event.preventDefault()
    this.props.postForm(this.state)
    // this.props.getScore()
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
        <div className="card">
          Analysis
          {console.log('this.props ', this.props)}
          {console.log('this.props.text ', this.props.text)}
          {console.log('this.state ', this.state)}
          {/* <div className="container">
            {this.props.form.map(oneForm => {
              return (
                <div key={oneForm.id}>Sentiment Score: {oneForm.score}</div>
              )
            })}
          </div> */}
        </div>
      </div>
    )
  }
}

const mapState = state => {
  return {
    formText: state.formText,
    score: state.score
  }
}

const mapDispatch = dispatch => {
  return {
    postForm: text => dispatch(_submitForm(text)),
    getScore: () => dispatch(_getScore())
  }
}

export default connect(mapState, mapDispatch)(TextForm)
