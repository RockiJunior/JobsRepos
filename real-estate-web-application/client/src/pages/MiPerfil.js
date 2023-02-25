import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import Menu from "../components/favorites/Menu";
import ContactInfo from "../components/myProfile/ContactInfo";
import Notifications from "../components/myProfile/Notifications";
import Password from "../components/myProfile/Password";
import ProfilePic from "../components/myProfile/ProfilePic";
import decode from "jwt-decode";

const MiPerfil = ({userLogged, setUserLogged}) => {
  return (
    <div className="wrapper mi-actividad">
      <Menu item={2} />
      {!userLogged ? (
        "loading..."
      ) : (
        <section
          style={{ marginTop: -100 }}
          className="our-dashbord dashbord bgc-alice-blue"
        >
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-2 dn-lg pl0"></div>
              <div className="col-xl-10">
                <div className="row">
                  <div className="col-lg-12 mb50">
                    <div className="breadcrumb_content">
                      <h2 className="breadcrumb_title">Mi perfil</h2>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="row">
                      <div className="col-lg-8">
                        <ContactInfo userLogged={userLogged} setUserLogged={setUserLogged}/>
                        {userLogged.password && <Password userLogged={userLogged} setUserLogged={setUserLogged}/>}
                        <Notifications userLogged={userLogged} />
                      </div>
                      <ProfilePic userLogged={userLogged} setUserLogged={setUserLogged}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default MiPerfil;
