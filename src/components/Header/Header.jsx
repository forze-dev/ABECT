import "./Header.scss"
import { Link } from "@/i18n/navigation"
import Image from "next/image"
import Navigation from "../Navigation/Navigation"
import ContactButton from "../ContactButton/ContactButton"

const Header = () => {

	return (
		<header>
			<div className="container">
				<div className="header__wrapper">
					<div className="logo">
						<Link href={"/"}>
							<Image src={"/icons/logo.svg"} alt="ABECT" width={132} height={38} />
						</Link>
					</div>
					<Navigation />
					<ContactButton />
				</div>
			</div>
		</header>
	)
}

export default Header