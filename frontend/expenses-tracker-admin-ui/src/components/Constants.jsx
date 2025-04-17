const defaultUser = {
    name : "",
    email : "",
    phone : "",
    password : "",
    confirmPassword : "",
    role: 10
}

const version = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, "");

export { defaultUser, version }