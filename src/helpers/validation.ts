
export function validateLogin(login: string) {
	if (login.length < 4) return "Username must be longer than 4 characters"
	if (login.length > 20) return "Username must be shorter than 20 characters"
	if (!login.match(/^[a-z A-Z]/)) return "Username must start with letter"
	if (!login.match(/^[a-z A-Z 0-9]*$/))
		return "Username must not contain special characters"
	return false
}
export function validatePassword(password: string) {
	if (password.length < 5) return "Password must be longer than 5 characters"
	if (password.length > 40) return "Password must be shorter than 40 characters"
	// if (!password.match(/[A-Z]/)) return "Password must contain uppercase letters"
	// if (!password.match(/[a-z]/)) return "Password must contain lowercase letters"
	// if (password.match(/^[a-z A-Z 0-9]*$/)) return "Password must contain special characters"
		return false
}
