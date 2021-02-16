import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface CategorysState {
    isLoading: boolean;
    startDateIndex?: number;
    cats: Category[];
}

export interface Category {
    date: string;
    catName: string;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

export interface RequestCategorysAction {
    type: 'REQUEST_cats';
    startDateIndex: number;
}

export interface ReceiveCategorysAction {
    type: 'RECEIVE_cats';
    startDateIndex: number;
    cats: Category[];
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
export type KnownAction = RequestCategorysAction | ReceiveCategorysAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    requestCategorys: (startDateIndex: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.Categorys && startDateIndex !== appState.Categorys.startDateIndex) {
            fetch(`https://localhost:5001/api/Category`)
                .then(response => response.json() as Promise<Category[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_cats', startDateIndex: startDateIndex, cats: data });
                });

            dispatch({ type: 'REQUEST_cats', startDateIndex: startDateIndex });
        }
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: CategorysState = { cats: [], isLoading: false };

export const reducer: Reducer<CategorysState> = (state: CategorysState | undefined, incomingAction: Action): CategorysState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_cats':
            return {
                startDateIndex: action.startDateIndex,
                cats: state.cats,
                isLoading: true
            };
        case 'RECEIVE_cats':
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
            if (action.startDateIndex === state.startDateIndex) {
                return {
                    startDateIndex: action.startDateIndex,
                    cats: action.cats,
                    isLoading: false
                };
            }
            break;
    }

    return state;
};
