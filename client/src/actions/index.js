import history from '../history'
import streams from '../apis/streams'
import { 
    SIGN_IN, 
    SIGN_OUT, 
    CREATE_STREAM,
    FETCH_STREAMS,
    FETCH_STREAM, 
    DELETE_STREAM,
    EDIT_STREAM  
} from "./types"

export const signIn = (userId) => {
    return {
        type: SIGN_IN,
        payload: userId
    }
}

export const signOut = () => {
    return {
        type: SIGN_OUT
    }
}

export const createStream = formValues => async (dispatch, getState) => {
    const { userId } = getState().auth
    const response = await streams.post('/streams', { ...formValues, userId })
    dispatch({ type: CREATE_STREAM, payload: response.data })
    // Good UX for user to programatically navigate back to root 
    // So we created the history.js file so that dev is in charge of history
    // rather than React RouterDom
    // then we imported above and then:
    history.push('/')
}

export const fetchStreams = () => async dispatch => {
    const response = await streams.get('/streams')
    dispatch({ type: FETCH_STREAMS, payload: response.data })
}

export const fetchStream = (id) => async dispatch => {
    const response = await streams.get(`/streams/${id}`)
    dispatch({ type: FETCH_STREAM, payload: response.data })
}

export const deleteStream = (id) => async dispatch => {
    await streams.delete(`/streams/${id}`);
    dispatch({ type: DELETE_STREAM, payload: id });
    history.push('/');
}

export const editStream = (id, formValues) => async dispatch => {
    // we changed the streams.put method because otherwise it potentially deletes the userId that's attached to each stream
    // we didn't want to send userId back and forth so we used the _.pick method
    // and then updated this .put to .patch method so that id is not deleted from db when editing
    const response = await streams.patch(`/streams/${id}`, formValues)
    dispatch({ type: EDIT_STREAM, payload: response.data })
}