import classNames from 'classnames';

import HeaderProfile from '~/components/HeaderProfile';

import GioiThieu from '~/components/GioiThieu';
import Button from '~/components/Button';

import { BiEdit, BiBlock } from 'react-icons/bi';

import { useDispatch, useSelector } from 'react-redux';

import { getAxiosJWT } from '~/utils/httpConfigRefreshToken';
import { getUserById } from '~/services/userService';
import { useEffect, useState } from 'react';
import config from '~/configRoutes';

const cx = classNames;
function Inbox() {
    const dispatch = useDispatch();
    var currAuth = useSelector((state) => state.persistedReducer.auth);
    var currAccount = currAuth.currentUser;
    var accessToken = currAccount.accessToken;
    var axiosJWT = getAxiosJWT(dispatch, currAccount);

    var curChat = useSelector((state) => state.sidebarChatSlice.currentChat);

    var curSignIn = useSelector((state) => state.persistedReducer.signIn);
    var curUser = curSignIn.userLogin;

    const [receiver, setReceiver] = useState();

    useEffect(() => {
        const infoInbox = async () => {
            const idReceiver = curChat.member.filter((member) => {
                return member !== curUser.id;
            });
            var receiverFetch = await getUserById(idReceiver[0], curUser.id, accessToken, axiosJWT, dispatch);
            console.log(receiverFetch);
            setReceiver(receiverFetch);
        };
        infoInbox();
    }, [curChat]);

    return (
        <>
            <HeaderProfile
                avatar={receiver?.profile?.urlAvartar}
                coverPhoto={receiver?.profile?.urlCoverPhoto}
                userName={receiver?.fullName}
            />
            <GioiThieu
                birthday={receiver?.birthday}
                education={receiver?.profile?.education}
                gender={receiver?.gender}
                email={receiver?.email}
            />
            <div className={cx('w-full h-0  border-t border-lcn-blue-3 ', '')}>
                <div className={cx(' bg-lcn-blue-1 flex flex-col items-center p-5 pt-3  text-lcn-blue-4', '')}>
                    <Button
                        to={config.routeConfig.profile + `?id=${receiver?.id}`}
                        className={cx(
                            'bg-lcn-blue-4 bg-opacity-20 text-lcn-blue-5 p-2 pr-4 pl-4 w-full mb-3 justify-center',
                        )}
                    >
                        Xem trang cá nhân
                    </Button>
                    <Button className={cx('flex   w-full  p-2 hover:bg-lcn-blue-3')}>
                        <div className={cx('flex items-center')}>
                            <BiEdit className={cx('text-lcn-blue-4 w-7 h-7 ')} />{' '}
                            <span className={cx('  ml-4  w-4/5 ')}>Đổi biệt danh</span>
                        </div>
                    </Button>

                    <Button className={cx('flex   w-full p-2 hover:bg-red-200')}>
                        <div className={cx('flex items-center')}>
                            <BiBlock className={cx('text-red-500 w-7 h-7 ')} />{' '}
                            <span className={cx('  ml-4  w-4/5 text-red-500 ')}>Chặn</span>
                        </div>
                    </Button>
                </div>
            </div>
        </>
    );
}

export default Inbox;
