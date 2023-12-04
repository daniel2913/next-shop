export function clientPasswordValidation(password: string) {
	if (password.length < 5)
		return "Password must be longer than 5 characters"
	if (password.length > 40)
		return "Password must be shorter than 40 characters"
	if (!password.match(/[A-Z]/))
		return "Password must contain uppercase letters"
	if (!password.match(/[a-z]/))
		return "Password must contain lowercase letters"
	if (password.match(/^[a-z A-Z 0-9]*$/))
		return "Password must contain special characters"
	return false
}

const passwordValidators = [
	{
		validator: (password: string) => {
			const error = clientPasswordValidation(password)
			if (error) return false
			return true
		},
		msg: "Invalid Username. Try Reloading the Page",
	},
]

export default passwordValidators
