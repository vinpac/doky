export function overrideReducer<T>(state: T, action: ActionOverride<T>): T {
  return {
    ...state,
    ...action.payload,
  }
}

export interface ActionOverride<State> {
  type: '@override'
  payload: Partial<State>
}

interface AnyAction {
  type: string
}

export const ACTION_OVERRIDE: '@override' = '@override'

export function createReducer<
  State,
  Action extends AnyAction = AnyAction
>(map: {
  [type: string]: React.Reducer<State, Action | ActionOverride<State>>
}): React.Reducer<State, Action | ActionOverride<State>> {
  return (state, action) => {
    if (action.type === ACTION_OVERRIDE) {
      return overrideReducer(state, action as ActionOverride<State>)
    }

    if (map[action.type]) {
      return map[action.type](state, action)
    }

    return state
  }
}
