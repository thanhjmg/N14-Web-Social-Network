import * as httpRequest from '~/utils/httpRequest';

export const getChatByIdMember = async (idMember) => {
    try {
        const res = await httpRequest.get('/chat/user_id', {
            params: {
                id: idMember,
            },
        });

        return res;
    } catch (error) {
        return null;
    }
};

export const addUserSeenToMess = async (idGroupChat, data) => {
    try {
        await httpRequest.put(`groupchat/${idGroupChat}`, data);

        return true;
    } catch (error) {
        console.log('Người dùng không tồn tại!');
    }
};
