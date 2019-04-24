const  initialState = {
    login_status: false,
    access_token: ''
};

const reducer = (state = initialState, action) =>
{
    const newState = {...state};

    if(action.type === 'login')
    {
        newState.login_status = true;
        newState.access_token = action.val;
    }

    if(action.type === 'logout')
    {
        newState.login_status = false;
        newState.access_token = action.val;
    }

    return newState;
};

export default reducer;