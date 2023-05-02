import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-responsive-modal";
import { deleteImage, uploadImage } from "../../redux/profileSlice";
import { ErrorHandler } from "../../utils/errorHandler.utils";

const ProfilePic = () => {
  const dispatch = useDispatch();
  const userLogged = useSelector((state) => state.login.currentUser);
  const refImageUpload = useRef(null);
  const [files, setFiles] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("token");

  const HandleImage = async (e) => {
    setFiles(e.target.files[0]);
  };

  const HandleUploadImage = () => {
    if (
      files.type === "image/jpg" ||
      files.type === "image/png" ||
      files.type === "image/jpeg"
    ) {
      try {
        let formData = new FormData();
        formData.append("photo", files);
        dispatch(uploadImage(userLogged.id, formData, token));
      } catch (error) {
        ErrorHandler(null, error.response.data.message);
      }
    } else {
      ErrorHandler(null, "Formato de imagen no válido.");
    }
  };

  const HandleDeleteImage = () => {
    try {
      dispatch(deleteImage(userLogged.id, token));
      setShowModal(false);
    } catch (error) {
      ErrorHandler(null, error.response.data.message);
    }
  };

  useEffect(() => {
    files !== null && HandleUploadImage();
    //eslint-disable-next-line
  }, [files]);

  return (
    <>
      <div className="col-lg-4">
        <div className="my_dashboard_profile">
          <h4 className="mb20 title">Foto</h4>
          {userLogged && (
            <div className="wrap-custom-file mb25">
              {userLogged.photo ? (
                <img
                  src={JSON.stringify(userLogged.photo).slice(1, -1)}
                  alt="Foto de perfil"
                />
              ) : (
                <div
                  style={{ width: "100%", height: "80%", fontSize: 100 }}
                  className="d-flex align-items-center justify-content-center bg-primary text-light"
                >
                  {JSON.stringify(userLogged.firstName)
                    .slice(1, -1)[0]
                    .toLocaleUpperCase()}
                  {JSON.stringify(userLogged.lastName)
                    .slice(1, -1)[0]
                    .toLocaleUpperCase()}
                </div>
              )}
              <input
                hidden
                type="file"
                name="image"
                ref={refImageUpload}
                onChange={HandleImage}
                accept=".jpg, .png, .jpeg"
              />
              <label htmlFor="image">
                <span
                  className="flaticon-document"
                  onClick={(e) => refImageUpload.current.click()}
                >
                  &nbsp;&nbsp;ACTUALIZAR FOTO
                </span>
                {userLogged.photo && (
                  <span
                    style={{ borderColor: "red", color: "red" }}
                    className="flaticon-trash mt-2"
                    onClick={() => setShowModal(true)}
                  >
                    &nbsp;&nbsp;ELIMINAR FOTO
                  </span>
                )}
                {/* <small className="file_title">*archivos jpg o png</small> */}
              </label>
            </div>
          )}
        </div>
      </div>
      <Modal open={showModal} onClose={() => setShowModal(false)} center>
        <div className="modal-header d-flex flex-column align-items-center">
          <h4 className="modal-title">
            ¿Querés eliminar esta propiedad de tus favoritos?
          </h4>
        </div>
        <div className="modal-body d-flex">
          <button
            className="btn w-50 m-1 btn-success"
            onClick={HandleDeleteImage}
          >
            Confirmar
          </button>
          <button
            className="btn btn-danger w-50 m-1"
            onClick={() => setShowModal(false)}
          >
            Cancelar
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ProfilePic;
