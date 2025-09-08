import { test as base, Page } from '@playwright/test';

type ErrorRequest = {
    url: string;
    status: number;
    responseBody?: string;
};

type LogEntry = { 
    message: string; 
    type: string;
    timestamp: number;
};

export const test = base.extend<{
    page: Page;
    logs: LogEntry[];
    errors: Error[];
}>({
    page: async ({ page }, use, testInfo) => {
        const failedRequests: ErrorRequest[] = [];
        const logs: LogEntry[] = [];
        const errors: Error[] = [];

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

                failedRequests.push({ url, status, responseBody });

                console.log(`❌ FAILED REQUEST:`);
                console.log(`   URL: ${url}`);
                console.log(`   Status: ${status}`);
                console.log(`   Response Body: ${responseBody}`);
                console.log(`   --------------------`);
            }
        });

        page.on("console", (msg) => {
            const logEntry = { 
                message: msg.text(), 
                type: msg.type(),
                timestamp: Date.now()
            };
            logs.push(logEntry);
            
            if (msg.type() === 'error' || msg.type() === 'warning') {
                console.log(`🚨 Console ${msg.type()}:`, msg.text());
            }
        });

        page.on("pageerror", (err) => {
            errors.push(err);
            console.log('🚨 Page error:', err.message);
        });

        await use(page);

        if (failedRequests.length > 0) {
            await testInfo.attach("failed-requests.json", {
                body: JSON.stringify(failedRequests, null, 2),
                contentType: "application/json",
            });
            console.log(`Hey there were Failed requests: ${failedRequests.length}`);
        }

        if (logs.length > 0 || errors.length > 0) {
            await testInfo.attach("console-logs.json", {
                body: JSON.stringify(logs, null, 2),
                contentType: "application/json",
            });

            await testInfo.attach("page-errors.json", {
                body: JSON.stringify(errors.map(err => ({
                    message: err.message,
                    stack: err.stack,
                    timestamp: Date.now()
                })), null, 2),
                contentType: "application/json",
            });
        }
    },

    logs: async ({}, use) => {
        await use([]);
    },

    errors: async ({}, use) => {
        await use([]);
    },
});

export const expect = base.expect;

test.afterEach(async ({ logs, errors }) => {
    const errorLogs = logs.filter(log => log.type === 'error' || log.type === 'warning');
    
    if (errorLogs.length > 0) {
        console.log('=== CONSOLE ERRORS/WARNINGS FOUND ===');
        errorLogs.forEach((log, index) => {
            console.log(`${index + 1}. [${log.type.toUpperCase()}] ${log.message}`);
        });
    }
    
    if (errors.length > 0) {
        console.log('=== PAGE ERRORS FOUND ===');
        errors.forEach((error, index) => {
            console.log(`${index + 1}. ${error.message}`);
        });
    }
    
    expect(errorLogs, `Console errors/warnings found: ${JSON.stringify(errorLogs)}`).toHaveLength(0);
    expect(errors, `Page errors found: ${errors.map(e => e.message).join(', ')}`).toHaveLength(0);
});