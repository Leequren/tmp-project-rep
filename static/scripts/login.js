const loginButton = document.querySelector('.login-button')

loginButton.addEventListener('click', async (event) => {
    event.preventDefault()
    const inputNumber = document.querySelector('#number-phone')
    const inputCode = document.querySelector('#phone-sms')
    const checkbox = document.querySelector('#check-age')
    if (checkbox.checked) {
        const body = {
            phone: inputNumber.value,
            code: inputCode.value
        }
        let response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(body)
        })
        let result = await response.json()
        console.log(response, result)
        if (result.typeValidation === 'access') {
            window.location.href = "/personal"
        }

    }

})