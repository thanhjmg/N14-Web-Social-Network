import classNames from 'classnames';
import { useEffect, useState, memo } from 'react';
import { useSelector } from 'react-redux';

import ItemChat from '~/components/ItemChat';
import { getChatByIdMember } from '~/services/chatService';

const cx = classNames;

function SideBarChat() {
    const userLoginData = useSelector((state) => state.persistedReducer.signIn.userLogin);

    const [chatResult, setChatResult] = useState([]);

    useEffect(() => {
        const fetchChat = async () => {
            const arrChat = await getChatByIdMember(userLoginData.id);

            setChatResult(arrChat);
        };
        fetchChat();
    }, []);

    const handleRenderChat = () => {
        if (chatResult.length > 0)
            return chatResult.map((item) => <ItemChat key={item.id} groupChat={item} userLoginData={userLoginData} />);
        else return <></>;
    };

    return <div className={cx('p-2 h-screen overflow-y-auto')}>{handleRenderChat()}</div>;
}

export default memo(SideBarChat);
