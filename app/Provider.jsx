import React from 'react'
import Header from './_components/Header'

const Provider = ({children}) => {
  return (
    <div>
    <Header/>
    <div className=''>
    {children}
    </div>
      
    </div>
  )
}

export default Provider
