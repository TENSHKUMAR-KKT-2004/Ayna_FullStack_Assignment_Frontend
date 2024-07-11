import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const storeUser = async (data) => {
  await localStorage.setItem(
    "user",
    JSON.stringify({
      username: data.user.username,
      uid: data.user.id,
      jwt: data.jwt,
    })
  );
};

export const userData = () => {
  const stringifiedUser = localStorage.getItem("user") || '""';
  return JSON.parse(stringifiedUser || {});
};

export const Protector = ({ Component }) => {
  const navigate = useNavigate();

  const { jwt } = userData();

  useEffect(() => {
    if (!jwt) {
      navigate("/auth");
    }
  }, [navigate, jwt]);

  return <Component />;
};