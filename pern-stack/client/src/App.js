import { BrowserRouter, Route, Routes } from 'react-router-dom'

import {Container} from '@mui/material'

import Menu from './component/Navbar'

import TasksList from './component/TaskList'
import TaskForm from './component/TaskForm'

export default function App() {
  return (
    <BrowserRouter>
      <Menu />
      <Container>
        <Routes>
          <Route index path="/" element={<TasksList />} />
          <Route path="/tasks/new" element={<TaskForm />} />
          <Route path="/tasks/:id/edit" element={<TaskForm />} />
        </Routes>
      </Container>
    </BrowserRouter>
  )
}
