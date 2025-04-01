import "./ContactButton.scss"

const ContactButton = ({ text = "Консультація", classList = "" }) => {
	return (
		<button className={`btn ${classList}`}>
			{text}
		</button>
	)
}

export default ContactButton