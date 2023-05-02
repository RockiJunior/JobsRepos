import React from "react";

const Notifications = ({userLogged}) => {

  return (
    <form className="contact_form profile mb30-lg" action="#">
      <div className="row">
        <div className="col-lg-12">
          <h4 className="mb30 title">Ajustes de notificaciones</h4>
        </div>
        <div className="col-lg-12">
          <div className="form-group mb25 border p-3 rounded">
            <div style={{ fontWeight: 900 }}>Newsletter</div>
            <div className="d-flex">
              <div>
                The standard chunk of Lorem Ipsum used since the 1500s is
                reproduced below for those interested. Sections 1.10.32 and
                1.10.33
              </div>
              <div className="shortcode_widget_switch ml-5">
                <div className="ui_kit_whitchbox">
                  <div className="custom-control custom-switch">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="customSwitch1"
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="customSwitch1"
                    ></label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="form-group mb25 border p-3 rounded">
            <div style={{ fontWeight: 900 }}>Envíos de Anunciantes</div>
            <div className="d-flex">
              <div>
                The standard chunk of Lorem Ipsum used since the 1500s is
                reproduced below for those interested. Sections 1.10.32 and
                1.10.33
              </div>
              <div className="shortcode_widget_switch ml-5">
                <div className="ui_kit_whitchbox">
                  <div className="custom-control custom-switch">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="customSwitch2"
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="customSwitch2"
                    ></label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="form-group mb25 border p-3 rounded">
            <div style={{ fontWeight: 900 }}>Recomendaciones de avisos</div>
            <div className="d-flex">
              <div>
                The standard chunk of Lorem Ipsum used since the 1500s is
                reproduced below for those interested. Sections 1.10.32 and
                1.10.33
              </div>
              <div className="shortcode_widget_switch ml-5">
                <div className="ui_kit_whitchbox">
                  <div className="custom-control custom-switch">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="customSwitch3"
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="customSwitch3"
                    ></label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="form-group mb25 border p-3 rounded">
            <div style={{ fontWeight: 900 }}>Recomendaciones de emprendimientos</div>
            <div className="d-flex">
              <div>
                The standard chunk of Lorem Ipsum used since the 1500s is
                reproduced below for those interested. Sections 1.10.32 and
                1.10.33
              </div>
              <div className="shortcode_widget_switch ml-5">
                <div className="ui_kit_whitchbox">
                  <div className="custom-control custom-switch">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="customSwitch4"
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="customSwitch4"
                    ></label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Notifications;
