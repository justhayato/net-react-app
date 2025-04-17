import React from 'react'

function Footer() {
  return (
    <footer className="py-4 mt-auto">
      <div className="container text-center">
        <p className="mb-1">Expenses Tracker - Admin &copy; {new Date().getFullYear()} Glenville Maturan</p>
      </div>
    </footer>
  )
}

export default Footer
