
const miFormulario = document.querySelector('form');

const url = window.location.hostname.includes("localhost")
    ? "http://localhost:8081/api/auth/"
    : "https://rest-server-node-0-experto.herokuapp.com/api/auth/";

console.log(url);

miFormulario.addEventListener('submit', ev => {
    ev.preventDefault();
    const formData = {};

    for( let el of miFormulario.elements ) {
        if (el.name.length > 0) {
            formData[el.name] = el.value;
        }
    }

    fetch( url + 'login', {
        method: 'POST',
        body: JSON.stringify( formData ),
        headers: { 'Content-Type': 'application/json' }
    })
        .then( resp => resp.json() )
        .then( ({ msg, token }) => {
            if ( msg ){
                return console.error( msg );
            }
            
            localStorage.setItem('token', token);
            window.location = 'chat.html';
        })
        .catch( err => {
            console.log(err)
        })

});

function handleCredentialResponse(response) {
    // Google Token : ID_TOKEN
    const body = { id_token: response.credential };

    fetch(url + 'google', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })
        .then((resp) => resp.json())
        .then(({token}) => {
            localStorage.setItem('token', token);
            window.location = 'chat.html';
        })
        .catch(console.warn);
}

const button = document.getElementById("google_signout");
button.onclick = () => {
    console.log(google.accounts.id);
    google.accounts.id.disableAutoSelect();

    google.accounts.id.revoke(localStorage.getItem("email"), (done) => {
        localStorage.clear();
        location.reload();
    });
};