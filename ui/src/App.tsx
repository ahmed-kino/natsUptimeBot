import React from 'react'
import { Routes, Route, Outlet, Link } from 'react-router-dom'

import Box from '@mui/material/Box'
import SideDrawer from './components/SideDrawer'
import Checks from './components/Checks'
import Dashboard from './components/Dasboard'

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  )
}

const App: React.FC = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <SideDrawer />
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="checks" element={<Checks />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </Box>
  )
}

export default App
