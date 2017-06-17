export async function getToken() {
    const response =  await fetch('');
    console.log('watson-stt::getToken - response:', response);

    if (response.status !== 200) {
        const error = await response.text();
        throw new Error(`Got bad response "status" (${response.status}) from Watson Token server, error: "${error}"`);
    }

    const token = await response.text();

    return token;
}