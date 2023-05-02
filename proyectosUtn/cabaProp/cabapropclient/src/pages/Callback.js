import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { verifyClient } from "../redux/loginSlice";

const Callback = () => {
  let [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(verifyClient(searchParams.get("code")));
    //eslint-disable-next-line
  }, []);

  return;
};

export default Callback;
