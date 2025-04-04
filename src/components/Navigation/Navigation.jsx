import "./Navigation.scss"
import { Link } from "@/i18n/navigation"

const Navigation = ({ isShowNav }) => {
	return (
		<nav className={`Navigation ${isShowNav ? "show" : ""}`}>
			<ul>
				<li>
					<Link>Головна</Link>
				</li>
				<li>
					<Link>Портфоліо</Link>
				</li>
				<li>
					<Link>Контакти</Link>
				</li>
				<li>
					<Link>Блог</Link>
				</li>
			</ul>
		</nav>
	)
}

export default Navigation