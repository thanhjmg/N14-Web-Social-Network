import { useEffect, useState, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import Button from '~/components/Button';
import Avartar from '~/components/Avartar';
import { formatTime } from '~/lib/formatString';
import { getUserById } from '~/services/userService';
import { addUserSeenToMess } from '~/services/messageService';

import { getMessageById } from '~/services/messageService';
import { currentChat } from '~/redux/Slice/sidebarChatSlice';
import { getAxiosJWT } from '~/utils/httpConfigRefreshToken';

const cx = classNames;

function ItemChat({ groupChat, userLoginData }) {
    const dispatch = useDispatch();
    var currAuth = useSelector((state) => state.persistedReducer.auth);
    var currAccount = currAuth.currentUser;
    var accessToken = currAccount.accessToken;
    var axiosJWT = getAxiosJWT(dispatch, currAccount);

    const [messageLast, setMessageLast] = useState('');
    const [onlineValue, setOnlineValue] = useState('hidden');
    const [itemSeen, setItemSeen] = useState(false);

    var arrIdMessage = groupChat.message;

    useEffect(() => {
        const getMessageLast = async () => {
            var idLastMessage = arrIdMessage[arrIdMessage.length - 1];

            if (!!idLastMessage) {
                var message = await getMessageById(idLastMessage, accessToken, axiosJWT);

                setMessageLast(message);
            }
        };
        getMessageLast();

        var userChatOther = null;
        const checkOnlineChat = async () => {
            const NUMBER_MEMBER = 3;
            if (groupChat.member.length < NUMBER_MEMBER) {
                if (groupChat.member[0] !== userLoginData.id) {
                    userChatOther = await getUserById(groupChat.member[0], accessToken, axiosJWT);
                } else userChatOther = await getUserById(groupChat.member[1], accessToken, axiosJWT);

                if (userChatOther.statusOnline) {
                    setOnlineValue('');
                } else setOnlineValue('hidden');
            }
        };
        checkOnlineChat();
    }, []);

    const checkSeen = (arrSeen, userId) => {
        if (!!arrSeen) {
            for (var user of arrSeen) {
                if (user.id === userId) {
                    return true;
                }
            }
        }
        return false;
    };

    const getMessageLast = () => {
        var titleMess = '',
            messCreatedAt = '',
            arrAuthorName = [];
        if (!!messageLast) {
            titleMess = messageLast.title || '';
            messCreatedAt = formatTime(messageLast.createdAt, 'hh:mm') || '';
            var fullNameAuthor = messageLast.authorID.fullName;

            arrAuthorName = fullNameAuthor.split(' ');
        }

        var arrUserSeen = messageLast.seen;

        var seen = checkSeen(arrUserSeen, userLoginData.id);

        var classSeen = {
            textName: 'font-medium ',
            textChatTitle: 'text-gray-400',
            circleSeen: 'hidden',
        };
        if (!seen) {
            classSeen = {
                textName: 'font-semibold ',
                textChatTitle: 'text-gray-900',
                circleSeen: '',
            };
        }
        return {
            authorName: arrAuthorName[arrAuthorName.length - 1] || '',
            title: titleMess,
            messCreatedAt,
            classSeen,
        };
    };
    var itemDataChat = getMessageLast();

    const putUserSeen = async (idMess, dataSeen) => {
        await addUserSeenToMess(idMess, dataSeen, accessToken, axiosJWT);
    };

    const handleClickChat = () => {
        var currentDate = new Date();
        var userClickSeen = {
            id: userLoginData.id,
            seenAt: currentDate,
        };

        var seen = checkSeen(messageLast.seen, userClickSeen.id);
        if (!seen) {
            if (putUserSeen(messageLast.id, userClickSeen)) {
                setItemSeen(true);
            }
        }
        dispatch(currentChat(groupChat));
    };

    return (
        <>
            {!!itemDataChat ? (
                <Button
                    type="button"
                    onClick={handleClickChat}
                    className={cx('rounded-xl h-16 w-full hover:bg-lcn-blue-3 m-0 p-2 mb-1 mt-1')}
                >
                    <div className={cx('relative w-full h-full flex items-center')}>
                        <Avartar className={cx('h-10 w-10')} src={groupChat.avatar} />
                        <div
                            className={cx(
                                'bg-lcn-green-1 w-3 h-3 absolute  rounded-full bottom-[2px] left-7',
                                onlineValue,
                            )}
                        ></div>
                        <div className={cx('w-40  h-full ml-2 overflow-hidden')}>
                            <div className={cx('text-left text-lcn-blue-5 h-8 w-96 ', itemDataChat.classSeen.textName)}>
                                {groupChat.name}
                            </div>
                            <div className={cx(' text-xs text-left h-8')}>
                                <span>{itemDataChat.authorName}: </span> {itemDataChat.title}
                            </div>
                        </div>
                        <div className={cx('h-full w-8 relative')}>
                            <div
                                className={cx(
                                    'h-3 w-3 bg-lcn-blue-4 rounded-full  absolute top-4 right-0',
                                    itemDataChat.classSeen.circleSeen,
                                )}
                            ></div>
                            <div
                                className={cx(
                                    'text-gray-500 text-xs text-left h-full flex items-end',
                                    itemDataChat.classSeen.textChatTitle,
                                )}
                            >
                                {itemDataChat.messCreatedAt}
                            </div>
                        </div>
                    </div>
                </Button>
            ) : (
                <></>
            )}
        </>
    );
}

export default memo(ItemChat);
