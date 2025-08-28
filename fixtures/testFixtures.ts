import { test as base, Page } from '@playwright/test';

type ErrorRequest = {
    url: string;
    status: number;
    responseBody?: string;
};

export const test = base.extend<{pageWithMonitoring: Page}>({
    pageWithMonitoring: [async ({ page }, use, testInfo) => {
        //set up monitoring
        const failedRequests: ErrorRequest[] = [];

        page.on("response", async (response) => {
            const url = response.url();
            const status = response.status();
            console.log(`Response: ${url} - Status: ${status}`);

            if (status >= 400) {
                let responseBody = '';
                try {
                    // Capture response body for failed requests
                    responseBody = await response.text();
                } catch (error) {
                    responseBody = 'Unable to read response body';
                }

                failedRequests.push({
                    url,
                    status,
                    responseBody,
                });

                // Log failed request details immediately
                console.log(`❌ FAILED REQUEST:`);
                console.log(`   URL: ${url}`);
                console.log(`   Status: ${status}`);
                console.log(`   Response Body: ${responseBody}`);
                console.log(`   --------------------`);
            }
        });
        await use(page);
        //tear down monitoring
        if (failedRequests.length > 0) {
            await testInfo.attach("failed-requests.json", {
                body: JSON.stringify(failedRequests, null, 2),
                contentType: "application/json",
            });
            throw new Error(`Hey there were Failed requests...`);
        }
    }, { auto: true }],
});