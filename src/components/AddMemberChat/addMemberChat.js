import classNames from 'classnames';

import Button from '~/components/Button';

import { useState, memo, useEffect } from 'react';

import Modal from '~/components/Modal';
import Avartar from '~/components/Avartar';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { getAllFriend } from '~/services/userService';
import { addMemberToChat } from '~/services/chatService';
import { inCludesString } from '~/lib/regexString';

import { addMess } from '~/services/messageService';
import socket from '~/utils/getSocketIO';
import { getUserById } from '~/services/userService';
import { requestMemberChat } from '~/services/chatService';

const cx = classNames;
function AddMemberChat({ accessToken, axiosJWT, curChat, curUser }) {
    const [showModal, setShowModal] = useState(false);
    const [listMember, setListMember] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [listChecked, setListChecked] = useState([]);

    useEffect(() => {
        const fectUser = async () => {
            let userLoginFetch = await getAllFriend(curUser.id, accessToken, axiosJWT);

            let arrMember = userLoginFetch[0].friend.filter((item) => !item.listGroup.includes(curChat.id));
            setListMember(arrMember);
        };
        if (showModal === true) fectUser();
    }, [showModal]);

    const handleShowModal = async () => {
        setShowModal(true);
    };
    const handleHideModal = () => {
        setListChecked([]);
        setListMember([]);
        setShowModal(false);
    };
    const getAllChecked = (e) => {
        // add to list
        if (e.target.checked) {
            setListChecked((prev) => [...prev, e.target.value]);
        } else {
            // remove from list
            setListChecked(listChecked.filter((item) => item !== e.target.value));
        }
    };
    const renderItemMember = () => {
        if (listMember.length > 0) {
            let arrAdmin = listMember.filter((member) => {
                if (curChat.adminChat.includes(member._id) && inCludesString(searchValue, member.fullName)) {
                    member.isAdmin = true;
                    return true;
                }
                return false;
            });
            let arrMember = listMember.filter((member) => {
                if (!curChat.adminChat.includes(member._id) && inCludesString(searchValue, member.fullName))
                    return true;
                else return false;
            });
            let arrMemberFilter = [...arrAdmin, ...arrMember];
            return arrMemberFilter.map((item) => {
                if (!curChat.memberWaiting.includes(item._id))
                    return (
                        <label
                            htmlFor={item._id}
                            key={item._id}
                            className={cx('w-full h-14 hover:bg-lcn-blue-2 p-2 flex m-t-2 rounded-md items-center ')}
                        >
                            <input
                                type="checkbox"
                                name="chkMember"
                                id={item._id}
                                className={cx('')}
                                onChange={getAllChecked}
                                value={item._id}
                            />

                            <Avartar src={item.profile?.urlAvartar} className={cx('h-11 w-11 mr-2 ml-2')} />
                            <div className={cx()}>{item.fullName}</div>
                        </label>
                    );
                else
                    return (
                        <label
                            key={item._id}
                            className={cx('w-full h-14 hover:bg-lcn-blue-2 p-2 flex m-t-2 rounded-md items-center ')}
                        >
                            <span className="w-3"></span>

                            <Avartar src={item.profile?.urlAvartar} className={cx('h-11 w-11 mr-2 ml-2')} />
                            <div className={cx()}>{item.fullName}</div>
                            <span className="font-semibold text-xs text-lcn-blue-4 bg-lcn-blue-1 p-1 ml-2 border border-lcn-blue-2 rounded-3xl">
                                Đang chờ duyệt
                            </span>
                        </label>
                    );
            });
        }
    };
    const handleSearchMember = (e) => {
        let valueSearch = e.target.value;
        setSearchValue(valueSearch);
    };
    const saveMessSystem = async (id, text) => {
        var newMessSave = {
            title: text,
            authorID: curUser.id,
            seen: [{ id: curUser.id, seenAt: Date.now() }],
            type_mess: 'system',
            idChat: id,
            status: 1,
            file: [],
        };
        if (!!newMessSave) {
            var messData = await addMess(newMessSave, accessToken, axiosJWT);
            messData = {
                ...messData,
                authorID: {
                    id: curUser.id,
                    fullName: curUser.fullName,
                    profile: {
                        urlAvartar: curUser.profile.urlAvartar,
                    },
                },
            };
            socket.emit('sendMessage', {
                receiverId: id,
                contentMessage: messData,
            });
        }
    };

    const handleAddMember = async () => {
        if (!!listChecked && listChecked.length > 0) {
            var dataNewChat;
            if (curChat.status === 2 && curChat.adminChat.includes(curUser.id)) {
                dataNewChat = await requestMemberChat(curChat.id, listChecked, 'accept', accessToken, axiosJWT);
            } else dataNewChat = await addMemberToChat(curChat.id, listChecked, accessToken, axiosJWT);

            if (!!dataNewChat) {
                if (dataNewChat.status === 1 || curChat.adminChat.includes(curUser.id)) {
                    for (let memberId of listChecked) {
                        var member = await getUserById(memberId, accessToken, axiosJWT);
                        saveMessSystem(dataNewChat.id, curUser.fullName + ' đã thêm ' + member.fullName);
                    }
                } else {
                    saveMessSystem(dataNewChat.id, listChecked.length + ' thành viên đang chờ duyệt ');
                }
                setListChecked([]);
                setListMember([]);
                setShowModal(false);
            }
        }
    };

    const renderModalShowMember = () => {
        if (listMember.length > 0) {
            return (
                <Modal isShow={showModal} className={cx('w-96 text-black p-2 overflow-hidden')}>
                    <h4 className="text-center font-semibold border-b border-lcn-blue-3">Thêm thành viên nhóm</h4>
                    <div
                        className={cx(
                            'border border-lcn-blue-4 rounded-3xl w-full h-11 flex items-center p-1 pr-4 pl-4 mt-2',
                        )}
                    >
                        <input
                            type="text"
                            placeholder="Tìm thành viên"
                            className={cx('outline-none w-full h-full caret-lcn-blue-4')}
                            onChange={handleSearchMember}
                        />
                    </div>
                    <div className={cx('h-3/4 w-full overflow-scroll p-2')}>{renderItemMember()}</div>
                    <div className={cx('flex justify-between self-end border-t border-lcn-blue-2')}>
                        <Button
                            type="button"
                            className={cx('bg-slate-400 p-1 pr-3 pl-3 text-white text-sm')}
                            onClick={handleHideModal}
                        >
                            Huỷ
                        </Button>
                        <Button
                            type="button"
                            className={cx('bg-lcn-1 p-1 pr-3 pl-3 text-white bg-lcn-blue-4 bg-opacity-100')}
                            onClick={handleAddMember}
                        >
                            Thêm thành viên
                        </Button>
                    </div>
                </Modal>
            );
        }
        return (
            <Modal isShow={showModal} className={cx('w-96 text-black p-2 overflow-hidden')}>
                <h4 className="text-center font-semibold border-b border-lcn-blue-3">Thêm thành viên nhóm</h4>
                <div
                    className={cx(
                        'border border-lcn-blue-4 rounded-3xl w-full h-11 flex items-center p-1 pr-4 pl-4 mt-2',
                    )}
                >
                    <input
                        type="text"
                        placeholder="Tìm thành viên"
                        className={cx('outline-none w-full h-full caret-lcn-blue-4')}
                    />
                </div>
                <div className={cx('h-3/4 w-full  overflow-scroll p-2')}>Tất cả bạn bè của bạn đã vào nhóm</div>
                <div className={cx('flex justify-between self-end border-t border-lcn-blue-2')}>
                    <Button
                        type="button"
                        className={cx('bg-slate-400 w-full p-1 pr-3 pl-3 text-white text-sm justify-center')}
                        onClick={handleHideModal}
                    >
                        Huỷ
                    </Button>
                </div>
            </Modal>
        );
    };
    return (
        <>
            <Button className={cx('flex   w-full  p-2 hover:bg-lcn-blue-3')} onClick={handleShowModal}>
                <div className={cx('flex items-center')}>
                    <AiOutlineUserAdd className={cx('text-lcn-blue-4 w-7 h-7 ')} />{' '}
                    <span className={cx('  ml-4  w-4/5 ')}>Thêm thành viên</span>
                </div>
            </Button>
            {renderModalShowMember()}
        </>
    );
}

export default memo(AddMemberChat);
