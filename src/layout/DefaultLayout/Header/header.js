import classNames from 'classnames';
import { useState, useCallback, useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';

import { AiOutlineMessage, AiFillMessage, AiFillSetting, AiOutlineSetting } from 'react-icons/ai';
import { RiUserLine, RiUserFill, RiQrCodeLine } from 'react-icons/ri';
import { FaTimes } from 'react-icons/fa';
import { BiCopyAlt, BiLogInCircle, BiUserCircle } from 'react-icons/bi';
import { HiNewspaper, HiOutlineNewspaper } from 'react-icons/hi';

import config from '~/configRoutes';
import { lcnImage } from '~/image';
import Button from '~/components/Button';
import ItemMenu from '~/components/ItemMenu';
import Modal from '~/components/Modal';

import Dropdown from '~/components/Dropdown';
import ItemDropdown from '~/components/Dropdown/ItemDropdown';
import { logOutSuccess } from '~/redux/Slice/authSlice';
import { userLogin } from '~/redux/Slice/signInSlice';
import Avartar from '~/components/Avartar';
import { logout } from '~/services/authService';
import { getAxiosJWT } from '~/utils/httpConfigRefreshToken';
import { removeCurrentChat } from '~/redux/Slice/sidebarChatSlice';

const cx = classNames;

function Header({ userLoginData }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [hiddenMenu, setHiddenMenu] = useState('hidden');
    const [linkQR, setLinkQR] = useState('');
    const [copied, setCopied] = useState('opacity-0');

    var qrURL = 'http://localhost:3000' + config.routeConfig.profile + '?id=' + userLoginData?.id;

    var currAuth = useSelector((state) => state.persistedReducer.auth);
    var currAccount = currAuth.currentUser;
    var axiosJWT = getAxiosJWT(dispatch, currAccount);

    useEffect(() => {
        const generateQRCode = async (value) => {
            try {
                const resp = await QRCode.toDataURL(value);
                setLinkQR(resp);
            } catch (error) {
                console.log(error);
            }
        };

        generateQRCode(qrURL);
    });

    const handleShowModal = () => {
        setShowModal(true);
    };
    const handleHideModal = () => {
        setShowModal(false);
        setCopied('opacity-0');
    };
    const handleHiddenMenu = useCallback(() => {
        setHiddenMenu('hidden');
        setShowMenu(false);
    }, []);
    const handleShowMenu = () => {
        if (showMenu === false) {
            setHiddenMenu('');
            setShowMenu(true);
        } else {
            setHiddenMenu('hidden');
            setShowMenu(false);
        }
    };

    const renderData = () => {
        const linkTrangCaNhan = config.routeConfig.profile + `?id=${userLoginData.id}`;
        return (
            <>
                <ItemDropdown
                    to={linkTrangCaNhan}
                    className={cx('rounded-md text-lcn-blue-5 text-center font-medium ')}
                >
                    <BiUserCircle className={cx('text-xl text-lcn-blue-5 mr-3')} />
                    Trang cá nhân
                </ItemDropdown>
                <ItemDropdown className={cx('rounded-md text-red-500 font-medium ')} onClick={handleLogOut}>
                    <BiLogInCircle className="text-xl text-red-500 mr-3" />
                    Đăng xuất
                </ItemDropdown>
            </>
        );
    };
    const handleLoadMenu = (attrs) => {
        return (
            <div
                className={cx('w-52 bg-white border border-lcn-blue-2 rounded-lg shadow-lg p-2', hiddenMenu)}
                tabIndex="-1"
                {...attrs}
            >
                {renderData()}
            </div>
        );
    };

    const handleLogOut = async () => {
        await logout(dispatch, navigate, currAccount.accessToken, axiosJWT);
        dispatch(logOutSuccess());
        dispatch(userLogin(null));
        dispatch(removeCurrentChat());
        navigate(config.routeConfig.signIn);
    };

    const handleCoppy = () => {
        navigator.clipboard.writeText(qrURL);
        setCopied('ani-show');
    };

    return (
        <div className="  bg-lcn-blue-2 w-full h-screen ">
            <div className={cx('h-1/6 w-full flex pt-4')}>
                <Button to={config.routeConfig.home} className="h-10 w-full ">
                    <img src={lcnImage.logo1} alt="logo" className="bg-none h-16 w-full " />
                </Button>
                <div className=""></div>
            </div>
            <div className={cx('h-2/6 w-full ')}>
                <ItemMenu to={config.routeConfig.home} icon1={AiOutlineMessage} icon2={AiFillMessage} tip="Tin nhắn" />
                <ItemMenu to={config.routeConfig.friends} icon1={RiUserLine} icon2={RiUserFill} tip="Bạn bè" />
            </div>
            <div className={cx('h-3/6 w-full flex  flex-col justify-end items-center')}>
                <div className={cx('pr-1 pl-1 w-full')}>
                    <Button className="h-14 w-full m-0 flex justify-center" onClick={handleShowModal}>
                        <div
                            className={cx(
                                ' w-full h-full flex justify-center  items-center rounded-xl',
                                'hover:bg-lcn-blue-4 hover:bg-opacity-70 active:bg-opacity-100',
                                'hover-white',
                            )}
                        >
                            <RiQrCodeLine className={cx('hover-text-white', 'text-2xl  text-lcn-blue-4')} />
                        </div>
                    </Button>
                    <Modal isShow={showModal} isHidden={handleHideModal}>
                        <div className={cx('flex p-4 border-b border-lcn-blue-2')}>
                            <div className="w-1/3"></div>
                            <p className={cx('w-1/3 text-xl text-lcn-blue-4 font-semibold text-center')}>
                                Mã QR của bạn
                            </p>
                            <div className={cx('w-1/3 flex justify-end')}>
                                <Button
                                    className={cx(' text-red-500 hover:text-white hover:bg-red-500')}
                                    onClick={handleHideModal}
                                >
                                    <FaTimes />
                                </Button>
                            </div>
                        </div>
                        <div className={cx('flex w-full h-56 justify-center items-center')}>
                            <img src={linkQR} alt="qrcode" className={cx('w-40')} />
                        </div>
                        <div className={cx('flex w-full h-20 mt-0 justify-center')}>
                            <input
                                type="text"
                                className={cx(
                                    'w-[400px] h-12 p-3 border border-lcn-blue-4 rounded-3xl outline-none text-gray-500 text-center',
                                )}
                                placeholder="link profile"
                                readOnly
                                value={userLoginData.id}
                            />
                        </div>
                        <div className={cx('flex justify-center text-red-600')}>
                            <Button
                                className={cx(
                                    'bg-lcn-blue-1 border border-lcn-blue-4 text-lcn-blue-4 h-12 p-3 ml-2 mt-0 text-2xl justify-center',
                                )}
                                onClick={handleCoppy}
                            >
                                <BiCopyAlt /> <span className={cx('text-base ml-2')}>Sao chép link</span>
                            </Button>
                        </div>
                        <div className={cx('flex justify-center text-lcn-green-1', copied)}>Đã sao chép thành công</div>
                    </Modal>
                </div>

                <ItemMenu
                    to={config.routeConfig.setting}
                    icon1={AiOutlineSetting}
                    icon2={AiFillSetting}
                    tip="Cài đặt"
                />
                <Dropdown render={handleLoadMenu} visible={showMenu} hidden={handleHiddenMenu}>
                    <div>
                        <Button type="button" className={cx(' mb-7 mt-3 ')} onClick={handleShowMenu}>
                            <Avartar
                                src={userLoginData?.profile?.urlAvartar}
                                className={cx('h-14 w-14 bg-lcn-blue-4 border border-lcn-blue-4 ')}
                            />
                        </Button>
                    </div>
                </Dropdown>
            </div>
        </div>
    );
}

export default memo(Header);
