import FooterCompo from "./index/FooterCompo";
import HeaderCompo from "./index/HeaderCompo";
import layoutStyle from "../styles/layout.module.css"
import { NextPage } from "next";
import { ReactElement } from "react";


const Layout: NextPage<{ children: ReactElement }> = ({ children }) => {
    return (
        <div className={layoutStyle.container}>
            <header className={layoutStyle.header}>
                <HeaderCompo></HeaderCompo>
            </header>

            <main className={layoutStyle.main}>
                {children}
            </main>

            <footer className={layoutStyle.footer}>
                <FooterCompo></FooterCompo>
            </footer>
        </div>
    )
}

export default Layout