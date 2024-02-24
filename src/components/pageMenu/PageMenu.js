import React from 'react'
import "./PageMenu.scss"
import { NavLink } from 'react-router-dom'

function PageMenu() {
  return (
    <div>
        <nav className="--bg-primary --p --mb">
            <ul className="home-links">
                <li>
                    <NavLink to="/profile">Profile</NavLink>
                </li>
                <li>
                    <NavLink to="/wallet">My Wallet</NavLink>
                </li>
                <li>
                    <NavLink to="/wishlist">My Wishlist</NavLink>
                </li>
            </ul>
        </nav>
    </div>
  )
}

export default PageMenu