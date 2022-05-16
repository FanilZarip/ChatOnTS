var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Cookies from 'js-cookie';
import { aboutMe } from './main';
import { openModal, closeModal, UI_MODALS } from './view';
import { AuthorizationError } from './errors.js';
const ERROR_MESSAGES = {
    setUserName: 'Error while seting userData\n',
    checkToken: 'Check your token',
};
export const Rest_API_Data = {
    url: 'https://mighty-cove-31255.herokuapp.com/api',
    messageAPI: 'messages',
    senderAPI: 'user/me',
    user: 'user',
    webSocket: `wss://mighty-cove-31255.herokuapp.com/websockets?${Cookies.get('approveCode')}`,
    bearer: `Bearer ${Cookies.get('approveCode')}`,
};
export function getAboutMe({ url, senderAPI, bearer }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${url}/${senderAPI}`, {
                method: 'GET',
                headers: {
                    Authorization: bearer,
                },
            });
            return response;
        }
        catch (error) {
            alert(`Error while Fetch running API: ${senderAPI}\n Check console log for details \n ${error.stack}`);
            console.log(error.stack);
        }
    });
}
export function checkAuthorization() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield getAboutMe(Rest_API_Data);
            const authorizationError = response.status === 401;
            if (authorizationError) {
                openModal(UI_MODALS.approve);
                openModal(UI_MODALS.authorization);
                closeModal(UI_MODALS.dataLoad);
                throw new AuthorizationError('Ошибка авторизации');
            }
        }
        catch (err) {
            if (err instanceof AuthorizationError) {
                alert("Проверьте токен: " + err.message);
            }
            else {
                console.log(err);
            }
        }
    });
}
export function updateAboutMe() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield getAboutMe(Rest_API_Data);
            const aboutMeJSON = yield response.json();
            const { name, email } = aboutMeJSON;
            aboutMe.name = name;
            aboutMe.email = email;
        }
        catch (error) {
            console.log(error);
            console.log('error while updating data');
        }
    });
}
export function setSenderName(name, url, user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userName = yield fetch(`${url}/${user}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${Cookies.get('approveCode')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(name),
            });
        }
        catch (error) {
            console.log(ERROR_MESSAGES.setUserName, error.stack);
        }
    });
}
