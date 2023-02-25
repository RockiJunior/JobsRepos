import React from 'react'

const ListHeader = ({data}) => {
  return (
    <div className="row">
      <div className="listing_filter_row dif db-767">
        <div className="col-sm-12 col-md-4 col-lg-4 col-xl-5">
          <div className="left_area tac-xsd mb30-767">
            <p className="mb0 mt10">
              <span className="heading-color">{data.allPropertiesLength}</span>{" "}
              Resultados
            </p>
          </div>
        </div>
        {/* <div className="col-sm-12 col-md-8 col-lg-8 col-xl-7">
          <div className="listing_list_style tac-767">
            <ul className="mb0">
              <li className="list-inline-item dropdown text-left bb2">
                <span className="stts">Filtrar por:</span>
                <select>
                  <option>Newest Listings</option>
                  <option>Most Recent</option>
                  <option>Recent</option>
                  <option>Best Selling</option>
                  <option>Old Review</option>
                </select>
              </li>
              <li className="list-inline-item gird">
                <a href="#">
                  <span className="fa fa-th-large"></span>
                </a>
              </li>
              <li className="list-inline-item list">
                <a href="#">
                  <span className="fa fa-th-list"></span>
                </a>
              </li>
            </ul>
          </div>
        </div> */}
      </div>
    </div>  )
}

export default ListHeader