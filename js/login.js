$(function () {
	$("form").submit(function(e){
        e.preventDefault();
    });

	let btnLogin = $(".btn-login")

	btnLogin.click(function () {
		let email = $("#email")[0].value
		let password = $("#password")[0].value

		let isLoggedIn = request.checkUserCredsCorrect(email, password)
		console.log("email: " + email + "password: " + password)
		if (isLoggedIn) {
			console.log('success')
		} else {
			console.log('failure')
		}
	})
})