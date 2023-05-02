import React from "react";
import Menu from "../components/favorites/Menu";
import ContactInfo from "../components/myProfile/ContactInfo";
import Password from "../components/myProfile/Password";
import ProfilePic from "../components/myProfile/ProfilePic";
import ResponsiveMenu from "../components/favorites/ResponsiveMenu";
// import Notifications from "../components/myProfile/Notifications";

const MiPerfil = () => {
  // * States
  return (
    <div className="wrapper mi-actividad">
      <Menu item={1} />
      <section
        style={{ marginTop: -100 }}
        className="our-dashbord dashbord bgc-alice-blue"
      >
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-2 dn-lg pl0" />
            <div className="col-xl-10">
              <div className="row">
                <div className="col-lg-12">
                  <ResponsiveMenu item={1} />
                </div>
                <div className="col-lg-12 mb50">
                  <div className="breadcrumb_content">
                    <h2 className="breadcrumb_title">Mi perfil</h2>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="row">
                    <div className="col-lg-8">
                      <ContactInfo />
                      <Password />
                      {/* <Notifications userLogged={userLogged} /> */}
                    </div>
                    <ProfilePic />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MiPerfil;
