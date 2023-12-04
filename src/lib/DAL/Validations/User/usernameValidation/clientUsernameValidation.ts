export function clientUserNameValidation(login: string) {
	if (login.length < 4)
		return "Username must be longer than 4 characters"
	if (login.length > 20)
		return "Username must be shorter than 20 characters"
	if (!login.match(/^[a-z A-Z]/))
		return "Username must start with letter"
	if (!login.match(/^[a-z A-Z 0-9]*$/))
		return "Username must not contain special characters"
	return false
}
