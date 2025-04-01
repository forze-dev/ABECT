import "./Navigation.scss"
import { Link } from "@/i18n/navigation"

const Navigation = () => {
	return (
		<nav className="Navigation">
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