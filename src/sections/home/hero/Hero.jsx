"use client"

import "./Hero.scss"
import { TypeAnimation } from "react-type-animation"
import { useState, useRef, useEffect } from "react"

const Hero = () => {
	const [messages, setMessages] = useState([])
	const [inputValue, setInputValue] = useState("")
	const [currentBotMessageIndex, setCurrentBotMessageIndex] = useState(0)
	const [isTyping, setIsTyping] = useState(true)
	const chatContentRef = useRef(null)

	const allBotMessages = [
		["Вітаю, на звязку команда ABECT!", 2000, "Бажаєте отримати безкоштовну консультацію? Просто напишіть..."],
		["Щоб ми могли передати Ваш запит вкажіть номер телефону"],
		["Дякую! З вами незабаром звяжеться наш спеціаліст"],
	]

	useEffect(() => {
		setMessages([{ sender: 'bot', content: allBotMessages[0], isComplete: false }])
	}, [])

	useEffect(() => {
		if (chatContentRef.current) {
			chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight
		}
	}, [messages])

	const handleInputChange = (e) => {
		setInputValue(e.target.value)
	}

	const handleSubmit = (e) => {
		e.preventDefault()

		if (inputValue.trim() === "") return

		const newUserMessage = { sender: 'user', content: inputValue }

		setInputValue("")

		setMessages(prevMessages => [...prevMessages, newUserMessage])

		// Mark previous bot message as complete
		setMessages(prevMessages =>
			prevMessages.map((msg, idx) =>
				idx === prevMessages.length - 2 && msg.sender === 'bot'
					? { ...msg, isComplete: true }
					: msg
			)
		)

		if (currentBotMessageIndex < allBotMessages.length - 1) {
			const nextBotIndex = currentBotMessageIndex + 1

			setTimeout(() => {
				setIsTyping(true)
				setMessages(prevMessages => [
					...prevMessages,
					{ sender: 'bot', content: allBotMessages[nextBotIndex], isComplete: false }
				])
				setCurrentBotMessageIndex(nextBotIndex)
			}, 500)
		}
	}

	const handleTypeAnimationComplete = () => {
		setIsTyping(false)
	}

	return (
		<section className="hero">
			<div className="container">
				<div className="hero__wrapper">
					<div className="hero__item hero--text">
						<ul>
							<li>UI/UX дизайн</li>
							<li>Сайти та веб-додатки</li>
							<li>Кросбраузерна розробка</li>
							<li>Технічна підтримка</li>
							<li>24/7</li>
						</ul>
					</div>
					<div className="hero__item hero--image"></div>
					<div className="hero__item hero--chat">
						<div className={`hero--chat__content ${messages.length >= 3 ? "chat__content-shadow" : ""}`} ref={chatContentRef}>
							{messages.map((message, index) => (
								<div
									key={index}
									className={`hero--chat__message ${message.sender === 'bot' ? 'bot--message' : 'user--message'}`}
								>
									{message.sender === 'bot' ? (
										message.isComplete ? (
											<p>{Array.isArray(message.content) ? message.content[message.content.length - 1] : message.content}</p>
										) : (
											<TypeAnimation
												cursor={isTyping}
												sequence={[
													...(Array.isArray(message.content) ? message.content : [message.content]),
													() => handleTypeAnimationComplete()
												]}
												speed={50}
												wrapper="p"
											/>
										)
									) : (
										<p>{message.content}</p>
									)}
								</div>
							))}
						</div>
						<form className="hero--chat__form" onSubmit={handleSubmit}>
							<input
								type="text"
								value={inputValue}
								onChange={handleInputChange}
								placeholder="Напишіть повідомлення..."
								disabled={isTyping}
							/>
							<button type="submit" disabled={isTyping || inputValue.trim() === ""}></button>
						</form>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Hero