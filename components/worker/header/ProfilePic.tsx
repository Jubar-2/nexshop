"use client";

import Image from 'next/image';
import Logo from '@/public/image/logo.png';

export default function ProfilePic() {
    return (
        <Image src={Logo} alt="Logo" width={24} height={24} />
    )
}

