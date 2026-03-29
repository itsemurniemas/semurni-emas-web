import { ApiUseCase } from "../../base/ApiUseCase";

export class Logout extends ApiUseCase<void, void> {
    async execute(): Promise<void> {
        // Mock implementation simulating API call for logout cleanup if needed
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 500);
        });
    }
}
