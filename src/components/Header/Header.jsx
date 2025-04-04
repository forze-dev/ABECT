"use client"
import "./Header.scss"
import { Link } from "@/i18n/navigation"
import Image from "next/image"
import Navigation from "../Navigation/Navigation"
import ContactButton from "../ContactButton/ContactButton"
import { useState } from "react"

const Header = () => {
	const [isShowNav, setShowNav] = useState(false)

	return (
		<header>
			<div className="container">
				<div className="header__wrapper">
					<div className="logo">
						<Link href={"/"}>
							<Image src={"/icons/logo.svg"} alt="ABECT" width={132} height={38} />
						</Link>
					</div>
					<Navigation isShowNav={isShowNav} />
					<div className="header__contact">
						<ContactButton />
					</div>
					<div className="header__burger" onClick={() => setShowNav(prev => !prev)}>
						МЕНЮ
					</div>
				</div>
			</div>
		</header>
	)
}

export default Header