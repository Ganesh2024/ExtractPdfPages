import React from 'react'
import { useNavigate } from 'react-router-dom'

export const PageNotFound = ()=> {
  const navigate = useNavigate();
  useEffect(() => {   
    navigate('/login');
  }, [])
  
  return (
    <div>
      <h1>Page not found!!!</h1>
    </div>
  )
}
