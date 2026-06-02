import { unstable_cache, revalidateTag } from "next/cache";
import db from "./db";
import { Prisma } from "@prisma/client";

type DbSetting = Prisma.SettingsGetPayload<{
    select: {
        key: true;
        value: true;
        switch: true;
    };
}>;

const getCachedSettings = unstable_cache(
    async () => {
        const settings = await db.settings.findMany({
            select: {
                key: true,
                value: true,
                switch: true,
            },
        });

        return settings.reduce((acc, item) => {
            acc[item.key] = {
                value: Number(item.value),
                switch: item.switch,
            };

            return acc;
        }, {} as Record<string, { value: number; switch: boolean }>);
    },
    ["settings-cache"],
    {
        tags: ["settings"],
    }
);

class Settings {

    public async luckySpinAmount(): Promise<{
        value: number;
        switch: boolean;
    }> {
        const allData = await getCachedSettings();
        return allData.luckySpin;
    }

    public async genOneAmount() {
        const allData = await getCachedSettings();
        return allData.gen_1;
    }

    public async genTwoAmount() {
        const allData = await getCachedSettings();
        return allData.gen_2;
    }

    public async genThreeAmount() {
        const allData = await getCachedSettings();
        return allData.gen_3;
    }

    public async jobParLoad() {
        const allData = await getCachedSettings();
        return allData.job_par_refresh;
    }
}

export default Settings;