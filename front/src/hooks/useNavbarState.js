import { useCallback, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import jwt_decode from "jwt-decode";

const DEFAULT_USER_LABEL = "Iniciar Sesión";
const INITIAL_PAYLOAD = { role: "" };

const safeParse = (rawValue) => {
  if (!rawValue) {
    return "";
  }

  try {
    return JSON.parse(rawValue);
  } catch (error) {
    return rawValue;
  }
};

const decodeToken = (token) => {
  if (!token) {
    return INITIAL_PAYLOAD;
  }

  try {
    const decoded = jwt_decode(token);
    return decoded?.usuario ?? INITIAL_PAYLOAD;
  } catch (error) {
    return INITIAL_PAYLOAD;
  }
};

const useNavbarState = () => {
  const history = useHistory();
  const location = useLocation();
  const [user, setUser] = useState(DEFAULT_USER_LABEL);
  const [payload, setPayload] = useState(INITIAL_PAYLOAD);

  const refreshUser = useCallback(() => {
    const storedUser = safeParse(localStorage.getItem("usuario"));
    setUser(storedUser || DEFAULT_USER_LABEL);
  }, []);

  const refreshPayload = useCallback(() => {
    const storedToken = safeParse(localStorage.getItem("token"));
    setPayload(decodeToken(storedToken));
  }, []);

  const handleLogin = useCallback(() => {
    localStorage.setItem("token", JSON.stringify(""));
    localStorage.setItem("id", JSON.stringify(""));
    localStorage.setItem("usuario", JSON.stringify(DEFAULT_USER_LABEL));
    refreshUser();
    setPayload(INITIAL_PAYLOAD);
    history.push("/login");
  }, [history, refreshUser]);

  useEffect(() => {
    refreshUser();
    refreshPayload();
  }, [location, refreshPayload, refreshUser]);

  return {
    handleLogin,
    payload,
    user,
  };
};

export default useNavbarState;
