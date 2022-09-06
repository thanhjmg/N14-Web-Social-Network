import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import { memo } from 'react';

import { FaPhone, FaVideo, FaInfoCircle } from 'react-icons/fa';

import styles from './ContentChat.module.scss';
import Button from '~/components/Button';
import { lcnImage } from '~/image';
import ContentMessage from '~/components/ContentMessage';
import InputSend from '~/components/InputSend';
import MiniProfile from '~/components/MiniProfile';

const cx = classNames.bind(styles);

function ContentChat() {
    var [widthValue, setWidthValue] = useState('');

    const showMiniProfile = () => {
        if (widthValue === 'ease-right-to-left') return <MiniProfile profileIn={true} />;
        else return <MiniProfile profileIn={false} />;
    };

    const onClickInfo = () => {
        if (widthValue === 'ease-left-to-right' || widthValue === '') setWidthValue('ease-right-to-left');
        else setWidthValue('ease-left-to-right');
    };

    return (
        <div className={cx(' w-full flex overflow-hidden')}>
            <div className={cx('w-full  h-full  justify-between relative')}>
                <div className={cx('h-16 bg-lcn-blue-2 w-full flex absolute top-0')}>
                    <div className={cx('w-1/2  h-full flex pl-4')}>
                        <Button>
                            <div
                                className={cx(
                                    'w-12 h-12 bg-lcn-blue-4 rounded-full overflow-hidden flex justify-center items-center p-1  relative',
                                )}
                            >
                                <img
                                    src={lcnImage.avatarDefault}
                                    alt="avartar"
                                    className={cx('w-full h-full border ')}
                                />
                            </div>
                        </Button>
                        <div>
                            <Button className="text-lcn-blue-5 font-semibold text-lg m-0">Trọng Phan</Button>
                            <span className={cx('h-3 w-3 bg-lcn-green-1 rounded-full inline-block ml-2')}></span>
                            <div className={cx('text-xs text-slate-500 ml-1')}>Đang hoạt động</div>
                        </div>
                    </div>
                    <div className={cx('w-1/2  h-full flex pl-4 justify-end')}>
                        <Button className="mr-4">
                            <FaPhone className="text-lcn-blue-4 text-2xl" />
                        </Button>
                        <Button className="mr-4">
                            <FaVideo className="text-lcn-blue-4 text-2xl" />
                        </Button>
                        <Button className="mr-4" onClick={onClickInfo}>
                            <FaInfoCircle className="text-lcn-blue-4 text-2xl" />
                        </Button>
                    </div>
                </div>
                <ContentMessage />
                <InputSend />
            </div>
            <div className={cx('bg-white h-full', widthValue)}>{showMiniProfile()}</div>
        </div>
    );
}

export default memo(ContentChat);