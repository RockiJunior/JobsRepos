import React from 'react'

const MobileHeader = () => {
  return (

    <div id="page" className="stylehome1 h0">
    <div className="mobile-menu">
      <div className="header stylehome1">
        <div className="main_logo_home2 text-center">
          {" "}
          <img
            className="nav_logo_img img-fluid mt10"
            src="assets/images/header-logo.svg"
            alt="header-logo.svg"
          />{" "}
          <span className="mt15">Houzing</span>{" "}
        </div>
        <ul className="menu_bar_home2">
          <li className="list-inline-item">
            <a className="custom_search_with_menu_trigger msearch_icon"></a>
          </li>
          <li className="list-inline-item">
            <a
              className="muser_icon"
              data-toggle="modal"
              data-target="#logInModal"
            >
              <span className="flaticon-user"></span>
            </a>
          </li>
          <li className="list-inline-item">
            <a className="menubar" href="#menu">
              <span></span>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <nav id="menu" className="stylehome1">
      <ul>
        <li>
          <span>Home</span>
          <ul>
            <li>
              <a href="index.html">Home V1</a>
            </li>
            <li>
              <a href="index2.html">Home V2</a>
            </li>
            <li>
              <a href="index3.html">Home V3</a>
            </li>
            <li>
              <a href="index4.html">Home V4</a>
            </li>
            <li>
              <a href="index5.html">Home V5</a>
            </li>
            <li>
              <a href="index6.html">Home V6</a>
            </li>
            <li>
              <a href="index7.html">Home V7</a>
            </li>
            <li>
              <a href="index8.html">Home V8</a>
            </li>
            <li>
              <a href="index9.html">Home V9</a>
            </li>
            <li>
              <a href="index10.html">Home V10</a>
            </li>
          </ul>
        </li>
        <li>
          <span>Listing</span>
          <ul>
            <li>
              <span>Agent</span>
              <ul>
                <li>
                  <a href="page-agent-list.html">Agent List</a>
                </li>
                <li>
                  <a href="page-agent-single.html">Agent Single</a>
                </li>
              </ul>
            </li>
            <li>
              <span>Agency</span>
              <ul>
                <li>
                  <a href="page-agency-list.html">Agency List</a>
                </li>
                <li>
                  <a href="page-agency-single.html">Agency Single</a>
                </li>
              </ul>
            </li>
            <li>
              <span>User Detils</span>
              <ul>
                <li>
                  <a href="page-dashboard.html">Dashboard</a>
                </li>
                <li>
                  <a href="page-dashboard-profile.html">My Profile</a>
                </li>
                <li>
                  <a href="page-dashboard-property.html">My Listings</a>
                </li>
                <li>
                  <a href="page-dashboard-new-property.html">
                    New Listings
                  </a>
                </li>
                <li>
                  <a href="page-dashboard-favorites.html">Favorites</a>
                </li>
                <li>
                  <a href="page-dashboard-save-search.html">Save Search</a>
                </li>
                <li>
                  <a href="page-dashboard-message.html">Inbox</a>
                </li>
                <li>
                  <a href="page-dashboard-logout.html">Logout</a>
                </li>
              </ul>
            </li>
          </ul>
        </li>
        <li>
          <span>Property</span>
          <ul>
            <li>
              <span>Listing Styles</span>
              <ul>
                <li>
                  <a href="page-listing-v1.html">Listing v1</a>
                </li>
                <li>
                  <a href="page-listing-v2.html">Listing v2</a>
                </li>
                <li>
                  <a href="page-listing-v3.html">Listing v3</a>
                </li>
                <li>
                  <a href="page-listing-v4.html">Listing v4</a>
                </li>
                <li>
                  <a href="page-listing-v5.html">Listing v5</a>
                </li>
                <li>
                  <a href="page-listing-v6.html">Listing v6</a>
                </li>
                <li>
                  <a href="page-listing-all.html">Listing All</a>
                </li>
              </ul>
            </li>
            <li>
              <span>Listing Map</span>
              <ul>
                <li>
                  <a href="page-listing-v7.html">Map v1</a>
                </li>
                <li>
                  <a href="page-listing-v8.html">Map v2</a>
                </li>
                <li>
                  <a href="page-listing-v9.html">Map v3</a>
                </li>
                <li>
                  <a href="page-listing-v10.html">Map v4</a>
                </li>
                <li>
                  <a href="page-listing-v11.html">Map v5</a>
                </li>
                <li>
                  <a href="page-listing-v12.html">Map v6</a>
                </li>
                <li>
                  <a href="page-listing-v13.html">Map v7</a>
                </li>
              </ul>
            </li>
            <li>
              <span>Listing Single</span>
              <ul>
                <li>
                  <a href="page-listing-single-v1.html">Single V1</a>
                </li>
                <li>
                  <a href="page-listing-single-v2.html">Single V2</a>
                </li>
                <li>
                  <a href="page-listing-single-v3.html">Single V3</a>
                </li>
                <li>
                  <a href="page-listing-single-v4.html">Single V4</a>
                </li>
                <li>
                  <a href="page-listing-single-v5.html">Single V5</a>
                </li>
                <li>
                  <a href="page-listing-single-v6.html">Single V6</a>
                </li>
                <li>
                  <a href="page-listing-single-v7.html">Single V7</a>
                </li>
                <li>
                  <a href="page-listing-single-v8.html">Single V8</a>
                </li>
              </ul>
            </li>
          </ul>
        </li>
        <li>
          <span>Pages</span>
          <ul>
            <li>
              <span>Shop</span>
              <ul>
                <li>
                  <a href="page-shop.html">Shop Pages</a>
                </li>
                <li>
                  <a href="page-shop-single.html">Shop Single</a>
                </li>
                <li>
                  <a href="page-shop-cart.html">Cart</a>
                </li>
                <li>
                  <a href="page-shop-checkout.html">Checkout</a>
                </li>
                <li>
                  <a href="page-shop-order.html">Order</a>
                </li>
              </ul>
            </li>
            <li>
              <a href="page-about.html">About Us</a>
            </li>
            <li>
              <span>Blog</span>
              <ul>
                <li>
                  <a href="page-blog-grid.html">Blog Grid</a>
                </li>
                <li>
                  <a href="page-blog-grid-sidebar.html">
                    Blog Grid Sidebar
                  </a>
                </li>
                <li>
                  <a href="page-blog-details.html">Blog Details</a>
                </li>
                <li>
                  <a href="page-blog-list.html">Blog List</a>
                </li>
                <li>
                  <a href="page-blog-single.html">Blog Single</a>
                </li>
                <li>
                  <a href="page-blog-single2.html">Blog Single v2</a>
                </li>
              </ul>
            </li>
            <li>
              <a href="page-coming-soon.html">Coming Soon</a>
            </li>
            <li>
              <a href="page-gallery.html">Gallery</a>
            </li>
            <li>
              <a href="page-faq.html">Faq</a>
            </li>
            <li>
              <a href="page-login.html">My Account</a>
            </li>
            <li>
              <a href="page-pricing.html">Pricing V1</a>
            </li>
            <li>
              <a href="page-compare.html">Compare</a>
            </li>
            <li>
              <a href="page-error.html">404 Page</a>
            </li>
            <li>
              <a href="page-terms.html">Terms and Conditions</a>
            </li>
            <li>
              <a href="page-ui-element.html">UI Elements</a>
            </li>
          </ul>
        </li>
        <li>
          <a href="page-contact.html">Contact</a>
        </li>
        <li className="cl_btn">
          <a className="btn btn-block btn-lg btn-thm rounded">
            <span className="icon flaticon-button mr5"></span> Create
            Listing
          </a>
        </li>
      </ul>
    </nav>
  </div>  )
}

export default MobileHeader