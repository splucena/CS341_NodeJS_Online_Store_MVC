const _user_id = Symbol("user_id");
const _username = Symbol("usernmae");
const _password = Symbol("password");

module.exports = class User {
	constructor(userid, username, password) {
		this[_user_id] = userid;
		this[_username] = username;
		this[_password] = password;
	}

	get userid() {
		return this[_user_id];
	}

	get username() {
		return this[_username];
	}

	set username(newUsername) {
		this[_username] = newUsername;
	}

	get password() {
		return this[_password];
	}

	set password(newPassword) {
		this[_password] = newPassword;
	}
};
