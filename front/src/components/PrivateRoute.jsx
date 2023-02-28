import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { SessionContext } from '../contexts/SessionContext'

const PrivateRoute = ({children}) => {
    const { isLoading, isAutheticated } = useContext(SessionContext)
    if(!isLoading && !isAutheticated){
        return <Navigate to='/login'/>
    }

  return (
    <div>{children}</div>
  )
}

export default PrivateRoute