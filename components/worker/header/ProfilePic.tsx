"use client";

import Image from 'next/image';
import Logo from '@/public/image/logo.png';
import { useGetProfile } from '@/hooks/use-freelancer';

export default function ProfilePic() {
    const { data, isLoading } = useGetProfile();
    console.log(data)
    return (
        <Image src={Logo} alt="Logo" width={24} height={24} />
    )
}

