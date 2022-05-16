var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UI_ELEM, UI_BUTTONS, UI_MODALS, UI_FORMS, UI_INPUTS, loadedAllMessages, authorizationEmail, sendHistoryMessageUI, openCloseSettings, closeModal, showAuthorithationOk, clearInput } from "./view";
import { sendMessageWebSocket } from "./socket";
import { Rest_API_Data, getAboutMe, setSenderName, checkAuthorization, updateAboutMe } from "./service";
import { format } from 'date-fns';
import Cookies from 'js-cookie';
const messagesShowCount = 20;
const historyArray = [];
export const aboutMe = {
    name: 'Я',
    email: 'email',
};
console.log(aboutMe);
updateAboutMe();
checkAuthorization();
export function collectMessageData(text, sendTime, sender, email) {
    const messageData = {
        text: text,
        sendTime: format(new Date(sendTime), 'HH:mm'),
        sender: sender,
        email: email,
    };
    return messageData;
}
function getHistoryArray(array) {
    array.forEach((element) => {
        historyArray.push(element);
    });
}
getAboutMe(Rest_API_Data);
checkCookie();
const chatCodeApprove = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZhbmlsZmFuMTk5NEBtYWlsLnJ1IiwiaWF0IjoxNjUxNjg5NzE3LCJleHAiOjE2NTIxMzYxMTd9.BKRCbU-mMEv5LQ6wfGSgXkMmvLG70E8_qbW8DMbnBrs';
UI_BUTTONS.settings.addEventListener('click', openCloseSettings);
UI_BUTTONS.settingsClose.addEventListener('click', openCloseSettings);
UI_BUTTONS.authorizationClose.addEventListener('click', () => { closeModal(UI_MODALS.authorization); });
UI_BUTTONS.approveClose.addEventListener('click', () => { closeModal(UI_MODALS.approve); });
UI_FORMS.approve.addEventListener('submit', (event) => { event.preventDefault(); });
UI_FORMS.approve.addEventListener('submit', setApproveCodeCookie);
UI_FORMS.settings.addEventListener('submit', (event) => { event.preventDefault(); });
UI_FORMS.settings.addEventListener('submit', () => { changeUserName(Rest_API_Data); });
UI_FORMS.newMessage.addEventListener('submit', (event) => { event.preventDefault(); });
UI_FORMS.newMessage.addEventListener('submit', () => { sendMessageWebSocket(); });
UI_FORMS.newMessage.addEventListener('submit', clearInput);
UI_FORMS.authorization.addEventListener('submit', (event) => { event.preventDefault(); });
UI_FORMS.authorization.addEventListener('submit', () => { sendAuthorizationData(Rest_API_Data, authorizationEmail()); });
UI_ELEM.chatBlock.addEventListener('scroll', () => { addDisplayedMessages(messagesShowCount, historyArray); });
function loadData() {
    getHistory(Rest_API_Data, messagesShowCount);
    getAboutMe(Rest_API_Data);
}
function setApproveCodeCookie() {
    const approveCode = UI_INPUTS.approveCode.value;
    Cookies.set('approveCode', approveCode, { expires: 1 });
    UI_INPUTS.approveCode.value = '';
    closeModal(UI_MODALS.approve);
}
function checkCookie() {
    const notHasCookie = Cookies.get('approveCode') === '' || Cookies.get('approveCode') === undefined;
    if (!notHasCookie) {
        closeModal(UI_MODALS.approve);
        closeModal(UI_MODALS.authorization);
        loadData();
    }
    else {
        closeModal(UI_MODALS.dataLoad);
    }
}
function getHistory({ url, messageAPI }, count) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${url}/${messageAPI}`);
            const result = yield response.json();
            const messageArray = result.messages;
            getHistoryArray(messageArray);
            getMessageByCount(count, messageArray);
            UI_ELEM.messageList.scrollIntoView({ block: "end" });
            closeModal(UI_MODALS.dataLoad);
        }
        catch (error) {
            const errorMessage = `Error while Fetch running API: ${url}/${messageAPI}`;
            console.log(errorMessage, error.stack);
        }
    });
}
function changeUserName({ url, user }) {
    return __awaiter(this, void 0, void 0, function* () {
        const senderName = {
            name: UI_INPUTS.settings.value,
        };
        try {
            UI_ELEM.preloader.classList.add('display__preloader');
            setSenderName(senderName, url, user);
            aboutMe.name = senderName.name;
            getAboutMe(Rest_API_Data);
            UI_ELEM.preloader.classList.remove('display__preloader');
            closeModal(UI_MODALS.settings);
        }
        catch (error) {
            alert(error.stack);
        }
    });
}
function sendAuthorizationData({ url, user }, email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${url}/${user}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Methods': 'POST',
                },
                body: JSON.stringify(email),
            });
            const responseStatus = response.status;
            if (responseStatus === 200) {
                showAuthorithationOk();
                closeModal(UI_MODALS.authorization);
                console.log(response);
            }
            else {
                throw new Error();
            }
        }
        catch (error) {
            console.log(`Fetch ${user}`, error.stack);
        }
    });
}
function getMessageByCount(n, messagesJSON) {
    if (n < 1) {
        return;
    }
    getMessageByCount(n - 1, messagesJSON);
    const messageElem = messagesJSON[messagesJSON.length - n];
    const { text, createdAt, user: { email, name } } = messageElem;
    sendHistoryMessageUI(collectMessageData(text, createdAt, name, email));
}
function addDisplayedMessages(count, array) {
    const scrollAtTop = UI_ELEM.chatBlock.scrollTop;
    const isScrollAtTop = scrollAtTop === 0;
    if (array.length === 0) {
        loadedAllMessages('Все сообщения были загружены');
        return;
    }
    else if (isScrollAtTop) {
        const messageToShow = array.splice(-count, count);
        setTimeout(() => { getMessageByCount(count, messageToShow); }, 1000);
    }
}
