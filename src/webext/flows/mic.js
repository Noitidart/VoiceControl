export const STATUS = {
    UNINIT: 'UNINIT',
    OFF: 'OFF',
    ON: 'ON',
    AUTH: 'AUTH', // in auth process
    // [string] error
}
const INITIAL = {
    status: STATUS.UNINIT
}

const AUTH_LISTEN = 'AUTH_LISTEN';
export function authListen() {
    return {
        type: AUTH_LISTEN
    }
}

const START_LISTEN = 'START_LISTEN';
export function startListen() {
    return {
        type: START_LISTEN
    }
}

const STOP_LISTEN = 'STOP_LISTEN';
export function stopListen() {
    return {
        type: STOP_LISTEN
    }
}

const ERROR_LISTEN = 'ERROR_LISTEN';
export function errorListen(error) {
    return {
        type: ERROR_LISTEN,
        error
    }
}

export default function filter(state=INITIAL, action) {
    switch(action.type) {
        case AUTH_LISTEN:
            if (state.status === STATUS.AUTH) return state;
            return { ...state, status:STATUS.AUTH };
        case START_LISTEN:
            if (state.status === STATUS.ON) return state;
            return { ...state, status:STATUS.ON };
        case STOP_LISTEN:
            if (state.status === STATUS.OFF) return state;
            return { ...state, status:STATUS.OFF };
        case ERROR_LISTEN: {
            const { error } = action;
            if (state.status === error) return state;
            return { ...state, status:error };
        }
        default:
            return state;
    }
}