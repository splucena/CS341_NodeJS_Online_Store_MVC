const _userid = Symbol("userid");
const _first_name = Symbol("first_name");
const _last_name = Symbol("last_name");
const _username = Symbol("username");
const _passwd = Symbol("passwd");

module.exports = class User {
	constructor(userid, first_name, last_name, username, passwd) {
		this[_userid] = userid;
		this[_first_name] = first_name;
		this[_last_name] = last_name;
		this[_username] = username;
		this[_passwd] = passwd;
	}

	get userid() {
		return this[_userid];
	}

	get first_name() {
		return this[_first_name];
	}

	set first_name(firstName) {
		this[_first_name] = firstName;
	}

	get last_name() {
		return this[_last_name];
	}

	set last_name(lastName) {
		this[_last_name] = lastName;
	}

	get username() {
		return this[_username];
	}

	set username(newUsername) {
		this[_username] = newUsername;
	}

	get passwd() {
		return this[_passwd];
	}

	set passwd(newpasswd) {
		this[_passwd] = newpasswd;
	}

	get JSON() {
		return JSON.stringify({
			first_name: this.first_name,
			last_name: this.last_name,
			username: this.username,
			passwd: this.passwd,
		});
	}

	static fromJSON(json) {
		var data = JSON.parse(json);
		var user = new Note(
			data.first_name,
			data.last_name,
			data.username,
			data.passwd
		);
		return user;
	}
};
