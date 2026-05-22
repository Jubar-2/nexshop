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

class Settings {

    private getAllSettings = unstable_cache(
        async () => {

            const settings = await db.settings.findMany(
                {
                    select: {
                        key: true,
                        value: true,
                        switch: true,
                    },
                }
            );

            const object: Record<
                string,
                {
                    value: number;
                    switch: boolean;
                }
            > = {};

            settings.forEach((data: DbSetting) => {

                object[data.key] = {
                    value: +data.value,
                    switch: data.switch,
                };
            });

            return object;
        },

        ["settings-cache"],

        {
            tags: ["settings"],
        }
    );

    public async luckySpinAmount() {
        const allData = await this.getAllSettings();
        return allData.luckySpin;
    }

    public async genOneAmount() {
        const allData = await this.getAllSettings();
        return allData.gen_1;
    }

    public async genTwoAmount() {
        const allData = await this.getAllSettings();
        return allData.gen_2;
    }

    public async genThreeAmount() {
        const allData = await this.getAllSettings();
        return allData.gen_3;
    }

    public async jobParLoad() {
        const allData = await this.getAllSettings();
        return allData.job_par_refresh;
    }
}

export default Settings;