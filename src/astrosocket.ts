export default function astrosocket() {
    const sock = io('http://astronaut.io/')

    return sock
}
