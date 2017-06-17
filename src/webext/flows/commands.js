import * as scripts from '../command-scripts'
console.log('scripts', scripts);

const INITIAL = {
    history: [],
    scrolldn: {
        id: 'scrolldn',
        trigger: 'down',
        desc: 'Scroll half page down',
        enabled: true
    },
    scrollup: {
        id: 'scrollup',
        trigger: 'up',
        desc: 'Scroll half page up',
        enabled: true
    }
}

const EXEC_COMMAND = 'EXEC_COMMAND';
export function execCommand(id) {
    if (id in scripts) {
        try {
            scripts[id]();
        } catch(ex) {
            console.error(`Error when executing command id "${id}": ${ex}`)
        }

        return {
            type: EXEC_COMMAND,
            id
        };
    } else {
        extension.notifications.create({
            type: 'basic',
            iconUrl: extension.extension.getURL('images/icon48.png'),
            title: 'Invalid Command',
            message: `No command with id "${id}"`
        });
    }
}

function commandsAll(state=INITIAL, action) {
    switch(action.type) {
        case EXEC_COMMAND: {
            const { id } = action;

            return {
                ...state,
                history: [
                    ...state.history,
                    { id }
                ]
            };
        }
        default:
            return state;
    }
}

export default commandsAll