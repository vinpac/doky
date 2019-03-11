export function overrideReducer(state, action) {
    return {
        ...state,
        ...action.payload,
    };
}
export const ACTION_OVERRIDE = '@override';
export function createReducer(map) {
    return (state, action) => {
        if (action.type === ACTION_OVERRIDE) {
            return overrideReducer(state, action);
        }
        if (map[action.type]) {
            return map[action.type](state, action);
        }
        return state;
    };
}
//# sourceMappingURL=redux.js.map