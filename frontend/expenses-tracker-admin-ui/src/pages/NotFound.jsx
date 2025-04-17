import React from 'react'

function NotFound() {
  return (
    <main className="flex-grow-1">
        <div className="container error-container">
            <h1>404</h1>
            <h3>Page Not Found</h3>
            <p>Looks like the page you are looking for does not exist.</p>
            <a href="/" className="btn btn-danger btn-home">Go Back Home</a>
        </div>
    </main>
  )
}

export default NotFound
