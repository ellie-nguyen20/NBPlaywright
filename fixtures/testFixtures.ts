import { test as base, Page } from '@playwright/test';

type ErrorRequest = {
    url: string;
    status: number;
    responseBody?: string;
};

export const test = base.extend<{pageWithMonitoring: Page}>({
    pageWithMonitoring: [async ({ page }, use, testInfo) => {
        const failedRequests: ErrorRequest[] = [];

        page.on("response", async (response) => {
            const url = response.url();
            const status = response.status();
            
            if (status >= 400) {
                let responseBody = '';
                try {
                    responseBody = await response.text();
                } catch (error) {
                    responseBody = 'Unable to read response body';
                }

                failedRequests.push({
                    url,
                    status,
                    responseBody,
                });

                console.log(`❌ FAILED REQUEST:`);
                console.log(`   URL: ${url}`);
                console.log(`   Status: ${status}`);
                console.log(`   Response Body: ${responseBody}`);
                console.log(`   --------------------`);
            }
        });
        await use(page);
        if (failedRequests.length > 0) {
            await testInfo.attach("failed-requests.json", {
                body: JSON.stringify(failedRequests, null, 2),
                contentType: "application/json",
            });
            console.log(`Hey there were Failed requests: ${failedRequests.length}`);
        }
    }, { auto: true }],
});