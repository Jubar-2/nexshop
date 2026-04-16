export interface ImgBBData {
    id: string;
    title: string;
    url_viewer: string;
    url: string; // This is the direct image link
    display_url: string;
    size: number;
    time: string;
    expiration: string;
    image: {
        filename: string;
        name: string;
        mime: string;
        extension: string;
        url: string;
    };
    thumb: {
        filename: string;
        name: string;
        mime: string;
        extension: string;
        url: string;
    };
    delete_url: string;
}

export interface ImgBBResponse {
    data: ImgBBData;
    success: boolean;
    status: number;
}