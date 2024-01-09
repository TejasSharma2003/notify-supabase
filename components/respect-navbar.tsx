import { NAVBAR_HEIGHT } from "@/config/site";
import clsx from "clsx";
import React from "react";

type RespectNavbarProps = {
    children: React.ReactNode
}
const RespectNavbar = ({ children }: RespectNavbarProps) => {
    return (
        <main className={clsx('pt-4', `mt-${NAVBAR_HEIGHT}`)} >{children}</main>
    )
}
export default RespectNavbar;
