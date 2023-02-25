import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { verifyClient } from "../redux/loginSlice";

const Callback = () => {
  let [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(verifyClient(searchParams.get("code")));
  }, []);

  return;
};

export default Callback;
