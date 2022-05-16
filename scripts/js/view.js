import { aboutMe } from "./main";
export const UI_ELEM = {
    messageList: document.querySelector('.message__list'),
    chatTemplate: document.querySelector('.chat_template'),
    chatBlock: document.querySelector('.chatBlock'),
    preloader: document.querySelector('.preloader'),
    messageInfo: document.querySelector('.message__info'),
};
export const UI_INPUTS = {
    message: document.querySelector('.message__input'),
    approveCode: document.querySelector('.approve__input'),
    settings: document.querySelector('.settings__input'),
    authorization: document.querySelector('.authorization__input'),
};
export const UI_FORMS = {
    newMessage: document.querySelector('.new_message__form'),
    authorization: document.querySelector('.authorization__form'),
    approve: document.querySelector('.approve__form'),
    settings: document.querySelector('.settings__form'),
};
export const UI_BUTTONS = {
    settings: document.querySelector('.settings'),
    settingsClose: document.querySelector('.close__button'),
    authorizationClose: document.querySelector('.close__authorization'),
    approveClose: document.querySelector('.close__approve'),
    approve: document.querySelector('.approve__button'),
};
export const UI_MODALS = {
    settings: document.querySelector('.settings__modal'),
    approve: document.querySelector('.approve__modal'),
    authorization: document.querySelector('.authorization__modal'),
    dataLoad: document.querySelector('.data__load__modal'),
};
function createMessageUIContent(elem, text, sendTime, sender, email) {
    const NEW_MESSAGE = {
        text: elem.querySelector('.template_message__text'),
        sendTime: elem.querySelector('.send__time'),
        sender: elem.querySelector('.sender'),
    };
    const isSenderI = email === aboutMe.email;
    if (isSenderI) {
        elem.classList.add('my__message');
    }
    NEW_MESSAGE.text.innerText = text;
    NEW_MESSAGE.sendTime.innerText = sendTime;
    NEW_MESSAGE.sender.innerText = `${sender}: `;
}
export function sendNewMessageUI({ text, sendTime, sender, email }) {
    UI_ELEM.messageList.append(UI_ELEM.chatTemplate.content.cloneNode(true));
    const newMessageItem = UI_ELEM.messageList.lastElementChild;
    createMessageUIContent(newMessageItem, text, sendTime, sender, email);
    // Нужно ли действие ниже выносить в отдельную функцию?
    UI_ELEM.messageList.scrollIntoView({ block: "end" });
}
export function sendHistoryMessageUI({ text, sendTime, sender, email }) {
    UI_ELEM.messageList.prepend(UI_ELEM.chatTemplate.content.cloneNode(true));
    const newMessageItem = UI_ELEM.messageList.firstElementChild;
    createMessageUIContent(newMessageItem, text, sendTime, sender, email);
}
export function loadedAllMessages(text) {
    UI_ELEM.messageInfo.innerText = text;
}
export function openCloseSettings() {
    UI_MODALS.settings.classList.toggle('displayModal');
}
export function closeModal(modal) {
    modal.classList.remove('displayModal');
}
export function openModal(modal) {
    modal.classList.add('displayModal');
}
export function showAuthorithationOk() {
    alert("Авторизация прошла успешно, проверьте свою почту");
}
export function clearInput() {
    UI_INPUTS.message.value = '';
}
export const authorizationEmail = function getAuthorizationEmail() {
    const authorizationEmail = {
        email: UI_INPUTS.authorization.value
    };
    return authorizationEmail;
};
