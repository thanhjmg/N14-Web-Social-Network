import classNames from 'classnames/bind';
import styles from './ContentProfile.module.scss';
import HeaderProfile from '~/components/HeaderProfile';
import Button from '~/components/Button';
import SubProfile from '~/components/SubProfile';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { RiChat3Line } from 'react-icons/ri';
import { lcnImage } from '~/image';

const cx = classNames.bind(styles);

function ContentProfile() {
    return (
        <div className={cx(' w-full h-full relative flex overflow-hidden justify-center items-center')}>
            <div className={cx(' w-full h-screen flex flex-col items-center  overflow-y-scroll')}>
                <HeaderProfile avatar={lcnImage.avatarDefault} coverPhoto={lcnImage.coverPhoto} userName="Trọng Phan" />
                <div className={cx('w-full h-14 flex justify-center')}>
                    <div className={cx('w-1/4 h-full flex flex-row justify-between ')}>
                        <Button
                            className={cx(
                                'bg-lcn-blue-3 justify-center items-center w-28 h-10 text-lcn-blue-4 border border-lcn-blue-3',
                            )}
                        >
                            <AiOutlineUsergroupAdd />
                            Kết bạn
                        </Button>
                        <Button
                            className={cx(
                                'bg-lcn-green-1 bg-opacity-20 border border-lcn-green-1 border-opacity-25 justify-center items-center w-28 h-10 text-lcn-green-1 hover:bg-opacity-30',
                                'active:bg-opacity-40',
                            )}
                        >
                            <RiChat3Line /> Nhắn tin
                        </Button>
                    </div>
                </div>
                <div className={cx('w-full h-full bg-lcn-blue-1')}>
                    <div className={cx('w-full  p-3 flex flex-row justify-around')}>
                        <SubProfile />
                        <SubProfile type="banbe" soLuongBan="20" />
                        <SubProfile type="img" soLuongAnh="11" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContentProfile;
