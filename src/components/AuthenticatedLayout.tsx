import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Navbar from "./navbar";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  children,
}) => {
  const { loggedIn } = useSelector((state: RootState) => state.loginReducer);

  return (
    <>
      {loggedIn && <Navbar />}
      {children}
    </>
  );
};

export default AuthenticatedLayout;
