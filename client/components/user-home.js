import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import TextForm from './TextForm'
import SentimentScore from './SentimentScore'

/**
 * COMPONENT
 */
export const UserHome = props => {
  const {email} = props

  return (
    <div>
      <h3>Welcome, {email}</h3>
      <TextForm />
      <SentimentScore />
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    email: state.user.email
  }
}

export default connect(mapState)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
}
