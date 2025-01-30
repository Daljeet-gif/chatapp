import React from 'react'
import {Helmet} from "react-helmet-async"
const Title = ({title="chat" ,descrition="This is the chat app"}) => {
  return <Helmet>
  <title>{title}</title>
  <meta name={descrition}content={descrition}></meta>
  </Helmet>
}

export default Title