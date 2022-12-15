import { hidden } from "public/util/popup"
import {
    INCOGNITO_PARTICIPANT,
    INCOGNITO_EVENT,
    INCOGNITO_USER,
    INCOGNITO_REWARD,
    USER_PARTICIPANT,
    USER_EVENT,
    USER_PACKAGE,
    USER_REWARD,
    REMOVE_STATE,
    USER_CURR_EVENT,
    USER_EVENT_CREATING,
    USER_REWARD_CREATING,
    USER_UPDATE_EVENT,
    USER_UPDATE_PARTICIPANT,
    USER_UPDATE_REWARD,
    USER_UPDATE_REWARD_CREATING,
    POPUP_MESSAGE,
    POPUP_STATUS,
    POPUP_VISIBLE
} from "./constants"

const joinState = {
    event: {},
    user: {},
    reward: {},
    participant: {}
}

const userState = {
    event: [],
    user: {},
    reward: [],
    participant: [],
    currEvent: {},
    currEventCreating: {},
    currRewardCreating: [],
}

const popUpState = {
    message: "",
    status: false,
    visible: hidden
}

export const playerReducer = (state = joinState, action) => {
    switch (action.type) {
        case INCOGNITO_EVENT: {
            return { ...state, event: action.payload }
        }
        case INCOGNITO_PARTICIPANT: {
            return { ...state, participant: action.payload }
        }
        case INCOGNITO_USER: {
            return { ...state, user: action.payload }
        }
        case INCOGNITO_REWARD: {
            return { ...state, reward: action.payload }
        }
        case REMOVE_STATE: {
            console.log("REMOVE STATE PLAYER")
            return {
                event: {},
                user: {},
                reward: {},
                participant: {}
            };
        }
        default:
            return state
    }
}
export const userReducer = (state = userState, action) => {
    switch (action.type) {
        case USER_EVENT: {
            return { ...state, event: [...state.event, ...action.payload] }
        }
        case USER_PARTICIPANT: {
            return { ...state, participant: [...state.participant, ...action.payload] }
        }
        case USER_PACKAGE: {
            return { ...state, user: action.payload }
        }
        case USER_REWARD: {
            return { ...state, reward: [...state.reward, ...action.payload] }
        }
        case USER_CURR_EVENT: {
            return { ...state, currEvent: action.payload }
        }
        case USER_EVENT_CREATING: {
            return { ...state, currEventCreating: action.payload }
        }
        case USER_REWARD_CREATING: {
            return { ...state, currRewardCreating: [...state.currRewardCreating, ...action.payload] }
        }
        case USER_UPDATE_EVENT: {
            var object = state.event.map((item, index) => {
                if (item.eventId === action.payload.eventId) {
                    state.event[index] = action.payload;
                    return state.event;
                }
                return [...state.event, ...action.payload];
            })
            return { ...state, event: object }
        }
        case USER_UPDATE_PARTICIPANT: {
            object = state.participant.map((item, index) => {
                if (item.participantId === action.payload.participantId) {
                    state.participant[index] = action.payload;
                    return state.participant;
                }
                return [...state.participant, ...action.payload];
            })
            return { ...state, participant: object }
        }
        case USER_UPDATE_REWARD: {
            object = state.reward.map((item, index) => {
                if (item.idReward === action.payload.idReward) {
                    state.reward[index] = action.payload;
                    return state.reward;
                }
                return [...state.reward, ...action.payload];
            })
            return { ...state, reward: object }
        }
        case USER_UPDATE_REWARD_CREATING: {
            object = state.currRewardCreating.map((item, index) => {
                if (item.idReward === action.payload.idReward) {
                    state.currRewardCreating[index] = action.payload;
                    return state.currRewardCreating;
                }
                return [...state.currRewardCreating, ...action.payload];
            })
            return { ...state, currRewardCreating: object }
        }
        case REMOVE_STATE: {
            console.log("REMOVE STATE USER")
            return {
                event: [],
                user: {},
                reward: [],
                participant: [],
                currEvent: {},
                currEventCreating: {},
                currRewardCreating: [],
            };
        }
        default:
            return state
    }
}
export const popUpReducer = (state = popUpState, action) => {
    switch (action.type) {
        case POPUP_MESSAGE: {
            return { ...state, message: action.payload }
        }
        case POPUP_STATUS: {
            return { ...state, status: action.payload }
        }
        case POPUP_VISIBLE: {
            return { ...state, visible: action.payload }
        }
        case REMOVE_STATE: {
            console.log("REMOVE STATE POPUP")
            return {
                message: "",
                status: false,
                visible: hidden
            };
        }
        default:
            return state
    }
}
