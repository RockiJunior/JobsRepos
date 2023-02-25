import React from "react";

const ResponsiveMenu = () => {
  return (
    <div className="dashboard_navigationbar dn db-lg">
      <div className="dropdown">
        <button className="dropbtn">
          <i className="fa fa-bars pr10"></i> Dashboard Navigation
        </button>
        <ul id="myDropdown" className="dropdown-content">
          <li>
            <a href="page-dashboard.html">
              <span className="flaticon-dashboard"></span> Dashboard
            </a>
          </li>
          <li>
            <a href="page-dashboard-profile.html">
              <span className="flaticon-user"></span> My Profile
            </a>
          </li>
          <li>
            <a href="page-dashboard-property.html">
              <span className="flaticon-house"></span> My Properties List
            </a>
          </li>
          <li>
            <a href="page-dashboard-new-property.html">
              <span className="flaticon-button"></span> Add New Property
            </a>
          </li>
          <li>
            <a className="active" href="page-dashboard-favorites.html">
              <span className="flaticon-heart-shape-outline"></span> Favorites
            </a>
          </li>
          <li>
            <a href="page-dashboard-save-search.html">
              <span className="flaticon-magnifiying-glass"></span> Saved
              Searches
            </a>
          </li>
          <li>
            <a href="page-dashboard-invoices.html">
              <span className="flaticon-invoice"></span> My Invoices
            </a>
          </li>
          <li>
            <a href="page-dashboard-message.html">
              <span className="flaticon-mail-inbox-app"></span> Inbox
            </a>
          </li>
          <li>
            <a href="page-dashboard-logout.html">
              <span className="flaticon-logout"></span> Logout
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ResponsiveMenu;
