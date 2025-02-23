import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './assets/pages/Login'
import Products from './assets/pages/Products'
import Cart from './assets/pages/Cart'

function App() {


  return (
    <>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/products' element={<Products />} />
        <Route path='/cart' element={<Cart />} />
      </Routes>
    </>
  )
}

export default App