import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import { History } from 'history';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface CategoryState {
    isLoading: boolean;
    cat: Category;
    cats: Category[];
}

export interface Category {
    id: number,
    date: string;
    catName: string;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

export interface getCatAction {
    type: 'GET_CAT';
    payload: Category[];
}

export interface addCatAction {
    type: 'ADD_CAT';
    payload: Category;
}

export interface addCatSuccessAction {
    type: 'ADD_CAT_SUCCESS';
    payload: Category;
}


export interface editCatAction {
    type: 'EDIT_CAT';
    payload: Category;
}

export interface deleteCatAction {
    type: 'DELETE_CAT';
    payload: number;
}

export type KnownAction = getCatAction | addCatAction | addCatSuccessAction| editCatAction | deleteCatAction;
export type AddActions = addCatAction | addCatSuccessAction;

export const actionCreators = {
getCat: (data: Category[]): AppThunkAction<getCatAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)

        const appState = getState();
        if (appState) {
            fetch(`https://localhost:5001/api/Category`)
                .then(response => response.json() as Promise<Category[]>)
                .then(data => {
                    dispatch({ type: 'GET_CAT', payload: data });
                });
        }
    },

addCat: (data: Category, history: History): AppThunkAction<AddActions> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.AddCategory && appState.AddCategory.cat && !appState.AddCategory.cat.id) {
            fetch(`https://localhost:5001/api/Category`, {
              credentials: 'include',
              method: 'POST',
              headers: {
                "content-Type": "application/json"
              },
              body: JSON.stringify(data)
            })

                .then(response => response.json() as Promise<Category>)
                .then(data => {
                    dispatch({ type: 'ADD_CAT_SUCCESS', payload: data });
                    console.log("data", data)
                });
            dispatch({ type: 'ADD_CAT', payload: data });
            history.push(`api/Category/${data.id}`);
        }
    },

addCatSuccess: (data: Category, history: History): AppThunkAction<addCatSuccessAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.AddCategory && appState.AddCategory.cat && !appState.AddCategory.cat.id) {
            fetch(`https://localhost:5001/api/Category`)
              .then(response => response.json() as Promise<Category>)
              .then(data => {
                console.log("data", data)
            });
            dispatch({ type: 'ADD_CAT_SUCCESS', payload: data });
            history.push(`api/Category/${data.id}`);
        }
    },

editCat: (data: Category, history: History): AppThunkAction<editCatAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState) {
            fetch(`https://localhost:5001/api/Category/${data.id}`, {
              credentials: 'include',
              method: 'PATCH',
              headers: {"content-Type": "application/json"},
              body: JSON.stringify(data)
            }).then(response => response.json() as Promise<Category>)
              .then(data => {
                console.log("data", data);
            });
            dispatch({ type: 'EDIT_CAT', payload: {id: data.id, date: data.date, catName: data.catName} });
            history.push(`/api/Category/${data.id}`);
        }
    },

    deleteCat: (id: number, history: History): AppThunkAction<deleteCatAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState) {
            fetch(`https://localhost:5001/api/Category/${id}`, {
              credentials: "include",
              method: "DELETE",
              headers: {
                "Content-Type": "application/json"
              } 
            }).then(response => response.json() as Promise<number>)
              .then(id => {
            });
            dispatch({ type: 'DELETE_CAT', payload: id});
            history.push(`/api/Category`);
        }
    }
};


const unloadedState: CategoryState = {
    cats: [],
    cat: { id: 0, catName: "", date: "" },
    isLoading: false
};


export const reducer: Reducer<CategoryState> = (state: CategoryState | undefined, incomingAction: Action): CategoryState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'GET_CAT':
            return {
                    cat: state.cat,
                    cats: action.payload,
                    isLoading: false
            };
        
        case 'ADD_CAT':
                return {
                    ...state,
                    cats: state.cats.concat(action.payload),
                    cat: action.payload,
                    isLoading: false
                };

        case 'ADD_CAT_SUCCESS':
            return {
                cats: state.cats,
                cat: { id: state.cat.id, catName: state.cat.catName, date: state.cat.date },
                isLoading: true
            };

        case 'EDIT_CAT':
            return {
                ...state,
                cats: state.cats.map(
                    (content, i) => content.id === action.payload.id ? { ...content, catName: action.payload.catName, date: action.payload.date }
                        : content)
            };
        case 'DELETE_CAT':
            return {
                ...state,
                cats: state.cats.filter(item => item.id !== action.payload)
            };
        default:
            return state;
    };
}



